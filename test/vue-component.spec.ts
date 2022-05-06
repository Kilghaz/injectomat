import { Context, InjectionContainer, Module } from '../src';
import { defineComponent } from 'vue';

describe("Vue Component", () => {
    let module: Module;
    let container: InjectionContainer;
    let context: Context;

    const TestComponent = defineComponent({
        name: "test-component"
    })

    beforeEach(() => {
        context = new Context();
        module = new Module({
            components: [
                TestComponent,
            ],
        });
        container = new InjectionContainer(undefined, undefined, context);
        container.registerRootModule(module);
    });

    it("should register components", () => {
        const module = context.getModuleIdForComponentId("test-component");
        expect(module).toBeDefined();
    });

    it("should throw an error for unregistered component", () => {
        expect(() => context.getModuleIdForComponentId("some-component")).toThrow();
    });
});
