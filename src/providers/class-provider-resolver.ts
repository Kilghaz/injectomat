import { ProviderResolver } from '../types/provider-resolver.type';
import { ClassProvider, isClassProvider, Provider } from '../types/provider';
import { Token } from '../types/token';
import { InstanceManager } from '../instance-manager';
import { ModuleIdMetaKey } from '../tokens';
import { getConstructorParametersMetadata } from '../metadata/constructor-parameters-metadata';
import { ParameterMetadataMissingError } from '../errors/parameter-metadata-missing.error';
import { DependencyResolver } from '../dependency-resolver';
import { LifetimeMetadata } from '../metadata/injection-metadata';
import { Lifetime } from '../types/lifetime.type';

export class ClassProviderResolver implements ProviderResolver<ClassProvider> {
    constructor(private readonly instanceManager: InstanceManager,
                private readonly dependencyResolver: DependencyResolver) {
    }

    resolveProvider<T = unknown>(provider: ClassProvider, token: Token, meta: Record<string, string>): T {
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
                ? (this.dependencyResolver.resolveAll(it.token) as never)
                : this.dependencyResolver.resolve(it.token, currentModule);
        });

        const instance = new constructor(...resolved);

        if (LifetimeMetadata.get(constructor) === Lifetime.Transient) {
            return instance as T;
        }

        return this.instanceManager.setInstance(identifier, instance) as T;
    }

    canResolveProvider(provider: Provider<any>): boolean {
        return isClassProvider(provider);
    }
}
