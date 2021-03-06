

import { Sandbox } from "../../Sandbox";
import { diseasesActionCreators } from "../../../main/shared/actions/diseasesActionCreators";
import { DiseasesService } from "../../../main/shared/services/DiseasesService";
import { DiseasesTypes } from "../../../main/shared/actionTypes/DiseasesTypes";
import {createMockStore} from "../../mocks/mockStore";

describe("Diseases actions tests", () => {
    const sandbox = new Sandbox();

    const testDisease = {id: "disease-1", name: "Test 1"};

    afterEach(() => {
        sandbox.restore();
    });

    it("all diseases fetched", (done) => {
        const store = createMockStore({});
        sandbox.setStubFunc(DiseasesService.prototype, "getAllDiseases", ()=>{
          return Promise.resolve([testDisease]);
        });
        store.dispatch(diseasesActionCreators.getAllDiseases());
        setTimeout(() => {
            const actions = store.getActions();
            const expectedPayload = { type: DiseasesTypes.DISEASES_FETCHED, data: [testDisease] };
            expect(actions).toEqual([expectedPayload]);
            done();
        });
    });

    it("set current disease id", (done) => {
        const initialState = {
            diseases: {diseases: [testDisease]}
        };
        const store = createMockStore(initialState);
        store.dispatch(diseasesActionCreators.setCurrentDiseaseId("disease-1"));
        setTimeout(() => {
            const actions = store.getActions();
            const expectedPayload = { type: DiseasesTypes.DISEASES_SET_CURRENT_DISEASE_ID, data: testDisease.id };
            expect(actions).toEqual([expectedPayload]);
            done();
        });
    });

});