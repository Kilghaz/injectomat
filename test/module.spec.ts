import { Module } from '../src';
import { Token } from '../src/types/token';
import { InjectionContainer } from '../src';
import { service } from '../src/decorators';

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
        module = new Module({
            root: true,
            providers: [
                { token: tokenFixture, useValue: valueFixture },
                TestClass,
            ]
        });
        container = new InjectionContainer();
        module.provideAll(container);
    });

    it("should inject a value", () => {
        expect(container.resolve(tokenFixture)).toEqual(valueFixture);
    });

    it("should inject a class", () => {
        expect(container.resolve(TestClass)).toBeInstanceOf(TestClass);
    });

    it("should import another module", () => {
        const secondModule = new Module({
            providers: [
                { token: tokenFixture, useValue: valueFixture },
                TestClass,
            ]
        });

        module = new Module({
            root: true,
            imports: [secondModule],
        });
        container = new InjectionContainer();
        module.provideAll(container);

        expect(container.resolve(tokenFixture)).toEqual(valueFixture);
        expect(container.resolve(TestClass)).toBeInstanceOf(TestClass);
    });

});
