export type Metadata<T> = {
    get(target: unknown): T;
    set(target: unknown, value?: T): void;
};

export type ListMetadata<T> = Metadata<T[]> & {
    add(target: unknown, value: T): void;
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

export const createListMetadata = <T>(key: string): ListMetadata<T> => {
    const metadata = createMetadata<T[]>(key, []);

    const add = <K>(target: K, value: T) => {
        metadata.set(target, [...metadata.get(target), value]);
    };

    return {
        ...metadata,
        add,
    };
};
