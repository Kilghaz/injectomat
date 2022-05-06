import { UnregisteredTokenError } from "./errors/unregistered-token.error";
import { getConstructorParametersMetadata } from "./metadata/constructor-parameters-metadata";
import { ParameterMetadataMissingError } from "./errors/parameter-metadata-missing.error";
import { Token } from "./types/token";
import {
    ClassProvider,
    FactoryProvider,
    isClassProvider,
    isFactoryProvider,
    isTokenProvider,
    isValueProvider,
    Provider,
    TokenProvider,
    ValueProvider,
} from "./types/provider";
import _ from "lodash";
import { Context } from "./context";
import { ModuleIdMetaKey } from "./tokens";
import { Optional } from "./types/optional.type";
import { ProviderContainer } from './provider-container';
import { toStringToken } from './types/string-token.type';
import { InstanceManager } from './instance-manager';
import { ProviderSelector } from './types/provider-selector.type';

const getModuleId = (provider: Provider<unknown>): Optional<string> => {
    return (provider.meta ?? {})[ModuleIdMetaKey];
};

const defaultProviderSelector: ProviderSelector = (providers: Provider<unknown>[], context: Context, from?: string): Provider<unknown> => {
    const moduleIds = _.uniq(_.compact(providers.map(getModuleId)));

    if (providers.length === 1 || !from || moduleIds.length === 1) {
        return providers[0];
    }

    const sortedProviders = providers
        .filter((it) => {
            return getModuleId(it);
        })
        .map((it) => ({
            ...it,
            distance: context.distance(from, getModuleId(it) ?? ""),
        }) as Provider<unknown> & { distance: number })
        .sort((a, b) => a.distance - b.distance);

    return sortedProviders[0];
};

export class DependencyResolver {

    private providerSelector: ProviderSelector = defaultProviderSelector;

    constructor(private readonly instanceManager: InstanceManager,
                private readonly container: ProviderContainer,
                private readonly context: Context) {
    }

    setProviderSelector(selector: ProviderSelector): void {
        this.providerSelector = selector;
    }

    private resolveFactoryProvider<T>(
        token: Token<T>,
        provider: FactoryProvider<T>,
    ): T {
        return provider.useFactory(
            <K>(token: Token<K>) => {
                return this.resolve<K>(token);
            },
            <K>(token: Token<K>) => {
                return this.resolveAll<K>(token);
            }
        );
    }

    private resolveClassProvider<T>(
        token: Token<T>,
        provider: ClassProvider<T>,
        meta: Record<string, string> = {}
    ): T {
        const constructor = provider.useClass;
        const identifier = InstanceManager.createKey(token, constructor, provider);
        const currentModule = meta[ModuleIdMetaKey];

        if (this.instanceManager.getInstance(identifier)) {
            return this.instanceManager.getInstance(identifier) as T;
        }

        const params = getConstructorParametersMetadata(constructor);
        const resolved = params.map((it, index) => {
            if (it.token === undefined) {
                throw new ParameterMetadataMissingError(constructor, index, it);
            }
            return it.multi
                ? (this.resolveAll(it.token) as never)
                : this.resolve(it.token, currentModule);
        });

        const instance = new constructor(...resolved);
        return this.instanceManager.setInstance(identifier, instance);
    }

    private resolveTokenProvider<T>(
        token: Token<T>,
        provider: TokenProvider<T>,
    ): T {
        return this.resolve(toStringToken(provider.useToken));
    }

    private resolveValueProvider<T>(token: Token<T>, provider: ValueProvider<T>): T {
        return provider.useValue;
    }

    private resolveProvider<T = never>(
        token: Token<T>,
        provider: Provider<unknown>,
    ): T {
        const stringToken = toStringToken(token);

        if (provider === undefined) {
            throw new UnregisteredTokenError(stringToken);
        }

        const meta = provider.meta;

        if (isFactoryProvider<T>(provider)) {
            return this.resolveFactoryProvider(token, provider);
        }

        if (isClassProvider<T>(provider)) {
            return this.resolveClassProvider<T>(token, provider, meta);
        }

        if (isTokenProvider<T>(provider)) {
            return this.resolveTokenProvider<T>(token, provider);
        }

        if (isValueProvider<T>(provider)) {
            return this.resolveValueProvider(token, provider);
        }

        return provider as never;
    }

    resolve<T = never>(token: Token<T>, from?: string): T {
        const stringToken = toStringToken(token);
        const providers = (this.container.getAll<Provider<T>[]>(stringToken) ?? []).reverse();
        const provider = this.providerSelector(providers, this.context, from);
        return this.resolveProvider(token, provider);
    }

    resolveAll<T = never>(token: Token<T>): T[] {
        const stringToken = toStringToken(token);

        return (this.container.getAll<Provider<T>[]>(stringToken) ?? []).map((provider) =>
            this.resolveProvider(token, provider)
        );
    }
}
