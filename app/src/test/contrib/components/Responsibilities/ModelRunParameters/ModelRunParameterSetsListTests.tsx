import {ModelRunParameterSetsList} from "../../../../../main/contrib/components/Responsibilities/ModelRunParameters/ModelRunParameterSetsList";
import {shallow} from "enzyme";
import {expect} from "chai";
import * as React from "react";
import {mockModelRunParameterSet, mockTouchstone} from "../../../../mocks/mockModels";
import alt from "../../../../../main/shared/alt";

describe("ModelRunParameterSetsListComponent", () => {
    beforeEach(() => alt.recycle());
    afterEach(() => alt.recycle());

    it("renders empty message when there are no parameter sets", () => {
        const rendered = shallow(<ModelRunParameterSetsList
            sets={[]} touchstone={mockTouchstone()} />);
        expect(rendered.text()).to.contain("No parameter sets have been uploaded");
    });

    it("renders table when there are parameter sets", () => {
        const sets = [
            mockModelRunParameterSet({
                uploaded_on: "2017-12-25 12:00:00",
                uploaded_by: "me"
            })
        ];
        const rendered = shallow(<ModelRunParameterSetsList
             sets={sets} touchstone={mockTouchstone()} />);
        const row = rendered.find("table tbody tr").at(0);
        const values = row.find("td").map(cell => cell.text());
        expect(values).to.eql([
            "me",
            "Mon Dec 25 2017, 12:00"
        ])
    });
});