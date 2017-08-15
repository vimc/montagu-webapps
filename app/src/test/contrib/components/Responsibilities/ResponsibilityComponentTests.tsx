import * as React from "react";
import { expect } from "chai";
import { shallow, ShallowWrapper } from "enzyme";
import { mockModellingGroup, mockResponsibility, mockScenario, mockTouchstone } from "../../../mocks/mockModels";
import { setupMainStore } from "../../../mocks/mocks";
import { Sandbox } from "../../../Sandbox";

import { ButtonLink } from "../../../../main/shared/components/ButtonLink";
import { ResponsibilityComponent } from "../../../../main/contrib/components/Responsibilities/Overview/List/ResponsibilityComponent";

const styles = require("../../../../main/contrib/components/Responsibilities/Responsibilities.css");

describe('ResponsibilityComponent', () => {
    let rendered: ShallowWrapper<any, any>;
    const sandbox = new Sandbox();

    before(() => {
        setupMainStore({
            diseases: [
                { id: "disease-id", name: "Disease name" }
            ]
        });

        const responsibility = mockResponsibility({
            status: "empty"
        }, mockScenario({
            id: "scenario-1",
            description: "Description",
        }));
        const group = mockModellingGroup({ id: "group-1" });
        const touchstone = mockTouchstone({ id: "touchstone-1" });
        rendered = shallow(<ResponsibilityComponent
            modellingGroup={ group }
            responsibility={ responsibility }
            touchstone={ touchstone } />);
    });

    afterEach(() => sandbox.restore());

    it("renders the scenario header", () => {
        expect(rendered.find(`.${styles.header}`).text()).to.contain("Description (ID: scenario-1)");
    });

    it("renders the responsibility status", () => {
        expect(rendered.find(`.${styles.header}`).text()).to.contain("empty");
    });

    it("renders the coverage download link", () => {
        const link = rendered.findWhere(e => e.is(ButtonLink) && e.children().text() == "Download coverage data");
        expect(link.prop("href")).to.equal(`/group-1/responsibilities/touchstone-1/coverage/scenario-1/`);
    });
});