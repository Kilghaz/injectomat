import {InjectionContainer} from "@lib/injection-container";
import {injectable} from "@lib/decorators/injectable";
import {inject} from "@lib/decorators/inject";
import {injectAll} from "@lib/decorators/inject-all";

describe("Properties", () => {
    let container: InjectionContainer;

    @injectable()
    class Dependency {}

    @injectable()
    class LazyClass {
        @inject()
        propDependency?: Dependency;

        @injectAll(Dependency)
        propDependencies?: Dependency[];
    }

    beforeEach(() => {
        container = new InjectionContainer();
        container.provide(LazyClass);
        container.provide(Dependency);
    });

    it("should resolve dependencies instantly", () => {
        const cls = container.resolve(LazyClass);
        expect(cls.propDependency).toBeDefined();
        expect(cls.propDependencies).toBeDefined();
        expect(cls.propDependencies).toHaveLength(1);
    });

});
