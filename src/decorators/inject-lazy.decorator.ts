import { LazyPropertiesMetadata } from '../metadata/injection-metadata';

export function injectLazy(token?: string) {
    return (target: any, propertyKey: string) => {
        const meta = Reflect.getMetadata("design:type", target, propertyKey);
        LazyPropertiesMetadata.set(target, [...LazyPropertiesMetadata.get(target), {
            token: token ?? meta?.name,
            name: propertyKey,
            multi: false,
        }]);
    }
}
