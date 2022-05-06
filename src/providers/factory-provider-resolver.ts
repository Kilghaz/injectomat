import { ProviderResolver } from '../types/provider-resolver.type';
import { FactoryProvider, isFactoryProvider, Provider } from '../types/provider';
import { Token } from '../types/token';
import { DependencyResolver } from '../dependency-resolver';

export class FactoryProviderResolver implements ProviderResolver<FactoryProvider> {

    constructor(private readonly dependencyResolver: DependencyResolver) {
    }

    resolveProvider<T>(provider: FactoryProvider, token: Token): T {
        return provider.useFactory(
            <K>(token: Token<K>) => {
                return this.dependencyResolver.resolve<K>(token);
            },
            <K>(token: Token<K>) => {
                return this.dependencyResolver.resolveAll<K>(token);
            }
        ) as T;
    }

    canResolveProvider(provider: Provider<any>): boolean {
        return isFactoryProvider(provider);
    }

}
