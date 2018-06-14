import {expect} from "chai";

import {Sandbox} from "../../../Sandbox";
import {createMockContribStore} from "../../../mocks/mockStore";
import {ModellingGroupsService} from "../../../../main/shared/services/ModellingGroupsService";
import {ModellingGroupTypes} from "../../../../main/contrib/actionTypes/ModellingGroupsTypes";
import {BreadcrumbsTypes} from "../../../../main/shared/actionTypes/BreadrumbsTypes";
import {breadcrumbsModule} from "../../../../main/shared/modules/breadcrumbs";
import {
    mockBreadcrumbs,
    mockCoverageSet,
    mockDisease,
    mockModellingGroup,
    mockResponsibilitySet,
    mockTouchstone
} from "../../../mocks/mockModels";
import {TouchstonesService} from "../../../../main/shared/services/TouchstonesService";
import {TouchstoneTypes} from "../../../../main/shared/actionTypes/TouchstonesTypes";
import {DiseasesService} from "../../../../main/contrib/services/DiseasesService";
import {ResponsibilitiesService} from "../../../../main/contrib/services/ResponsibilitiesService";
import {DiseasesTypes} from "../../../../main/contrib/actionTypes/DiseasesTypes";
import {ResponsibilitiesTypes} from "../../../../main/contrib/actionTypes/ResponsibilitiesTypes";
import {ExtendedResponsibilitySet} from "../../../../main/contrib/models/ResponsibilitySet";
import {downloadCoveragePageActionCreators} from "../../../../main/contrib/actions/pages/downloadCoveragePageActionCreators";
import {CoverageService} from "../../../../main/contrib/services/CoverageService";
import {ScenarioAndCoverageSets} from "../../../../main/shared/models/Generated";
import {CoverageTypes} from "../../../../main/contrib/actionTypes/CoverageTypes";
import {TouchstonesState} from "../../../../main/contrib/reducers/touchstonesReducer";

describe("Download Coverage Page actions tests", () => {
    const sandbox = new Sandbox();

    const testGroup = mockModellingGroup();
    const testBreadcrumbs = mockBreadcrumbs();
    const testTouchstone = mockTouchstone();
    const testTouchstoneVersion = testTouchstone.versions[0];
    const testDisease = mockDisease();
    const testResponsibilitySet = mockResponsibilitySet();
    const testExtResponsibilitySet = new ExtendedResponsibilitySet(testResponsibilitySet, testTouchstoneVersion, testGroup);
    const testCoverageSet = mockCoverageSet();
    const testResponsibility = testResponsibilitySet.responsibilities[0];
    const testScenario = testResponsibility.scenario;
    const testScenarioAndCoverageSet: ScenarioAndCoverageSets = {
        coverage_sets: [testCoverageSet],
        scenario: testScenario
    };

    afterEach(() => {
        sandbox.restore();
    });

    it("on load", (done) => {
        const touchstonesState: TouchstonesState = {
            touchstones: [testTouchstone],
            currentTouchstoneVersion: testTouchstoneVersion
        };
        const store = createMockContribStore({
            auth: {modellingGroups: [testGroup.id]},
            groups: {userGroups: [testGroup], currentUserGroup: testGroup},
            touchstones: touchstonesState,
            responsibilities: {
                responsibilitiesSet: testResponsibilitySet,
                currentResponsibility: testResponsibilitySet.responsibilities[0]
            },
            coverage: {selectedFormat: "long"}
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
        sandbox.setStubFunc(CoverageService.prototype, "getOneTimeToken", () => {
            return Promise.resolve('test-token');
        });
        sandbox.setStubFunc(CoverageService.prototype, "getDataSets", () => {
            return Promise.resolve(testScenarioAndCoverageSet);
        });
        sandbox.setStubFunc(breadcrumbsModule, "initialize", () => {
            return testBreadcrumbs;
        });

        store.dispatch(downloadCoveragePageActionCreators
            .onLoad({
                groupId: testGroup.id,
                touchstoneId: testTouchstoneVersion.id,
                scenarioId: testScenario.id
            }));

        setTimeout(() => {
            const actions = store.getActions();

            const expectedPayload = [
                {type: ModellingGroupTypes.USER_GROUPS_FETCHED, data: [testGroup]},
                {type: ModellingGroupTypes.SET_CURRENT_USER_GROUP, data: testGroup},
                {type: TouchstoneTypes.TOUCHSTONES_FETCHED_FOR_GROUP, data: [testTouchstone]},
                {type: DiseasesTypes.DISEASES_FETCHED, data: [testDisease]},
                {type: TouchstoneTypes.SET_CURRENT_TOUCHSTONE_VERSION, data: testTouchstoneVersion},
                {type: ResponsibilitiesTypes.SET_RESPONSIBILITIES, data: testExtResponsibilitySet},
                {type: ResponsibilitiesTypes.SET_CURRENT_RESPONSIBILITY, data: testResponsibility},
                {type: CoverageTypes.COVERAGE_ONE_TIME_TOKEN_CLEAR},
                {type: CoverageTypes.COVERAGE_ONE_TIME_TOKEN_FETCHED, data: "test-token"},
                {type: CoverageTypes.COVERAGE_DATA_SETS_FETCHED, data: [testCoverageSet]},
                {type: BreadcrumbsTypes.BREADCRUMBS_RECEIVED, data: testBreadcrumbs},
            ];
            expect(actions).to.eql(expectedPayload);
            done();
        });
    });


});