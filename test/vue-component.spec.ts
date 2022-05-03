import { createModule, Module } from '../src/module';
import { createInjectionContainer, InjectionContainer } from '../src/injection-container';
import { Context, createContext } from '../src/context';
import { defineComponent } from 'vue';

describe("Vue Component", () => {
    let module: Module;
    let container: InjectionContainer;
    let context: Context;

    const TestComponent = defineComponent({
        name: "test-component"
    })

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
        const SomeComponent = defineComponent({ name: "some-component" });
        expect(() => context.getModuleForComponent(SomeComponent)).toThrow();
    });
});
