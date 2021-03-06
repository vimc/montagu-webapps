

import {Sandbox} from "../../../Sandbox";
import {createMockContribStore} from "../../../mocks/mockStore";
import {mockResponsibility, mockScenario,} from "../../../mocks/mockModels";
import {uploadBurdenEstimatesPageActionCreators} from "../../../../main/contrib/actions/pages/uploadBurdenEstimatesPageActionCreators";
import {responsibilitiesActionCreators} from "../../../../main/contrib/actions/responsibilitiesActionCreators";
import {responsibilityOverviewPageActionCreators} from "../../../../main/contrib/actions/pages/responsibilityOverviewPageActionCreators";
import {mockContribState} from "../../../mocks/mockStates";
import {estimatesActionCreators} from "../../../../main/contrib/actions/estimatesActionCreators";

describe("Upload burden estimates page actions tests", () => {
    const sandbox = new Sandbox();

    const state = mockContribState({
        responsibilities: {
            currentResponsibility: mockResponsibility({}, mockScenario({
                description: "s1desc",
                id: "s1"
            }))
        }
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("has responsibilities overview as parent", () => {
        expect(uploadBurdenEstimatesPageActionCreators.parent).toEqual(responsibilityOverviewPageActionCreators);
    });

    it("creates breadcrumb", () => {

        const result = uploadBurdenEstimatesPageActionCreators.createBreadcrumb(state);
        expect(result.name).toEqual("Upload central burden estimates for s1desc");
        expect(result.urlFragment).toEqual("burdens/s1/");
    });

    it(
        "sets current responsibility set and resets estimate populate state",
        async () => {
            const store = createMockContribStore();

            sandbox.stubReduxActionCreator(responsibilitiesActionCreators, "setCurrentResponsibility",
                {type: "test-responsibility-type"});

            sandbox.stubReduxActionCreator(estimatesActionCreators, "resetPopulateState",
                {type: "test-reset-estimate"})

            await store.dispatch(uploadBurdenEstimatesPageActionCreators
                .loadData({groupId: "g1", touchstoneId: "t1", scenarioId: "s1"}));

            const actions = store.getActions();

            const expectedPayload = [
                {type: "test-responsibility-type", props: "s1"},
                {type: "test-reset-estimate", props: undefined}
            ];
            expect(actions).toEqual(expectedPayload);

        }
    );
});