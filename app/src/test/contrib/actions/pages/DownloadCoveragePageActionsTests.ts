

import {Sandbox} from "../../../Sandbox";
import {createMockContribStore} from "../../../mocks/mockStore";
import {
    mockExtendedResponsibilitySet,
    mockResponsibility,
    mockScenario,
} from "../../../mocks/mockModels";
import {downloadCoveragePageActionCreators} from "../../../../main/contrib/actions/pages/downloadCoveragePageActionCreators";
import {mockContribState} from "../../../mocks/mockStates";
import {responsibilityOverviewPageActionCreators} from "../../../../main/contrib/actions/pages/responsibilityOverviewPageActionCreators";
import {coverageActionCreators} from "../../../../main/contrib/actions/coverageActionCreators";
import {responsibilitiesActionCreators} from "../../../../main/contrib/actions/responsibilitiesActionCreators";

describe("Download Coverage Page actions tests", () => {
    const sandbox = new Sandbox();

    const responsibility = mockResponsibility({
        scenario: mockScenario({id: "s1", description: "s1desc"})
    });

    const state = mockContribState({
        responsibilities: {
            responsibilitiesSet: mockExtendedResponsibilitySet({responsibilities: [responsibility]}),
            currentResponsibility: responsibility
        }
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("has responsibility overview as parent", () => {
        expect(downloadCoveragePageActionCreators.parent).toEqual(responsibilityOverviewPageActionCreators);
    });

    it("creates breadcrumb", () => {

        const result = downloadCoveragePageActionCreators.createBreadcrumb(state);

        expect(result.name).toEqual("Download coverage for s1desc");
        expect(result.urlFragment).toEqual("coverage/s1/");
    });

    it(
        "loadData sets current responsibility and gets coverage data sets ",
        async () => {

            const store = createMockContribStore(state);
            
            sandbox.stubReduxActionCreator(coverageActionCreators, "getDataSets", {
                type: "TEST_GET_COV_DATA_SETS"
            });

            sandbox.stubReduxActionCreator(responsibilitiesActionCreators, "setCurrentResponsibility", {
                type: "TEST_SET_CURRENT"
            });

            await store.dispatch(downloadCoveragePageActionCreators
                .loadData({
                    groupId: "g1",
                    touchstoneId: "t1",
                    scenarioId: "s1"
                }));

            const actions = store.getActions();

            const expectedPayload = [
                {type: "TEST_SET_CURRENT", props: "s1"},
                {type: "TEST_GET_COV_DATA_SETS", props: undefined}
            ];
            expect(actions).toEqual(expectedPayload);

        }
    );


});