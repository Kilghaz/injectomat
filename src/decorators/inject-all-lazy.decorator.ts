import { LazyPropertiesMetadata } from '../metadata/injection-metadata';
import { Token } from '../types/token';

export function injectAllLazy(token?: Token) {
    return (target: any, propertyKey: string) => {
        const meta = Reflect.getMetadata("design:type", target, propertyKey);
        LazyPropertiesMetadata.set(target, [...LazyPropertiesMetadata.get(target), {
            token: token ?? meta?.name,
            name: propertyKey,
            multi: true,
        }]);
    }
}
