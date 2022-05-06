import { ProviderResolver } from '../types/provider-resolver.type';
import { isValueProvider, Provider, ValueProvider } from '../types/provider';

export class ValueProviderResolver implements ProviderResolver<ValueProvider> {
    resolveProvider<K>(provider: ValueProvider<any>): K {
        return provider.useValue;
    }

    canResolveProvider(provider: Provider<any>): boolean {
        return isValueProvider(provider);
    }
}
