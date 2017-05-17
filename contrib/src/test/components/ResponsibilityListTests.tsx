import * as React from "react";
import { expect } from "chai";
import { shallow } from "enzyme";
import { mockResponsibility, mockTouchstone } from "../mocks/mockModels";

import { ResponsibilityListComponent, ResponsibilityListComponentProps } from "../../main/components/Responsibilities/ResponsibilityList";
import { ResponsibilityComponent } from "../../main/components/Responsibilities/ResponsibilityComponent";
import { DiseaseFilter } from "../../main/components/Responsibilities/DiseaseFilter";
import { Responsibility } from "../../main/Models";

function makeProps(responsibilities: Array<Responsibility>,
                        currentDiseaseId?: string): ResponsibilityListComponentProps {
    return {
        touchstone: mockTouchstone(),
        currentDiseaseId: currentDiseaseId,
        responsibilitySet: {
            problems: "",
            status: null,
            touchstone: "touchstone-1",
            responsibilities
        },
        ready: true
    };
}

describe('ResponsibilityListComponent', () => {
    it("renders message when there are no responsibilities", () => {
        const props = makeProps([]);
        const rendered = shallow(<ResponsibilityListComponent {...props} />);
        expect(rendered.text()).to.contain("This modelling group has no responsibilities in this touchstone");
    });

    it("renders one ResponsibilityComponent per responsibility", () => {
        const props = makeProps([
            mockResponsibility({}, { id: "scenario-1", disease: "d1" }),
            mockResponsibility({}, { id: "scenario-2", disease: "d2" })
        ]);
        const rendered = shallow(<ResponsibilityListComponent {...props} />);
        const children = rendered.find(ResponsibilityComponent);
        expect(children).to.have.length(2);
        expect(children.at(0).key()).to.equal("scenario-1");
        expect(children.at(1).key()).to.equal("scenario-2");
    });

    it("renders disease filter", () => {
        const props = makeProps([ mockResponsibility() ]);
        const rendered = shallow(<ResponsibilityListComponent {...props} />);
        expect(rendered.find(DiseaseFilter)).to.have.length(1, "Expected to render DiseaseFilter");
    });

    it("can filter be filtered by diesase", () => {
        const props = makeProps([
            mockResponsibility({}, { id: "scenario-1", disease: "d1" }),
            mockResponsibility({}, { id: "scenario-2", disease: "d2" })
        ], "d2");
        const rendered = shallow(<ResponsibilityListComponent {...props} />);
        const children = rendered.find(ResponsibilityComponent);
        expect(children).to.have.length(1);
        expect(children.at(0).key()).to.equal("scenario-2");
    });
});