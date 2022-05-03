import { setConstructorParameterInjectionToken } from "@/metadata/constructor-parameters-metadata";
import { Token } from "@/types/token";
import { toStringToken } from '@/types/string-token.type';

export function injectAll(token: Token): ParameterDecorator {
    const stringToken = toStringToken(token);
    return function (target, propertyKey, parameterIndex) {
        setConstructorParameterInjectionToken(target, parameterIndex, stringToken, true);
        return target;
    };
}
