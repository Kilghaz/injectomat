import "reflect-metadata";
import { InjectionScope } from "../types/injection-scope";
import { LifetimeMetadata, ScopeMetadata, TokenMetadata, TypeMetadata } from "../metadata/injection-metadata";
import { InjectionType } from "../types/injection-type";
import { Lifecycle } from '../types/lifecycle.type';

type ServiceOptions = {
    token: string;
    scope: InjectionScope;
    lifetime: Lifecycle;
};

export function injectable(options: Partial<ServiceOptions> = {}): ClassDecorator {
    return function (constructor) {
        TypeMetadata.set(constructor, InjectionType.Class);
        TokenMetadata.set(constructor, options.token ?? constructor.name);
        ScopeMetadata.set(constructor, options.scope ?? InjectionScope.Module);
        LifetimeMetadata.set(constructor, options.lifetime ?? Lifecycle.Singleton);
        return constructor;
    };
}
