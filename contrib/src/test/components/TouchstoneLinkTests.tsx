import { setupVirtualDOM } from "../JSDomHelpers";
setupVirtualDOM();

import * as React from "react";
import * as sinon from "sinon";
import { expect } from "chai";
import { mount, shallow } from "enzyme";
import { mockTouchstone } from "../mocks/mockModels";
import { Link } from "simple-react-router";
import { alt } from "../../main/alt";
import * as actionHelpers from "../actionHelpers";

import { TouchstoneLink } from "../../main/components/Touchstones/TouchstoneList";
import * as TouchstoneStore from "../../main/stores/TouchstoneStore";
import * as ResponsibilityStore from "../../main/stores/ResponsibilityStore";

describe("TouchstoneLink", () => {
    it("renders correctly", () => {
        const touchstone = mockTouchstone({ id: "touchstone-1", description: "Description 1" });
        const rendered = mount(<TouchstoneLink {...touchstone} />).find(Link);
        expect(rendered.prop('href')).to.equal("/responsibilities/touchstone-1/");
        expect(rendered.text()).to.equal("Description 1");
    });

    it("emits events on click", () => {
        alt.bootstrap(JSON.stringify({
            TouchstoneStore: {
                touchstones: [
                    mockTouchstone({ id: "a", description: "A" }),
                    mockTouchstone({ id: "b", description: "B" })
                ],
                errorMessage: "",
                ready: true
            }
        }));

        const spy = actionHelpers.dispatchSpy();
        const fetchResponsibilities = sinon.stub(ResponsibilityStore.Store, "fetchResponsibilities");

        const touchstone = TouchstoneStore.Store.getState().touchstones[0];
        const rendered = shallow(<TouchstoneLink {...touchstone} />);
        rendered.find("Link").simulate("click");
        actionHelpers.expectOrderedActions(spy, [
            { action: "ResponsibilityActions.setTouchstone", payload: touchstone }
        ], 0);
        expect(fetchResponsibilities.called).to.be.true;
    });

    afterEach(actionHelpers.restoreDispatch);
});