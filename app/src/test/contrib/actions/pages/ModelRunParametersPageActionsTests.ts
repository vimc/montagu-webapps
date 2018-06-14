import {expect} from "chai";

import {Sandbox} from "../../../Sandbox";
import {createMockContribStore} from "../../../mocks/mockStore";
import {ModellingGroupsService} from "../../../../main/shared/services/ModellingGroupsService";
import {ModellingGroupTypes} from "../../../../main/contrib/actionTypes/ModellingGroupsTypes";
import {BreadcrumbsTypes} from "../../../../main/shared/actionTypes/BreadrumbsTypes";
import {breadcrumbsModule} from "../../../../main/shared/modules/breadcrumbs";
import {
    mockBreadcrumbs,
    mockDisease,
    mockModellingGroup,
    mockModelRunParameterSet,
    mockResponsibilitySet,
    mockTouchstone
} from "../../../mocks/mockModels";
import {TouchstonesService} from "../../../../main/contrib/services/TouchstonesService";
import {TouchstoneTypes} from "../../../../main/contrib/actionTypes/TouchstonesTypes";
import {DiseasesService} from "../../../../main/contrib/services/DiseasesService";
import {ResponsibilitiesService} from "../../../../main/contrib/services/ResponsibilitiesService";
import {DiseasesTypes} from "../../../../main/contrib/actionTypes/DiseasesTypes";
import {ResponsibilitiesTypes} from "../../../../main/contrib/actionTypes/ResponsibilitiesTypes";
import {ExtendedResponsibilitySet} from "../../../../main/contrib/models/ResponsibilitySet";
import {modelRunParametersPageActionCreators} from "../../../../main/contrib/actions/pages/modelRunParametersPageActionCreators";
import {RunParametersService} from "../../../../main/contrib/services/RunParametersService";
import {RunParametersTypes} from "../../../../main/contrib/actionTypes/RunParametersTypes";
import {TouchstonesState} from "../../../../main/contrib/reducers/touchstonesReducer";

describe("Model Run Parameters Page actions tests", () => {
    const sandbox = new Sandbox();

    const testGroup = mockModellingGroup();
    const testBreadcrumbs = mockBreadcrumbs();
    const testTouchstone = mockTouchstone();
    const testTouchstoneVersion = testTouchstone.versions[0];
    const testDisease = mockDisease();
    const testResponsibilitySet = mockResponsibilitySet();
    const testExtResponsibilitySet = new ExtendedResponsibilitySet(testResponsibilitySet, testTouchstoneVersion, testGroup);
    const testModelRunParametersSet = mockModelRunParameterSet();

    afterEach(() => {
        sandbox.restore();
    });

    it("on load", (done) => {
        const touchstonesState: Partial<TouchstonesState> = {
            touchstones: [testTouchstone],
            currentTouchstoneVersion: testTouchstoneVersion
        };
        const store = createMockContribStore({
            auth: {modellingGroups: testGroup.id},
            groups: {userGroups: [testGroup], currentUserGroup: testGroup},
            touchstones: touchstonesState
        });

        sandbox.setStubFunc(ModellingGroupsService.prototype, "getAllGroups", () => {
            return Promise.resolve([testGroup]);
        });
        sandbox.setStubFunc(TouchstonesService.prototype, "getTouchstonesByGroupId", () => {
            return Promise.resolve([testTouchstone]);
        });
        sandbox.setStubFunc(DiseasesService.prototype, "getAllDiseases", () => {
            return Promise.resolve([testDisease]);
        });
        sandbox.setStubFunc(ResponsibilitiesService.prototype, "getResponsibilities", () => {
            return Promise.resolve(testResponsibilitySet);
        });
        sandbox.setStubFunc(RunParametersService.prototype, "getParameterSets", () => {
            return Promise.resolve([testModelRunParametersSet]);
        });
        sandbox.setStubFunc(breadcrumbsModule, "initialize", () => {
            return testBreadcrumbs;
        });

        store.dispatch(modelRunParametersPageActionCreators
            .onLoad({groupId: testGroup.id, touchstoneId: testTouchstoneVersion.id}));

        setTimeout(() => {
            const actions = store.getActions();

            const expectedPayload = [
                {type: ModellingGroupTypes.USER_GROUPS_FETCHED, data: [testGroup]},
                {type: ModellingGroupTypes.SET_CURRENT_USER_GROUP, data: testGroup},
                {type: TouchstoneTypes.TOUCHSTONES_FETCHED, data: [testTouchstone]},
                {type: DiseasesTypes.DISEASES_FETCHED, data: [testDisease]},
                {type: TouchstoneTypes.SET_CURRENT_TOUCHSTONE_VERSION, data: testTouchstoneVersion},
                {type: ResponsibilitiesTypes.SET_RESPONSIBILITIES, data: testExtResponsibilitySet},
                {type: RunParametersTypes.RUN_PARAMETERS_SETS_FETCHED, data: [testModelRunParametersSet]},
                {type: BreadcrumbsTypes.BREADCRUMBS_RECEIVED, data: testBreadcrumbs},
            ];
            expect(actions).to.eql(expectedPayload);
            done();
        });
    });

});