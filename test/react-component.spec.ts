import { Context, InjectionContainer, Module } from '../src';
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
        context = new Context();
        module = new Module({
            root: true,
            context,
            components: [
                TestComponent,
            ],
        });
        container = new InjectionContainer();
        module.provideAll(container);
    });

    it("should register components", () => {
        const module = context.getModuleIdForComponentId("TestComponent");
        expect(module).toBeDefined();
    });

    it("should throw an error for unregistered component", () => {
        expect(() => context.getModuleIdForComponentId("SomeComponent")).toThrow();
    });
});
