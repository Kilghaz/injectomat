import { Context, InjectionContainer, Module, RootModule } from '../src';
import * as React from 'react';
import { FC } from 'react';

describe("React Component", () => {
    let module: Module;
    let context: Context;

    const TestComponent: FC = () => {
        return (React.createElement("div", null, "Hello"));
    };

    beforeEach(() => {
        context = new Context();
        module = new RootModule({
            components: [
                TestComponent,
            ],
        }, new InjectionContainer(undefined, undefined, context));
    });

    it("should register components", () => {
        const module = context.getModuleIdForComponentId("TestComponent");
        expect(module).toBeDefined();
    });

    it("should throw an error for unregistered component", () => {
        expect(() => context.getModuleIdForComponentId("SomeComponent")).toThrow();
    });
});
