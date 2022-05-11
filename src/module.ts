import { isLiteralClassProvider, Provider, toClassProvider } from "./types/provider";
import { v4 as uuid } from "uuid";
import { ModuleIdMetaKey } from "./tokens";
import { Component } from './types/component';
import { ModuleOptions } from './types/module-options';

export class Module {
    private readonly id = uuid();

    public components: Component[];
    public imports: Module[];
    public providers: Provider<unknown>[];

    constructor(options: ModuleOptions) {
        this.components = options.components ?? [];
        this.imports = options.imports ?? [];
        this.providers = options.providers ?? [];

        this.addModuleMetadata();
    }

    private addModuleMetadata() {
        this.providers = this.providers?.map((it) => {
            let provider = it;
            if (isLiteralClassProvider(it)) {
                provider = toClassProvider(it);
            }
            provider.meta = { ...it.meta, [ModuleIdMetaKey]: this.id };
            return provider;
        });
    }

    getId(): string {
        return this.id;
    }

}
