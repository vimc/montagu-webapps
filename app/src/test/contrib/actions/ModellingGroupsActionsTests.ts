import { expect } from "chai";

import { Sandbox } from "../../Sandbox";
import { modellingGroupsActions } from "../../../main/contrib/actions/modellingGroupsActions";
import { ModellingGroupsService } from "../../../main/contrib/services/ModellingGroupsService";
import { ModellingGroupTypeKeys } from "../../../main/contrib/actionTypes/ModellingGroupsTypes";
import {createMockStore} from "../../mocks/mockStore";

describe("Modelling groups actions tests", () => {
    const sandbox = new Sandbox();
    let store: any = null;
    const initialState = {auth: {modellingGroups: "test1"}}

    const testGroup1 = {id: "test1", description: "Test 1"};

    before(() => {
        store = createMockStore(initialState);
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("dispatches action groups fetched after it loaded groups", (done) => {
        sandbox.setStubFunc(ModellingGroupsService.prototype, "getGroups", ()=>{
          return Promise.resolve([testGroup1]);
        });
        store.dispatch(modellingGroupsActions.getGroups())
        setTimeout(() => {
            const actions = store.getActions()
            const expectedPayload = { type: ModellingGroupTypeKeys.GROUPS_FETCHED, data: [testGroup1] }
            expect(actions).to.eql([expectedPayload])
            done();
        });
    });

});