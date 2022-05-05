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
        const module = context.getModuleIdForComponentId("test-component");
        expect(module).toBeDefined();
    });

    it("should throw an error for unregistered component", () => {
        expect(() => context.getModuleIdForComponentId("some-component")).toThrow();
    });
});
