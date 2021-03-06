import { createMemoryHistory } from 'history';

import {createContribStore} from "../../../main/contrib/createStore";
import {DemographicService} from "../../../main/shared/services/DemographicService";
import {Sandbox} from "../../Sandbox";
import {ContribAppState} from "../../../main/contrib/reducers/contribAppReducers";

describe('Demographic service tests', () => {
    const sandbox = new Sandbox();

    const history = createMemoryHistory();
    const store = createContribStore(history);

    afterEach(() => {
        sandbox.restore();
    });

    it("fetches data sets", () => {
        const demographicService = new DemographicService(store.dispatch, store.getState as () => ContribAppState);

        const setOptionsSpy = sandbox.setSpy(demographicService, "setOptions");
        const getStub = sandbox.setStubFunc(demographicService, "get", ()=>{
            return Promise.resolve();
        });

        demographicService.getDataSetsByTouchstoneVersionId("touchstone-1");

        expect(getStub.mock.calls[0][0]).toEqual("/touchstones/touchstone-1/demographics/");
        expect(setOptionsSpy.mock.calls[0][0]).toEqual({ cacheKey: 'sets' });
    });
});