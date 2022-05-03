export type Metadata<T> = {
    get(target: unknown): T;
    set(target: unknown, value?: T): void;
};

export const createMetadata = <T>(key: string, fallback: T): Metadata<T> => {
    const set = <K>(target: K, value?: T): void => {
        Reflect.defineMetadata(key, value ?? fallback, target);
    };

    const get = <K>(target: K): T => {
        try {
            return Reflect.getMetadata(key, target) ?? fallback;
        } catch (e) {
            return fallback;
        }
    };

    return {
        get,
        set,
    };
};
