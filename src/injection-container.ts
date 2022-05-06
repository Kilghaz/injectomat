import { Token } from "./types/token";
import { ProviderContainer } from './provider-container';
import { DependencyResolver } from './dependency-resolver';
import { Context } from './context';
import { isLiteralClassProvider, Provider, toClassProvider } from './types/provider';
import { InstanceManager } from './instance-manager';
import { InjectionContainerToken } from './tokens';
import { Module } from './module';
import _ from 'lodash';

export class InjectionContainer {
    private readonly dependencyResolver: DependencyResolver;

    constructor(private readonly instanceManager: InstanceManager = new InstanceManager(),
                private readonly providerContainer: ProviderContainer = new ProviderContainer(),
                private readonly context: Context = new Context()) {
        this.dependencyResolver = new DependencyResolver(
            instanceManager,
            providerContainer,
            context
        );

        this.provide({ token: InjectionContainerToken, useValue: this });
    }

    registerRootModule(module: Module) {
        this.context.registerRootModule(module);
        this.provideAll(module);
    }

    provide<T>(provider: Provider<T>): void {
        if (isLiteralClassProvider(provider)) {
            const classProvider = toClassProvider(provider);
            this.providerContainer.add(classProvider.token, [classProvider]);
            return;
        }
        this.providerContainer.add(provider.token, [provider]);
    }

    resolve<T>(token: Token<T>): T {
        return this.dependencyResolver.resolve(token);
    }

    resolveAll<T>(token: Token<T>): T[] {
        return this.dependencyResolver.resolveAll(token);
    }

    private provideAll(module: Module): void {
        const providers = _.uniq(this.resolveProviders(module));

        _.forEach(_.groupBy(providers, "token"), (providers) => {
            providers.forEach((it) => this.provide(it));
        });
    }

    private resolveProviders(module: Module): Provider<unknown>[] {
        const imports = module.imports ?? [];
        const providers = module.providers ?? [];

        const importedProviders = imports.flatMap((it) => this.resolveProviders(it));
        return [...providers, ...importedProviders];
    };

}
