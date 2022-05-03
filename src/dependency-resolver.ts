import { UnregisteredTokenError } from "@/errors/unregistered-token.error";
import { getConstructorParametersMetadata } from "@/metadata/constructor-parameters-metadata";
import { ParameterMetadataMissingError } from "@/errors/parameter-metadata-missing.error";
import { Token } from "@/types/token";
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
} from "@/types/provider";
import { InjectionScope } from "@/types/injection-scope";
import { ScopeMetadata } from "@/metadata/injection-metadata";
import _ from "lodash";
import { Context } from "@/context";
import { ModuleIdMetaKey } from "@/tokens";
import { Optional } from "@/types/optional.type";
import { ProviderContainer } from '@/provider-container';
import { toStringToken } from '@/types/string-token.type';

type Constructor<T> = {
    new(...args: never[]): T;
};

const instanceIdentifier = <T>(token: Token<T>, constructor: Constructor<T>, provider: Provider<T>): string => {
    const scope = ScopeMetadata.get(constructor);

    if (scope === InjectionScope.Global) {
        return constructor.name;
    }

    if (scope === InjectionScope.Module) {
        return provider.meta?.[ModuleIdMetaKey] + constructor.name;
    }

    if (scope === InjectionScope.Token) {
        return token + constructor.name;
    }

    return constructor.name;
};

const getModuleId = (provider: Provider<unknown>): Optional<string> => {
    return (provider.meta ?? {})[ModuleIdMetaKey];
};

const bestProvider = (providers: Provider<unknown>[], context: Context, from?: string): Provider<unknown> => {
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

export type DependencyResolver = {
    resolve<T = never>(token: Token<T>): T;
    resolveAll<T = never>(token: Token<T>): T[];
}

export const createDependencyResolver = (
    container: ProviderContainer,
    context: Context): DependencyResolver => {

    const resolveFactoryProvider = <T>(
        token: Token<T>,
        provider: FactoryProvider<T>,
    ): T => {
        return provider.useFactory(
            <K>(token: Token<K>) => {
                return resolve<K>(token);
            },
            <K>(token: Token<K>) => {
                return resolveAll<K>(token);
            }
        );
    };

    const resolveClassProvider = <T>(
        token: Token<T>,
        provider: ClassProvider<T>,
        meta: Record<string, string> = {}
    ): T => {
        const constructor = provider.useClass;
        const identifier = instanceIdentifier(token, constructor, provider);
        const currentModule = meta[ModuleIdMetaKey];

        if (container.getInstance(identifier)) {
            return container.getInstance(identifier) as T;
        }

        const params = getConstructorParametersMetadata(constructor);
        const resolved = params.map((it, index) => {
            if (it.token === undefined) {
                throw new ParameterMetadataMissingError(constructor, index, it);
            }
            return it.multi
                ? (resolveAll(it.token) as never)
                : resolve(it.token, currentModule);
        });

        const instance = new constructor(...resolved);
        return container.setInstance(identifier, instance);
    };

    const resolveTokenProvider = <T>(
        token: Token<T>,
        provider: TokenProvider<T>,
    ): T => {
        return resolve(toStringToken(provider.useToken));
    };

    const resolveValueProvider = <T>(token: Token<T>, provider: ValueProvider<T>): T => {
        return provider.useValue;
    };

    const resolveProvider = <T = never>(
        token: Token<T>,
        provider: Provider<unknown>,
    ): T => {
        const stringToken = toStringToken(token);

        if (provider === undefined) {
            throw new UnregisteredTokenError(stringToken);
        }

        const meta = provider.meta;

        if (isFactoryProvider<T>(provider)) {
            return resolveFactoryProvider(token, provider);
        }

        if (isClassProvider<T>(provider)) {
            return resolveClassProvider<T>(token, provider, meta);
        }

        if (isTokenProvider<T>(provider)) {
            return resolveTokenProvider<T>(token, provider);
        }

        if (isValueProvider<T>(provider)) {
            return resolveValueProvider(token, provider);
        }

        return provider as never;
    };

    const resolve = <T = never>(token: Token<T>, from?: string):T => {
        const stringToken = toStringToken(token);
        const providers = (container.inject<Provider<T>[]>(stringToken) ?? []).reverse();
        const provider = bestProvider(providers, context, from);

        return resolveProvider(token, provider);
    };

    const resolveAll = <T = never>(token: Token<T>): T[] => {
        const stringToken = toStringToken(token);

        return (container.inject<Provider<T>[]>(stringToken) ?? []).map((provider) =>
            resolveProvider(token, provider)
        );
    };

    return {
        resolve,
        resolveAll,
    }
};
