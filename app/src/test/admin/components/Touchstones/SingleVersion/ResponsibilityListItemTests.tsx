import {
    mockAnnotatedResponsibility,
    mockBurdenEstimateSet,
    mockResponsibility
} from "../../../../mocks/mockModels";
import {shallow} from "enzyme";

import * as React from "react";
import {ResponsibilityListItem} from "../../../../../main/admin/components/Touchstones/SingleTouchstoneVersion/ResponsibilityListItem";
import {createMockAdminStore} from "../../../../mocks/mockStore";
import {mockEvent} from "../../../../mocks/mocks";

describe("ResponsibilityListItem", () => {

    it("renders responsibility with no estimate set without permission to view comments", () => {
        const store = createMockAdminStore();
        const r = mockAnnotatedResponsibility();
        const rendered = shallow(<ResponsibilityListItem responsibility={r}/>, {context: {store}}).dive();
        const cells = rendered.find("td");
        expect(cells).toHaveLength(4);
        expect(cells.at(0).text()).toEqual(r.scenario.description);
        expect(cells.at(1).text()).toEqual(r.scenario.disease);
        expect(cells.at(2).text()).toEqual(r.status);
        expect(cells.at(3).text()).toEqual("None");
    });

    it("renders responsibility with no estimate set with permission to view comments", () => {
        const store = createMockAdminStore({auth: {canReviewResponsibilities: true}});
        const r = mockAnnotatedResponsibility();
        const rendered = shallow(<ResponsibilityListItem responsibility={r}/>, {context: {store}}).dive();
        const cells = rendered.find("td");
        expect(cells).toHaveLength(5);
        expect(cells.at(0).text()).toEqual(r.scenario.description);
        expect(cells.at(1).text()).toEqual(r.scenario.disease);
        expect(cells.at(2).text()).toEqual(r.status);
        expect(cells.at(3).text()).toEqual("None");
        expect(cells.at(4).text()).toContain("Lorem ipsum");
    });

    it("renders date of last estimate set", () => {
        const r = mockAnnotatedResponsibility(mockResponsibility({
            current_estimate_set: mockBurdenEstimateSet({uploaded_on: "2017-07-13 13:55:29 +0100"})
        }));
        const store = createMockAdminStore();
        const rendered = shallow(<ResponsibilityListItem responsibility={r}/>, {context: {store}}).dive();
        expect(rendered.find("td").at(3).text()).toEqual("2017-07-13 13:55:29 +0100");
    });

    it("renders comment and tooltip correctly", () => {
        const store = createMockAdminStore({auth: {canReviewResponsibilities: true}});
        const rendered = shallow(<ResponsibilityListItem responsibility={mockAnnotatedResponsibility()}/>, {context: {store}}).dive();
        const td = rendered.find("td").at(4);
        expect(td.find("div").at(0).text()).toEqual("Lorem ipsum");
        expect(td.find("div").at(0).prop("title")).toEqual("Lorem ipsum");
        expect(td.find("div").at(1).text()).toEqual("Edit");
    });

    it("fires action when comment edit link clicked", () => {
        const r = mockAnnotatedResponsibility();
        const store = createMockAdminStore({auth: {canReviewResponsibilities: true}});
        const rendered = shallow(<ResponsibilityListItem responsibility={r}/>, {context: {store}}).dive();
        rendered.find("td").at(4).find("a").simulate("click", mockEvent());
        expect(store.getActions()).toEqual([{type: "SET_CURRENT_TOUCHSTONE_RESPONSIBILITY", data: r}]);
    });

});