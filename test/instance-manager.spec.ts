import { createInstanceManager, InstanceManager } from '../src/instance-manager';
import _ from 'lodash';

describe("Instance Manager", () => {
    let instanceManager: InstanceManager;


    const keyFixture = "test";
    const decoratorMock = jest.fn().mockImplementation(_.identity);

    class TestClass {}
    const instanceFixture = new TestClass();

    it("should decorate instances", () => {
        instanceManager = createInstanceManager([decoratorMock]);
        instanceManager.setInstance(keyFixture, instanceFixture);
        expect(decoratorMock).toHaveBeenCalledWith(instanceFixture);
    });

    it("should get an instance", () => {
        instanceManager = createInstanceManager([decoratorMock]);
        instanceManager.setInstance(keyFixture, instanceFixture);
        expect(instanceManager.getInstance(keyFixture)).toEqual(instanceFixture);
    });
});
