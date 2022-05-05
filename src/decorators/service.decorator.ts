import "reflect-metadata";
import { InjectionScope } from "../types/injection-scope";
import { ScopeMetadata, TokenMetadata, TypeMetadata } from "../metadata/injection-metadata";
import { InjectionType } from "../types/injection-type";

type ServiceOptions = {
    token: string;
    scope: InjectionScope;
};

export function service(options: Partial<ServiceOptions> = {}): ClassDecorator {
    return function (constructor) {
        TypeMetadata.set(constructor, InjectionType.Class);
        TokenMetadata.set(constructor, options.token ?? constructor.name);
        ScopeMetadata.set(constructor, options.scope ?? InjectionScope.Module);
        return constructor;
    };
}
