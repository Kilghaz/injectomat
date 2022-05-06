import { injectable, inject, injectAll } from '../src/decorators';
import { InjectionContainer } from '../src';

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

    it("should resolve dependencies lazily", async () => {
        const cls = container.resolve(LazyClass);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        expect(cls.propDependency).toBeDefined();
        expect(cls.propDependencies).toBeDefined();
        expect(cls.propDependencies).toHaveLength(1);
    });

    it("should resolve dependencies instantly", () => {
        const cls = container.resolve(LazyClass);
        expect(cls.propDependency).toBeDefined();
        expect(cls.propDependencies).toBeDefined();
        expect(cls.propDependencies).toHaveLength(1);
    });

});
