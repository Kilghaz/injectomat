import { createInjectionContainer, InjectionContainer } from '../src/injection-container';
import { Token } from '../src/types/token';
import { service } from '../src/decorators/service.decorator';
import { inject } from '../src/decorators/inject.decorator';

describe("Providers", () => {
    let container: InjectionContainer;

    const tokenFixture: Token = "SomeToken";
    const secondTokenFixture: Token = "SomeOtherToken";
    const valueFixture = {
        hello: { value: "fixture" },
    }

    @service()
    class TestClass {
        constructor(@inject(secondTokenFixture) public value: string) {
        }
    }

    @service({ token: tokenFixture })
    class AnotherTestClass {
        constructor(@inject(secondTokenFixture) public value: string) {
        }
    }

    beforeEach(() => {
        container = createInjectionContainer();
    })

    it("should inject a value", () => {
        container.provide( { token: tokenFixture, useValue: valueFixture });
        expect(container.resolve(tokenFixture)).toEqual(valueFixture);
    });

    it("should inject a value by token", () => {
        container.provide( { token: tokenFixture, useValue: valueFixture });
        container.provide( { token: secondTokenFixture, useToken: tokenFixture });
        expect(container.resolve(secondTokenFixture)).toEqual(valueFixture);
    });

    it("should inject a value with a factory", () => {
        container.provide( { token: tokenFixture, useFactory: () => valueFixture });
        expect(container.resolve(tokenFixture)).toEqual(valueFixture);
    });

    it("should inject an instance of a class", () => {
        container.provide( { token: tokenFixture, useClass: TestClass });
        container.provide( { token: secondTokenFixture, useValue: valueFixture });
        const resolved: TestClass = container.resolve(tokenFixture);
        expect(resolved).toBeInstanceOf(TestClass);
        expect(resolved.value).toEqual(valueFixture);
    });

    it("should inject an instance of a class with a literal class provider", () => {
        container.provide(TestClass);
        container.provide( { token: secondTokenFixture, useValue: valueFixture });
        const resolved: TestClass = container.resolve(TestClass);
        expect(resolved).toBeInstanceOf(TestClass);
        expect(resolved.value).toEqual(valueFixture);
    });

    it("should inject an instance of a class with a literal class provider with a modified token", () => {
        container.provide(AnotherTestClass);
        container.provide( { token: secondTokenFixture, useValue: valueFixture });
        const resolved: AnotherTestClass = container.resolve(tokenFixture);
        expect(resolved).toBeInstanceOf(AnotherTestClass);
        expect(resolved.value).toEqual(valueFixture);
    });
});
