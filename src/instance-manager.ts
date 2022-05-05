import { InstanceSetup } from "./types/instance-setup";

export type InstanceManager = {
    setInstance<T>(key: string, value: T): T;
    getInstance<T = unknown>(key: string): T;
};

export const createInstanceManager = (decorators: InstanceSetup[] = []): InstanceManager => {
    const instances: Map<string, unknown> = new Map<string, unknown>();

    const setInstance = <T>(key: string, value: T): T => {
        for (const decorator of decorators) {
            value = decorator(value);
        }

        instances.set(key, value);
        return value;
    };

    const getInstance = <T = unknown>(key: string): T => {
        return instances.get(key) as T;
    };

    return {
        getInstance,
        setInstance,
    };
};

