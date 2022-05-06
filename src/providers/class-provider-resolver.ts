import { ProviderResolver } from '../types/provider-resolver.type';
import { ClassProvider, isClassProvider, Provider } from '../types/provider';
import { Token } from '../types/token';
import { InstanceManager } from '../instance-manager';
import { ModuleIdMetaKey } from '../tokens';
import { getConstructorParametersMetadata } from '../metadata/constructor-parameters-metadata';
import { ParameterMetadataMissingError } from '../errors/parameter-metadata-missing.error';
import { DependencyResolver } from '../dependency-resolver';
import { LazyPropertiesMetadata, LifetimeMetadata, PropertiesMetadata } from '../metadata/injection-metadata';
import { Lifecycle } from '../types/lifecycle.type';
import { Constructor } from '../types/constructor.type';

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

        const args = this.resolveConstructorArgs(constructor, currentModule);
        const instance = new constructor(...args);
        this.resolveProperties(instance, currentModule);
        this.resolveLazyProperties(instance, currentModule);

        if (LifetimeMetadata.get(constructor) === Lifecycle.Transient) {
            return instance as T;
        }

        return this.instanceManager.setInstance(identifier, instance) as T;
    }

    canResolveProvider(provider: Provider<any>): boolean {
        return isClassProvider(provider);
    }

    private resolveConstructorArgs<T = unknown>(constructor: Constructor<T>, from?: string): never[] {
        const params = getConstructorParametersMetadata(constructor);
        return params.map((it, index) => {
            if (it.token === undefined) {
                throw new ParameterMetadataMissingError(constructor, index, it);
            }
            return this.resolve(it.token, it.multi, from);
        });
    }

    private resolveProperties(instance: any, from?: string): void {
        const props = PropertiesMetadata.get(instance);
        props.forEach((it) => {
            instance[it.name] = this.resolve(it.token, it.multi, from);
        });
    }

    private resolveLazyProperties(instance: any, from?: string): void {
        const props = LazyPropertiesMetadata.get(instance);
        props.forEach((it) => {
            setTimeout(() => {
                instance[it.name] = this.resolve(it.token, it.multi, from);
            }, 0);
        });
    }

    private resolve(token: Token, multi: boolean, from?: string): never {
        return (multi ? this.dependencyResolver.resolveAll(token) : this.dependencyResolver.resolve(token, from)) as never;
    }
}
