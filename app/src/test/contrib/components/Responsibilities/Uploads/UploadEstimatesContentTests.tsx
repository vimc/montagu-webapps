import * as React from "react";
import { expect } from "chai";
import {
    mockModellingGroup, mockResponsibility, mockScenario,
    mockTouchstone
} from "../../../../mocks/mockModels";
import { shallow } from "enzyme";

import { findLabelledCell } from "../../../../TableHelpers";
import { Sandbox } from "../../../../Sandbox";
import {
    UploadBurdenEstimatesContentComponent,
    UploadBurdenEstimatesContentComponentProps
} from "../../../../../main/contrib/components/Responsibilities/BurdenEstimates/UploadBurdenEstimatesContent";
import { UploadEstimatesForm } from "../../../../../main/contrib/components/Responsibilities/BurdenEstimates/UploadEstimatesForm";

describe("UploadEstimatesContentComponent", () => {
    const sandbox = new Sandbox();

    afterEach(() => {
        sandbox.restore();
    });

    it("renders the general metadata", () => {
        const touchstone = mockTouchstone();
        const scenario = mockScenario();
        const props = makeProps({ touchstone, scenario });
        const rendered = shallow(<UploadBurdenEstimatesContentComponent {...props} />);
        expect(findLabelledCell(rendered, "Touchstone").text()).to.equal(touchstone.description);
        expect(findLabelledCell(rendered, "Scenario").text()).to.equal(scenario.description);
    });

    it("renders UploadForm", () => {
        const props = makeProps({ coverageToken: "TOKEN" });
        const rendered = shallow(<UploadBurdenEstimatesContentComponent {...props} />);
        expect(rendered.find(UploadEstimatesForm).props()).to.eql({
            token: "TOKEN",
            canUpload: true,
            groupId: "group-1",
            scenarioId: "scenario-id",
            currentEstimateSet: null
        });
    });

});

function makeProps(props: any): UploadBurdenEstimatesContentComponentProps {
    const touchstone = mockTouchstone();
    const scenario = mockScenario();
    const group = mockModellingGroup({id: "group-1"});
    const resp = mockResponsibility();
    return {
        ready: true,
        props: Object.assign({
            touchstone,
            scenario,
            responsibilitySetStatus: "incomplete",
            group: group,
            estimatesToken: "TOKEN",
            responsibility: resp
        }, props)
    };
}