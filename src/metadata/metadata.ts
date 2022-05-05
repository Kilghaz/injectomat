export class Metadata<T> {
    constructor(private readonly key: string,
                private readonly fallback: T) {
    }

    get<K = unknown>(target: K): T {
        try {
            return Reflect.getMetadata(this.key, target) ?? this.fallback;
        } catch (e) {
            return this.fallback;
        }
    }

    set<K = unknown>(target: K, value?: T): void {
        Reflect.defineMetadata(this.key, value ?? this.fallback, target);
    }
}
