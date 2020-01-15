import * as React from "react";
import { shallow} from "enzyme";
import { expect } from "chai";
import { Store } from "redux";

import "../../../../helper";
import {
    mockDisease, mockResponsibility, mockResponsibilitySetWithExpectations, mockScenario, mockTouchstoneVersion
} from "../../../../mocks/mockModels";
import { Sandbox } from "../../../../Sandbox";
import {createMockContribStore, createMockStore} from "../../../../mocks/mockStore";
import {ContribAppState} from "../../../../../main/contrib/reducers/contribAppReducers";
import {LoadingElement} from "../../../../../main/shared/partials/LoadingElement/LoadingElement";
import {
    ModelRunParametersContent,
    ModelRunParametersContentComponent
} from "../../../../../main/contrib/components/Responsibilities/ModelRunParameters/ModelRunParametersContent";
import {ModelRunParametersSection} from "../../../../../main/contrib/components/Responsibilities/ModelRunParameters/ModelRunParametersSection";

describe("Model Run Parameters Content component tests", () => {

    const testDisease = mockDisease();
    const testDisease2 = mockDisease();
    const testTouchstone = mockTouchstoneVersion();
    const testScenario = mockScenario({disease: testDisease.id, touchstones: [testTouchstone.id]});
    const testScenario2 = mockScenario({disease: testDisease2.id, touchstones: [testTouchstone.id]});
    const testResponsibility = mockResponsibility({scenario: testScenario});
    const testResponsibility2 = mockResponsibility({scenario: testScenario2});
    const testResponsibilitySet = mockResponsibilitySetWithExpectations({
        responsibilities: [testResponsibility, testResponsibility2],
        touchstone_version: testTouchstone.id
    });

    const testState = {
        touchstones: {currentTouchstoneVersion: testTouchstone},
        responsibilities: {responsibilitiesSet: testResponsibilitySet},
    };

    let store : Store<ContribAppState>;

    const sandbox = new Sandbox();
    beforeEach(() => {
        store = createMockContribStore(testState);
    });
    afterEach(() => sandbox.restore());

    test("renders on connect level and receives proper props", () => {
        const rendered = shallow(<ModelRunParametersContent/>, {context: {store}});
        expect(rendered.props().touchstone).to.eql(testTouchstone);
        expect(rendered.props().diseases).to.eql([testDisease.id, testDisease2.id]);
    });

    test("renders on branch level, passes", () => {
        const rendered = shallow(<ModelRunParametersContent/>, {context: {store}}).dive();
        expect(rendered.find(ModelRunParametersContentComponent).length).to.eql(1);
    });

    test("renders on branch level, not passes", () => {
        store = createMockStore({...testState, touchstones: {currentTouchstone: null}});
        const rendered = shallow(<ModelRunParametersContent/>, {context: {store}}).dive().dive();
        expect(rendered.find(LoadingElement).length).to.eql(1);
    });

    test("renders on component level, sections list", () => {
        const rendered = shallow(<ModelRunParametersContent/>, {context: {store}}).dive().dive();
        const sections = rendered.find(ModelRunParametersSection);
        expect(sections.length).to.equal(2);
        expect(sections.at(0).props().disease).to.equal(testDisease.id);
        expect(sections.at(1).props().disease).to.equal(testDisease2.id);
    });
});