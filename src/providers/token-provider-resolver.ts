import { ProviderResolver } from '../types/provider-resolver';
import { isTokenProvider, Provider, TokenProvider } from '../types/provider';
import { toStringToken } from '../types/string-token';
import { DependencyResolver } from '../dependency-resolver';

export class TokenProviderResolver implements ProviderResolver<TokenProvider> {

    constructor(private readonly dependencyResolver: DependencyResolver) {
    }

    resolveProvider<K>(provider: TokenProvider): K {
        return this.dependencyResolver.resolve(toStringToken(provider.useToken));
    }

    canResolveProvider(provider: Provider<any>): boolean {
        return isTokenProvider(provider);
    }

}
