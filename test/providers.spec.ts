import { InjectionContainer } from '../src';
import { Token } from '../src/types/token';
import { service } from '../src/decorators';
import { inject } from '../src/decorators';
import { injectAll } from '../src/decorators';

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

    @service()
    class ThirdTestClass {
        constructor(public testClass: TestClass) {
        }
    }

    @service()
    class FourthTestClass {
        constructor(@injectAll(tokenFixture) public values: string[]) {
        }
    }

    beforeEach(() => {
        container = new InjectionContainer();
    })

    it("should inject a value", () => {
        container.provide( { token: tokenFixture, useValue: valueFixture });
        expect(container.resolve(tokenFixture)).toEqual(valueFixture);
    });

    it("should inject all values", () => {
        container.provide( { token: tokenFixture, useValue: valueFixture });
        expect(container.resolveAll(tokenFixture)).toEqual([valueFixture]);
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

    it("should inject a class and resolve class dependencies", () => {
        container.provide(ThirdTestClass);
        container.provide(TestClass);
        container.provide( { token: secondTokenFixture, useValue: valueFixture });
        const resolved: ThirdTestClass = container.resolve(ThirdTestClass);
        expect(resolved).toBeInstanceOf(ThirdTestClass);
        expect(resolved.testClass).toBeInstanceOf(TestClass);
    });

    it("should inject an instance of a class and inject all dependencies", () => {
        container.provide(FourthTestClass);
        container.provide( { token: tokenFixture, useValue: valueFixture });
        const resolved: FourthTestClass = container.resolve(FourthTestClass);
        expect(resolved).toBeInstanceOf(FourthTestClass);
        expect(resolved.values).toEqual([valueFixture]);
    });

});
