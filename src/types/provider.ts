import _ from "lodash";
import { Token } from "@/types/token";

type Constructor<T> = { new(...args: never[]): T };

export type Factory<T> = (resolve: <K>(token: Token<K>) => K, resolveAll: <K>(token: Token<K>) => K[]) => T;

type StringToken = string;
type ClassToken<T> = Constructor<T>;
type ProviderToken<T> = StringToken | ClassToken<T>;

export type LiteralClassProvider<T = unknown> = Constructor<T>;

export type ClassProvider<T = unknown> = {
    token: ProviderToken<T>;
    useClass: Constructor<T>;
    params?: Record<string, unknown>;
};

export type ValueProvider<T = unknown> = {
    token: ProviderToken<T>;
    useValue: T;
};

export type FactoryProvider<T = unknown> = {
    token: ProviderToken<T>;
    useFactory: Factory<T>;
};

export type TokenProvider<T = unknown> = {
    token: ProviderToken<T>;
    useToken: ProviderToken<T>;
};

type AnyProvider<T> = ({ token: ProviderToken<T> } & (ValueProvider<T> | ClassProvider<T> | FactoryProvider<T> | TokenProvider<T>)) | LiteralClassProvider<T>;

export type Provider<T> = AnyProvider<T> & { meta?: Record<string, string> };

export const isClassProvider = <T>(it: unknown): it is ClassProvider<T> => {
    return _.has(it, "useClass") && _.has(it, "token");
};

export const isValueProvider = <T>(it: unknown): it is ValueProvider<T> => {
    return _.has(it, "useValue") && _.has(it, "token");
};

export const isFactoryProvider = <T>(it: unknown): it is FactoryProvider<T> => {
    return _.has(it, "useFactory") && _.has(it, "token");
};

export const isTokenProvider = <T>(it: unknown): it is TokenProvider<T> => {
    return _.has(it, "useToken") && _.has(it, "token");
};

export const isLiteralClassProvider = (it: unknown): it is LiteralClassProvider => {
    return !_.has(it, "token");
};

export const toClassProvider = <T>(it: LiteralClassProvider<T>): ClassProvider<T> => {
    return {
        token: it,
        useClass: it,
    };
};
