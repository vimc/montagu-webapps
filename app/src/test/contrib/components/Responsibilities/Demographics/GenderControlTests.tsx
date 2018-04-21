import * as React from "react";
import { expect } from "chai";
import { shallow } from "enzyme";

import "../../../../helper";
import { GenderControl } from "../../../../../main/contrib/components/Responsibilities/Demographics/GenderControl";
import { mockDemographicDataset } from "../../../../mocks/mockModels";
import ReactRadioButtonGroup from "react-radio-button-group";

describe("GenderControl", () => {
    it("gender is applicable when data set is selected and that gender has gender applicable", () => {
        const f = GenderControl.genderApplicable;
        expect(f(null)).to.be.false;
        expect(f(mockDemographicDataset({ gender_is_applicable: false }))).to.be.false;
        expect(f(mockDemographicDataset({ gender_is_applicable: true }))).to.be.true;
    });

    it("renders radio buttons when gender is applicable", () => {
        const set = mockDemographicDataset({ gender_is_applicable: true });
        const rendered = shallow(<GenderControl dataSet={set} value="" onSelectGender={null} />);
        expect(rendered.find(ReactRadioButtonGroup)).to.have.length(1);
    });

    it("renders message when gender is not applicable", () => {
        const set = mockDemographicDataset({ gender_is_applicable: false });
        const rendered = shallow(<GenderControl dataSet={set} value="" onSelectGender={null} />);
        expect(rendered.find(ReactRadioButtonGroup)).to.have.length(0);
        expect(rendered.text()).to.contain("Gender is not applicable");
    });
});
