import {expect} from "chai";

import {Sandbox} from "../../Sandbox";
import {demographicActionCreators} from "../../../main/contrib/actions/demographicActionCreators";
import {DemographicService} from "../../../main/contrib/services/DemographicService";
import {DemographicTypes} from "../../../main/contrib/actionTypes/DemographicTypes";
import {createMockContribStore, createMockStore} from "../../mocks/mockStore";
import {mockDemographicDataset, mockTouchstoneVersion} from "../../mocks/mockModels";

describe("Demographic actions tests", () => {
    const sandbox = new Sandbox();

    const testDemographicDataSet = mockDemographicDataset({id: "set-1", source: "source-1"});

    afterEach(() => {
        sandbox.restore();
    });

    it("sets fetched sets", (done) => {
        const store = createMockStore({});
        sandbox.setStubFunc(DemographicService.prototype, "getDataSetsByTouchstoneId", () => {
            return Promise.resolve([testDemographicDataSet]);
        });
        store.dispatch(demographicActionCreators.getDataSets('touchstone-1'));
        setTimeout(() => {
            const actions = store.getActions();
            const expectedPayload = {
                type: DemographicTypes.DEMOGRAPHIC_DATA_SETS_FETCHED,
                data: [testDemographicDataSet]
            };
            expect(actions).to.eql([expectedPayload]);
            done();
        });
    });

    it("set data set by id using previously loaded sets", (done) => {
        const store = createMockStore({demographic: {dataSets: [testDemographicDataSet]}});
        store.dispatch(demographicActionCreators.setDataSet('set-1'));
        setTimeout(() => {
            const actions = store.getActions();
            const expectedPayload = {type: DemographicTypes.DEMOGRAPHIC_SET_DATA_SET, data: testDemographicDataSet};
            expect(actions).to.eql([expectedPayload]);
            done();
        });
    });

    it("set gender", (done) => {
        const store = createMockStore({});
        store.dispatch(demographicActionCreators.setGender('male'));
        setTimeout(() => {
            const actions = store.getActions();
            const expectedPayload = {type: DemographicTypes.DEMOGRAPHIC_SET_GENDER, data: 'male'};
            expect(actions).to.eql([expectedPayload]);
            done();
        });
    });

    it("sets format", (done) => {
        const store = createMockStore({});
        store.dispatch(demographicActionCreators.setFormat('long'));
        setTimeout(() => {
            const actions = store.getActions();
            const expectedPayload = {type: DemographicTypes.DEMOGRAPHIC_SET_FORMAT, data: 'long'};
            expect(actions).to.eql([expectedPayload]);
            done();
        });
    });
});