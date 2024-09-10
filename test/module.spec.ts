import {RootModule} from "@lib/root-module";
import {Token} from "@lib/types/token";
import {injectable} from "@lib/decorators/injectable";
import {Module} from "@lib/module";

describe("Module", () => {
    let module: RootModule;

    const tokenFixture: Token = "SomeToken";
    const valueFixture = {
        hello: {value: "fixture"},
    }

    @injectable()
    class TestClass {
    }

    beforeEach(() => {
        module = new RootModule({
            providers: [
                {token: tokenFixture, useValue: valueFixture},
                TestClass,
            ]
        });
    });

    it("should inject a value", () => {
        expect(module.resolve(tokenFixture)).toEqual(valueFixture);
    });

    it("should inject a class", () => {
        expect(module.resolve(TestClass)).toBeInstanceOf(TestClass);
    });

    it("should import another module", () => {
        const secondModule = new Module({
            providers: [
                {token: tokenFixture, useValue: valueFixture},
                TestClass,
            ]
        });

        module = new RootModule({
            imports: [secondModule],
        });

        expect(module.resolve(tokenFixture)).toEqual(valueFixture);
        expect(module.resolve(TestClass)).toBeInstanceOf(TestClass);
    });

});
