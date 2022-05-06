import { Provider } from './provider';
import { Token } from './token';

export type ProviderResolver<T extends Provider<any> = Provider<any>> = {
    resolveProvider<K = unknown>(provider: T, token: Token<K>, meta: Record<string, string>): K;
    canResolveProvider(provider: Provider<any>): boolean;
};
