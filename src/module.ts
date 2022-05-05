import _ from "lodash";
import { isLiteralClassProvider, Provider, toClassProvider } from "./types/provider";
import { InjectionContainer, } from "./injection-container";
import { v4 as uuid } from "uuid";
import { Context, globalModuleContext } from "./context";
import { ModuleIdMetaKey } from "./tokens";
import { Component } from './types/component.type';

export type ModuleOptions = {
    components?: Component[];
    imports?: Module[];
    providers?: Provider<unknown>[];
    context?: Context;
    root?: boolean;
};

export type Module = ModuleOptions & {
    getId(): string;
    provideAll(container: InjectionContainer): void;
};

export const createModule = (options: ModuleOptions): Module => {
    const id = uuid();
    const context = options.context ?? globalModuleContext;

    options.providers = options.providers?.map((it) => {
        let provider = it;
        if (isLiteralClassProvider(it)) {
            provider = toClassProvider(it);
        }
        provider.meta = { ...it.meta, [ModuleIdMetaKey]: id };
        return provider;
    });

    const resolveProviders = (current: ModuleOptions = options): Provider<unknown>[] => {
        const imports = current.imports ?? [];
        const providers = current.providers ?? [];

        const importedProviders = imports.flatMap((it) => resolveProviders(it));

        return [...providers, ...importedProviders];
    };

    const provideAll = (container: InjectionContainer) => {
        const providers = _.uniq(resolveProviders());

        _.forEach(_.groupBy(providers, "token"), (providers) => {
            providers.forEach((it) => container.provide(it));
        });
    };

    const getId = (): string => {
        return id;
    };

    const self: Module = {
        ...options,
        getId,
        provideAll,
    };

    context.register(self);

    return self;
};
