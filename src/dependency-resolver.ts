import { UnregisteredTokenError } from "./errors/unregistered-token.error";
import { Token } from "./types/token";
import { Provider, } from "./types/provider";
import _ from "lodash";
import { Context } from "./context";
import { ModuleIdMetaKey } from "./tokens";
import { Optional } from "./types/optional.type";
import { ProviderContainer } from './provider-container';
import { toStringToken } from './types/string-token.type';
import { InstanceManager } from './instance-manager';
import { ProviderSelector } from './types/provider-selector.type';
import { ProviderResolver } from './types/provider-resolver.type';
import { FactoryProviderResolver } from './providers/factory-provider-resolver';
import { ClassProviderResolver } from './providers/class-provider-resolver';
import { TokenProviderResolver } from './providers/token-provider-resolver';
import { ValueProviderResolver } from './providers/value-provider-resolver';

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
    private providerResolvers: ProviderResolver[] = [
        new FactoryProviderResolver(this),
        new ClassProviderResolver(this.instanceManager, this),
        new TokenProviderResolver(this),
        new ValueProviderResolver(),
    ];

    constructor(private readonly instanceManager: InstanceManager,
                private readonly container: ProviderContainer,
                private readonly context: Context) {
    }

    setProviderSelector(selector: ProviderSelector): void {
        this.providerSelector = selector;
    }

    private resolveProvider<T = never>(
        token: Token<T>,
        provider: Provider<unknown>,
    ): T {
        const stringToken = toStringToken(token);

        if (provider === undefined) {
            throw new UnregisteredTokenError(stringToken);
        }

        const resolver = this.providerResolvers.find((it) => it.canResolveProvider(provider));

        if (!resolver) {
            return provider as never;
        }

        return resolver.resolveProvider(provider, token, provider.meta ?? {});
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
