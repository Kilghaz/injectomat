import _ from 'lodash';
import {InstanceManager} from "@lib/instance-manager";

describe("Instance Manager", () => {
    let instanceManager: InstanceManager;

    const keyFixture = "test";
    const decoratorMock = jest.fn().mockImplementation(_.identity);

    class TestClass {
    }

    const instanceFixture = new TestClass();

    it("should decorate instances", () => {
        instanceManager = new InstanceManager([decoratorMock]);
        instanceManager.setInstance(keyFixture, instanceFixture);
        expect(decoratorMock).toHaveBeenCalledWith(instanceFixture);
    });

    it("should get an instance", () => {
        instanceManager = new InstanceManager([decoratorMock]);
        instanceManager.setInstance(keyFixture, instanceFixture);
        expect(instanceManager.getInstance(keyFixture)).toEqual(instanceFixture);
    });
});
