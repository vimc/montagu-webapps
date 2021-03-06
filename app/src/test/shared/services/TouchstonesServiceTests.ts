
import {createMemoryHistory} from 'history';

import {createContribStore} from "../../../main/contrib/createStore";
import {TouchstonesService} from "../../../main/shared/services/TouchstonesService";
import {Sandbox} from "../../Sandbox";

describe('Touchstones service tests', () => {
    const sandbox = new Sandbox();
    afterEach(() => sandbox.restore());

    const history = createMemoryHistory();
    const store = createContribStore(history);

    it('fetches touchstones', () => {
        const touchstoneService = new TouchstonesService(store.dispatch, store.getState);

        const setOptionsSpy = sandbox.setSpy(touchstoneService, "setOptions");
        const getStub = sandbox.setStubFunc(touchstoneService, "get", () => {
            return Promise.resolve();
        });

        touchstoneService.getTouchstonesByGroupId('group-1');

        expect(getStub.mock.calls[0][0]).toEqual('/modelling-groups/group-1/responsibilities/');
        expect(setOptionsSpy.mock.calls[0][0]).toEqual({cacheKey: 'touchstones'});
    });

    it("fetches scenarios", () => {
        const service = new TouchstonesService(store.dispatch, store.getState);

        const setOptionsSpy = sandbox.setSpy(service, "setOptions");
        const getStub = sandbox.setStubFunc(service, "get", () => {
            return Promise.resolve();
        });

        service.getScenariosForTouchstoneVersion("touchstone-1");
        expect(getStub.mock.calls[0]).toEqual(['/touchstones/touchstone-1/scenarios/']);
        expect(setOptionsSpy.mock.calls[0]).toEqual([{cacheKey: 'touchstones'}]);
    });
});
