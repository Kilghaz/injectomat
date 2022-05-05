import { Token } from './types/token';
import { Provider } from './types/provider';
import { Optional } from './types/optional.type';
import { toStringToken } from './types/string-token.type';

export class ProviderContainer {
    private readonly providers: Map<string, Provider<unknown>[]> = new Map<string, Provider<unknown>[]>();

    getAll<T>(token: Token<T>): Optional<Provider<T>[]> {
        return this.providers.get(toStringToken(token)) as Provider<T>[];
    }

    add<T = unknown>(token: Token<T>, value: Provider<T>[]): void {
        const stringToken = toStringToken(token);
        const current = this.providers.get(stringToken) ?? [];
        this.providers.set(stringToken, [...current, ...value]);
    }
}
