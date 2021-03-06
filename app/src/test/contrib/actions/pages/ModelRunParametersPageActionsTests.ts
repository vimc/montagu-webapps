

import {Sandbox} from "../../../Sandbox";
import {createMockContribStore} from "../../../mocks/mockStore";
import {mockModellingGroup, mockModelRunParameterSet, mockTouchstone} from "../../../mocks/mockModels";
import {modelRunParametersPageActionCreators} from "../../../../main/contrib/actions/pages/modelRunParametersPageActionCreators";
import {RunParametersService} from "../../../../main/contrib/services/RunParametersService";
import {RunParametersTypes} from "../../../../main/contrib/actionTypes/RunParametersTypes";
import {TouchstonesState} from "../../../../main/contrib/reducers/contribTouchstonesReducer";
import {responsibilityOverviewPageActionCreators} from "../../../../main/contrib/actions/pages/responsibilityOverviewPageActionCreators";
import {mockContribState} from "../../../mocks/mockStates";

describe("Model Run Parameters Page actions tests", () => {
    const sandbox = new Sandbox();

    const testGroup = mockModellingGroup();
    const testTouchstone = mockTouchstone();
    const testTouchstoneVersion = testTouchstone.versions[0];
    const testModelRunParametersSet = mockModelRunParameterSet();

    afterEach(() => {
        sandbox.restore();
    });

    it("creates breadcrumb", () => {
        const state = mockContribState();
        const result = modelRunParametersPageActionCreators.createBreadcrumb(state);
        expect(result.urlFragment).toEqual("parameters/");
        expect(result.name).toEqual("Upload parameters");
    });

    it("loads parameter sets", async () => {
        const touchstonesState: Partial<TouchstonesState> = {
            touchstones: [testTouchstone],
            currentTouchstoneVersion: testTouchstoneVersion
        };
        const store = createMockContribStore(mockContribState({
            auth: {modellingGroups: [testGroup.id]},
            groups: {userGroups: [testGroup], currentUserGroup: testGroup},
            touchstones: touchstonesState
        }));

        sandbox.setStubFunc(RunParametersService.prototype, "getParameterSets", () => {
            return Promise.resolve([testModelRunParametersSet]);
        });

        await store.dispatch(modelRunParametersPageActionCreators
            .loadData({groupId: testGroup.id, touchstoneId: testTouchstoneVersion.id}));

        const actions = store.getActions();

        const expectedPayload = [
            {type: RunParametersTypes.RUN_PARAMETERS_SETS_FETCHED, data: [testModelRunParametersSet]}
        ];
        expect(actions).toEqual(expectedPayload);

    });

    it("has responsibilities overview as parent", () => {
        expect(modelRunParametersPageActionCreators.parent).toEqual(responsibilityOverviewPageActionCreators);
    });

});