import _ from "lodash";

const keyPrefix = "di:constructor-parameter";

const parameterTokenKey = (index: number) => `${keyPrefix}:${index}:token`;
const parameterMultiKey = (index: number) => `${keyPrefix}:${index}:multi`;

export type ConstructorParameterMetadata<T = never> = {
    token: string;
    multi: boolean;
    type: T;
};

export const setConstructorParameterInjectionToken = <T = never>(
    constructor: T,
    index: number,
    token: string,
    multi = false
): void => {
    Reflect.defineMetadata(parameterTokenKey(index), token, constructor);
    Reflect.defineMetadata(parameterMultiKey(index), multi, constructor);
};

const hasParameterMetadata = <T>(constructor: T, index: number): boolean => {
    return Reflect.hasMetadata(parameterTokenKey(index), constructor);
};

const isClass = (type: unknown): type is { new(...args: []): unknown } => {
    return _.isFunction(type) && _.has(type, "name");
};

const getConstructorParameterMetadata = <T>(
    constructor: T,
    index: number,
    type: unknown
): Omit<ConstructorParameterMetadata, "type"> | undefined => {
    if (!hasParameterMetadata(constructor, index)) {
        if (isClass(type)) {
            return {
                token: type.name,
                multi: false,
            };
        }
        return undefined;
    }

    const token = Reflect.getMetadata(parameterTokenKey(index), constructor);
    const multi = Reflect.getMetadata(parameterMultiKey(index), constructor);

    return {
        token,
        multi,
    };
};

export const getConstructorParametersMetadata = <T>(constructor: T): ConstructorParameterMetadata[] => {
    const parameters = Reflect.getMetadata("design:paramtypes", constructor) ?? [];

    return parameters.map((it: unknown, index: number) => {
        const knownMeta = getConstructorParameterMetadata(constructor, index, it) ?? {};

        return {
            type: it,
            ...knownMeta,
        };
    });
};
