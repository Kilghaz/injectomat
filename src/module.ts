import _ from "lodash";
import { isLiteralClassProvider, Provider, toClassProvider } from "./types/provider";
import { InjectionContainer, } from "./injection-container";
import { v4 as uuid } from "uuid";
import { Context, globalModuleContext } from "./context";
import { ModuleIdMetaKey } from "./tokens";
import { Component } from './types/component.type';
import { ModuleOptions } from './types/module-options.type';

export class Module {
    private readonly id = uuid();

    public components: Component[];
    public imports: Module[];
    public providers: Provider<unknown>[];
    public context: Context;
    public root: boolean;

    constructor(options: ModuleOptions) {
        this.components = options.components ?? [];
        this.imports = options.imports ?? [];
        this.providers = options.providers ?? [];
        this.context = options.context ?? globalModuleContext;
        this.root = options.root ?? false;

        this.context.register(this);

        options.providers = options.providers?.map((it) => {
            let provider = it;
            if (isLiteralClassProvider(it)) {
                provider = toClassProvider(it);
            }
            provider.meta = { ...it.meta, [ModuleIdMetaKey]: this.id };
            return provider;
        });
    }

    getId(): string {
        return this.id;
    }

    provideAll(container: InjectionContainer): void {
        const providers = _.uniq(this.resolveProviders());

        _.forEach(_.groupBy(providers, "token"), (providers) => {
            providers.forEach((it) => container.provide(it));
        });
    }

    private resolveProviders(current: Module = this): Provider<unknown>[] {
        const imports = current.imports ?? [];
        const providers = current.providers ?? [];

        const importedProviders = imports.flatMap((it) => this.resolveProviders(it));

        return [...providers, ...importedProviders];
    };

}
