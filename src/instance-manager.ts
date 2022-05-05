import { InstanceDecorator } from "./types/instance-decorator";

export class InstanceManager {
    private readonly instances: Map<string, unknown> = new Map<string, unknown>();

    constructor(private readonly decorators: InstanceDecorator[] = []) {
    }

    setInstance<T>(key: string, value: T): T {
        for (const decorator of this.decorators) {
            value = decorator(value);
        }

        this.instances.set(key, value);
        return value;
    };

    getInstance<T = unknown>(key: string): T {
        return this.instances.get(key) as T;
    };
}
