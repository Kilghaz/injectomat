import { createModule, Module } from '../src/module';
import { createInjectionContainer, InjectionContainer } from '../src/injection-container';
import { Context, createContext } from '../src/context';
import * as React from 'react';
import { FC } from 'react';

describe("React Component", () => {
    let module: Module;
    let container: InjectionContainer;
    let context: Context;

    const TestComponent: FC = () => {
        return (React.createElement("div", null, "Hello"));
    };

    beforeEach(() => {
        context = createContext();
        module = createModule({
            root: true,
            context,
            components: [
                TestComponent,
            ],
        });
        container = createInjectionContainer();
        module.provideAll(container);
    });

    it("should register components", () => {
        const module = context.getModuleForComponent(TestComponent);
        expect(module).toBeDefined();
    });

    it("should throw an error for unregistered component", () => {
        const SomeComponent = () => React.createElement("div");
        expect(() => context.getModuleForComponent(SomeComponent)).toThrow();
    });
});
