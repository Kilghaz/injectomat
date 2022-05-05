import { Token } from "./types/token";
import { ProviderContainer } from './provider-container';
import { DependencyResolver } from './dependency-resolver';
import { Context, globalModuleContext } from './context';
import { isLiteralClassProvider, Provider, toClassProvider } from './types/provider';
import { InstanceManager } from './instance-manager';
import { InjectionContainerToken } from './tokens';

export class InjectionContainer {
    private readonly dependencyResolver: DependencyResolver;

    constructor(private readonly instanceManager: InstanceManager = new InstanceManager(),
                private readonly providerContainer: ProviderContainer = new ProviderContainer(),
                private readonly context: Context = globalModuleContext) {
        this.dependencyResolver = new DependencyResolver(
            instanceManager,
            providerContainer,
            context
        );

        this.provide({ token: InjectionContainerToken, useValue: this });
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
}
