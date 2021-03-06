
import { createMemoryHistory } from 'history';

import {createContribStore} from "../../../main/contrib/createStore";
import {CoverageService} from "../../../main/contrib/services/CoverageService";
import {Sandbox} from "../../Sandbox";
import {ContribAppState} from "../../../main/contrib/reducers/contribAppReducers";

describe('Coverage service tests', () => {
    const sandbox = new Sandbox();

    const history = createMemoryHistory();
    const store = createContribStore(history);

    afterEach(() => {
        sandbox.restore();
    });

    it('fetches data sets', () => {
        const coverageService = new CoverageService(store.dispatch, store.getState as () => ContribAppState);

        const setOptionsSpy = sandbox.setSpy(coverageService, "setOptions");
        const getStub = sandbox.setStubFunc(coverageService, "get", ()=>{
            return Promise.resolve();
        });

        coverageService.getDataSets("group-1", "touchstone-1", "scenario-1");

        expect(getStub.mock.calls[0][0])
            .toEqual("/modelling-groups/group-1/responsibilities/touchstone-1/scenario-1/coverage-sets/");
        expect(setOptionsSpy.mock.calls[0][0]).toEqual({ cacheKey: 'sets' });
    });
});