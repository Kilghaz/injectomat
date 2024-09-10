import {InjectionContainer} from "@lib/injection-container";
import {injectable} from "@lib/decorators/injectable";
import {injectLazy} from "@lib/decorators/inject-lazy";
import {injectAllLazy} from "@lib/decorators/inject-all-lazy";

describe("Lazy", () => {
    let container: InjectionContainer;

    @injectable()
    class Dependency {}

    @injectable()
    class LazyClass {
        @injectLazy()
        lazyDependency?: Dependency;

        @injectAllLazy(Dependency)
        lazyDependencies?: Dependency[];
    }

    beforeEach(() => {
        container = new InjectionContainer();
        container.provide(LazyClass);
        container.provide(Dependency);
    });

    it("should resolve dependencies lazily", async () => {
        const cls = container.resolve(LazyClass);
        await new Promise((resolve) => setTimeout(resolve, 0));
        expect(cls.lazyDependency).toBeDefined();
        expect(cls.lazyDependencies).toBeDefined();
        expect(cls.lazyDependencies).toHaveLength(1);
    });

    it("should not resolved dependencies instantly", () => {
        const cls = container.resolve(LazyClass);
        expect(cls.lazyDependency).toBeUndefined();
    });

});
