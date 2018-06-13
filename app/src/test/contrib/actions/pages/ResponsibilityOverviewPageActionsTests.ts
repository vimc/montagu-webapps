import { expect } from "chai";

import { Sandbox } from "../../../Sandbox";
import {createMockStore} from "../../../mocks/mockStore";
import {ModellingGroupsService} from "../../../../main/shared/services/ModellingGroupsService";
import {ModellingGroupTypes} from "../../../../main/contrib/actionTypes/ModellingGroupsTypes";
import {BreadcrumbsTypes} from "../../../../main/shared/actionTypes/BreadrumbsTypes";
import {breadcrumbsModule} from "../../../../main/shared/modules/breadcrumbs";
import {
    mockBreadcrumbs, mockDisease, mockModellingGroup, mockResponsibilitySet,
    mockTouchstoneVersion
} from "../../../mocks/mockModels";
import {TouchstonesService} from "../../../../main/contrib/services/TouchstonesService";
import {TouchstoneTypes} from "../../../../main/contrib/actionTypes/TouchstonesTypes";
import {responsibilityOverviewPageActionCreators} from "../../../../main/contrib/actions/pages/responsibilityOverviewPageActionCreators";
import {DiseasesService} from "../../../../main/contrib/services/DiseasesService";
import {ResponsibilitiesService} from "../../../../main/contrib/services/ResponsibilitiesService";
import {DiseasesTypes} from "../../../../main/contrib/actionTypes/DiseasesTypes";
import {ResponsibilitiesTypes} from "../../../../main/contrib/actionTypes/ResponsibilitiesTypes";
import {ExtendedResponsibilitySet} from "../../../../main/contrib/models/ResponsibilitySet";
import {UserService} from "../../../../main/contrib/services/UserService";
import {UserActionType} from "../../../../main/contrib/actionTypes/UserActionTypes";

describe("Responsibility Overview Page actions tests", () => {
    const sandbox = new Sandbox();

    const testGroup = mockModellingGroup();
    const testBreadcrumbs = mockBreadcrumbs();
    const testTouchstone = mockTouchstoneVersion({id: "touchstone-1"});
    const testDisease = mockDisease();
    const testResponsibilitySet = mockResponsibilitySet();
    const testExtResponsibilitySet = new ExtendedResponsibilitySet(testResponsibilitySet, testTouchstone, testGroup);

    afterEach(() => {
        sandbox.restore();
    });

    it("on load", (done) => {
        const initialState = {
            auth: {modellingGroups: testGroup.id},
            groups: {userGroups: [testGroup], currentUserGroup: testGroup},
            touchstones: {touchstones: [testTouchstone], currentTouchstone: testTouchstone}
        };
        const store = createMockStore(initialState);

        sandbox.setStubFunc(ModellingGroupsService.prototype, "getAllGroups", ()=>{
            return Promise.resolve([testGroup]);
        });
        sandbox.setStubFunc(TouchstonesService.prototype, "getTouchstonesByGroupId", ()=>{
            return Promise.resolve([testTouchstone]);
        });
        sandbox.setStubFunc(DiseasesService.prototype, "getAllDiseases", ()=>{
            return Promise.resolve([testDisease]);
        });
        sandbox.setStubFunc(ResponsibilitiesService.prototype, "getResponsibilities", ()=>{
            return Promise.resolve(testResponsibilitySet);
        });
        sandbox.setStubFunc(breadcrumbsModule, "initialize", ()=>{
            return testBreadcrumbs;
        });

        store.dispatch(responsibilityOverviewPageActionCreators
            .onLoad({groupId: testGroup.id, touchstoneId: testTouchstone.id}));

        setTimeout(() => {
            const actions = store.getActions();

            const expectedPayload = [
                { type: ModellingGroupTypes.USER_GROUPS_FETCHED, data: [testGroup] },
                { type: ModellingGroupTypes.SET_CURRENT_USER_GROUP, data: testGroup },
                { type: TouchstoneTypes.TOUCHSTONES_FETCHED, data: [testTouchstone]},
                { type: DiseasesTypes.DISEASES_FETCHED, data: [testDisease]},
                { type: TouchstoneTypes.SET_CURRENT_TOUCHSTONE_VERSION, data: testTouchstone},
                { type: ResponsibilitiesTypes.SET_RESPONSIBILITIES, data: testExtResponsibilitySet},
                { type: BreadcrumbsTypes.BREADCRUMBS_RECEIVED, data: testBreadcrumbs },
            ];
            expect(actions).to.eql(expectedPayload);
            done();
        });
    });



});