import { Module } from './module';
import { ModuleOptions } from './types/module-options';
import { InjectionContainer } from './injection-container';
import { Token } from './types/token';

export class RootModule extends Module {
    constructor(options: ModuleOptions,
                private readonly container: InjectionContainer = new InjectionContainer()) {
        super(options);
        container.registerRootModule(this);
    }

    resolve<T>(token: Token<T>): T {
        return this.container.resolve(token);
    }

    resolveAll<T>(token: Token<T>): T[] {
        return this.container.resolveAll(token);
    }
}
