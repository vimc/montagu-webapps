import {expect} from "chai";

import {Sandbox} from "../../../Sandbox";
import {createMockContribStore} from "../../../mocks/mockStore";
import {expectationsPageActionCreators} from "../../../../main/contrib/actions/pages/expectationsPageActionCreators";
import {responsibilityOverviewPageActionCreators} from "../../../../main/contrib/actions/pages/responsibilityOverviewPageActionCreators";
import {mockContribState} from "../../../mocks/mockStates";

describe("ExpectationsPage actions tests", () => {
    const sandbox = new Sandbox();

    afterEach(() => {
        sandbox.restore();
    });

    it("has responsibilities overview page as parent", () => {
        expect(expectationsPageActionCreators.parent).to.eq(responsibilityOverviewPageActionCreators)
    });

    it("creates breadcrumb", () => {
        const state = mockContribState();
        const result = expectationsPageActionCreators.createBreadcrumb(state);
        expect(result.urlFragment).to.eq("templates/");
        expect(result.name).to.eq("Download burden estimate templates");
    });

    it("loads nothing", async () => {

        const store = createMockContribStore();
        await store.dispatch(expectationsPageActionCreators
            .loadData());

        const actions = store.getActions();
        expect(actions).to.eql([]);

    });


});