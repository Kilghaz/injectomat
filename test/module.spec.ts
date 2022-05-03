import { createModule, Module } from '@/module';
import { Token } from '../src/types/token';
import { createInjectionContainer, InjectionContainer } from '../src/injection-container';
import { service } from '../src/decorators/service.decorator';

describe("Module", () => {
    let module: Module;
    let container: InjectionContainer;

    const tokenFixture: Token = "SomeToken";
    const valueFixture = {
        hello: { value: "fixture" },
    }

    @service()
    class TestClass {}

    beforeEach(() => {
        module = createModule({
            root: true,
            providers: [
                { token: tokenFixture, useValue: valueFixture },
                TestClass,
            ]
        });
        container = createInjectionContainer();
        module.provideAll(container);
    });

    it("should inject a value", () => {
        expect(container.resolve(tokenFixture)).toEqual(valueFixture);
    });

    it("should inject a class", () => {
        expect(container.resolve(TestClass)).toBeInstanceOf(TestClass);
    });

    it("should import another module", () => {
        const secondModule = createModule({
            providers: [
                { token: tokenFixture, useValue: valueFixture },
                TestClass,
            ]
        });

        module = createModule({
            root: true,
            imports: [secondModule],
        });
        container = createInjectionContainer();
        module.provideAll(container);

        expect(container.resolve(tokenFixture)).toEqual(valueFixture);
        expect(container.resolve(TestClass)).toBeInstanceOf(TestClass);
    });

});
