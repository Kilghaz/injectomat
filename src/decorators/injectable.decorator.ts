import "reflect-metadata";
import { InjectionScope } from "../types/injection-scope";
import { LifetimeMetadata, ScopeMetadata, TokenMetadata, TypeMetadata } from "../metadata/injection-metadata";
import { InjectionType } from "../types/injection-type";
import { Lifetime } from '../types/lifetime.type';

type ServiceOptions = {
    token: string;
    scope: InjectionScope;
    lifetime: Lifetime;
};

export function injectable(options: Partial<ServiceOptions> = {}): ClassDecorator {
    return function (constructor) {
        TypeMetadata.set(constructor, InjectionType.Class);
        TokenMetadata.set(constructor, options.token ?? constructor.name);
        ScopeMetadata.set(constructor, options.scope ?? InjectionScope.Module);
        LifetimeMetadata.set(constructor, options.lifetime ?? Lifetime.Singleton);
        return constructor;
    };
}
