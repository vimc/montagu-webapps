import * as React from "react";
import { shallow } from "enzyme";
import { expect } from "chai";

import "../../../helper";
import {mockModellingGroup, mockTouchstone} from "../../../mocks/mockModels";
import { ResponsibilitiesPageTitle } from "../../../../main/contrib/components/Responsibilities/PageTitle";
import { InternalLink } from "../../../../main/shared/components/InternalLink";
import {Sandbox} from "../../../Sandbox";
import {createMockStore} from "../../../mocks/mockStore";

describe("DownloadDataTitleComponent", () => {

    const testGroup = mockModellingGroup();
    const testTouchstone = mockTouchstone();

    const sandbox = new Sandbox();

    afterEach(() => sandbox.restore());

    it("renders on connect level", () => {
        const store = createMockStore({
            groups: {currentUserGroup: testGroup},
            touchstones: {currentTouchstone: testTouchstone},
        })
        const rendered = shallow(<ResponsibilitiesPageTitle title={'test-1'}/>, {context: {store}});
        expect(rendered.props().group).to.eql(testGroup);
        expect(rendered.props().touchstone).to.eql(testTouchstone);
        expect(rendered.props().title).to.eql("test-1");
    });

    it("renders on component level with back link", () => {
        const store = createMockStore({
            groups: {currentUserGroup: testGroup},
            touchstones: {currentTouchstone: testTouchstone},
        })
        const rendered = shallow(<ResponsibilitiesPageTitle title={"test"}/>, {context: {store}}).dive();
        expect(rendered.find('div.mr-3').text()).to.equal("test");
        expect(rendered.find(InternalLink).props().href).to.equal(`/${testGroup.id}/responsibilities/${testTouchstone.id}/`);
        expect(rendered.find(InternalLink).props().children).to.equal("Return to responsibilities list");
    });

    it("renders on component level with no back link", () => {
        const store = createMockStore({
            groups: {currentUserGroup: testGroup},
            touchstones: {currentTouchstone: null},
        })
        const rendered = shallow(<ResponsibilitiesPageTitle title={"test"}/>, {context: {store}}).dive();
        expect(rendered.find('div.mr-3').text()).to.equal("test");
        expect(rendered.find(InternalLink).length).to.equal(0);
    });
});

