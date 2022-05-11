import { setConstructorParameterInjectionToken } from "../metadata/constructor-parameters-metadata";
import { Token } from "../types/token";
import { toStringToken } from '../types/string-token';
import { PropertiesMetadata } from '../metadata/injection-metadata';

export function injectAll(token?: Token): any {
    return function (target: any, propertyKey: string, parameterIndex: number) {
        if (parameterIndex !== undefined) {
            const stringToken = toStringToken(token ?? Reflect.getMetadata("design:paramtypes", target)[parameterIndex]);
            setConstructorParameterInjectionToken(target, parameterIndex, stringToken, true);
            return target;
        }

        const meta = Reflect.getMetadata("design:type", target, propertyKey);
        PropertiesMetadata.set(target, [...PropertiesMetadata.get(target), {
            token: token ?? meta?.name,
            name: propertyKey as string,
            multi: true,
        }]);

    };
}
