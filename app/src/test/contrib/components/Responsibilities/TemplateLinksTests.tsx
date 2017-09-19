import * as React from "react";
import { Sandbox } from "../../../Sandbox";
import * as mocks from "../../../mocks/mocks";
import { shallow } from "enzyme";
import { expect } from "chai";
import { mockExtendedResponsibilitySet, mockResponsibility, mockScenario } from "../../../mocks/mockModels";

import {
    TemplateButtonLink,
    TemplateLinks
} from "../../../../main/contrib/components/Responsibilities/Overview/List/TemplateLinks";
import { ButtonLink } from "../../../../main/shared/components/ButtonLink";

describe("TemplateLinks", () => {
    const sandbox = new Sandbox();

    afterEach(() => {
        sandbox.restore();
    });

    it("is empty if there are no diseases", () => {
        const set = mockExtendedResponsibilitySet({}, []);
        set.responsibilities = [];

        const rendered = shallow(<TemplateLinks responsibilities={set.responsibilities} groupId="grpid" />);
        expect(rendered.find(TemplateButtonLink).length).to.eq(0)
    });

    it("renders template links", () => {

        const set = mockExtendedResponsibilitySet({}, [
            mockResponsibility({}, mockScenario({ disease: "d1" })),
            mockResponsibility({}, mockScenario({ disease: "d2" }))
        ]);
        const rendered = shallow(<TemplateLinks responsibilities={set.responsibilities} groupId="grpid" />);
        const buttons = rendered.find(TemplateButtonLink);
        expect(buttons.length).to.eq(2);
    });

});

describe("TemplateButtonLink", () => {
    const sandbox = new Sandbox();

    afterEach(() => {
        sandbox.restore();
    });

    it("renders template links", () => {
        mocks.setupMainStore({
            diseases: [
                { id: "d1", name: "Disease 1" },
                { id: "d2", name: "Disease 2" },
            ]
        });
        const rendered = shallow(<TemplateButtonLink groupId="grpid" diseaseId="d1"/>);
        const buttons = rendered.find(ButtonLink);
        expect(buttons.length).to.eq(1);
        expect(buttons.first().prop("href")).to.eq("/templates/burden_template_d1-grpid.csv");
    });
});