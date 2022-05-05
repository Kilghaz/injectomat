import { Token } from './types/token';
import { Provider } from './types/provider';
import { Optional } from './types/optional.type';
import { InstanceManager } from './instance-manager';
import { toStringToken } from './types/string-token.type';

export type ProviderContainer = InstanceManager & {
    inject<T>(token: Token<T>): Optional<Provider<T>[]>;
    provide<T = unknown>(token: Token<T>, value: Provider<T>[]): void;
};

export const createProviderContainer = (instanceManager: InstanceManager): ProviderContainer => {
    const providers: Map<string, Provider<unknown>[]> = new Map<string, Provider<unknown>[]>();

    const provide = <T>(token: Token<T>, value: Provider<T>[]): void => {
        const stringToken = toStringToken(token);
        const current = providers.get(stringToken) ?? [];
        providers.set(stringToken, [...current, ...value]);
    };

    const inject = <T>(token: Token<T>): Optional<Provider<T>[]> => {
        return providers.get(toStringToken(token)) as Provider<T>[];
    };

    return {
        ...instanceManager,
        inject,
        provide
    }
};
