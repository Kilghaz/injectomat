import { InstanceDecorator } from "./types/instance-decorator";
import { Token } from './types/token';
import { Provider } from './types/provider';
import { ScopeMetadata } from './metadata/injection-metadata';
import { InjectionScope } from './types/injection-scope';
import { ModuleIdMetaKey } from './tokens';
import { Constructor } from './types/constructor';


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

    static createKey<T>(token: Token<T>, constructor: Constructor<T>, provider: Provider<T>): string {
        const scope = ScopeMetadata.get(constructor);

        if (scope === InjectionScope.Global) {
            return constructor.name;
        }

        if (scope === InjectionScope.Module) {
            return provider.meta?.[ModuleIdMetaKey] + constructor.name;
        }

        if (scope === InjectionScope.Token) {
            return token + constructor.name;
        }

        return constructor.name;
    };
}
