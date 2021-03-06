import * as React from "react";
import {Sandbox} from "../../../Sandbox";
import {shallow} from "enzyme";
import {Store} from "redux";

import "../../../helper";
import {createMockContribStore, createMockStore} from "../../../mocks/mockStore";
import {
    ConfidentialityAgreementComponent,
    withConfidentialityAgreement
} from "../../../../main/contrib/components/Responsibilities/Overview/ConfidentialityAgreement";
import {ContribAppState} from "../../../../main/contrib/reducers/contribAppReducers";
import {userActionCreators} from "../../../../main/contrib/actions/userActionCreators";
import {LoadingElement} from "../../../../main/shared/partials/LoadingElement/LoadingElement";
import {mockTouchstoneVersion} from "../../../mocks/mockModels";

describe('Confidentiality Agreement Component tests', () => {

    const testTouchstone = mockTouchstoneVersion();
    const testTouchstoneRfp = mockTouchstoneVersion({id: "rfp-1"});

    class TestInnerComponent extends React.Component {
        render() {
            return <div>Test</div>
        }
    }

    const testState = {
        touchstones: {currentTouchstoneVersion: testTouchstoneRfp},
        user: {signedConfidentialityAgreement: false}
    };

    let store: Store<ContribAppState>;
    let TestComponent: any;
    let getStub: jest.SpyInstance;

    const sandbox = new Sandbox();
    beforeEach(() => {
        store = createMockContribStore(testState);
        getStub = sandbox.setStubReduxAction(userActionCreators, 'getConfidentialityAgreement');

        TestComponent = withConfidentialityAgreement(TestInnerComponent);
    });
    afterEach(() => sandbox.restore());

    it("renders on connect level", () => {
        const rendered = shallow(<TestComponent/>, {context: {store}});
        expect(rendered.props().touchstoneId).toEqual("rfp-1");
        expect(rendered.props().signed).toEqual(false);
        expect(typeof rendered.props().signAgreement).toBe("function");
    });

    it("renders loading element if touchstone is rfp and signed is null", () => {
        const anotherState = {...testState, user: {signedConfidentialityAgreement: null as any}};
        store = createMockStore(anotherState);
        const rendered = shallow(<TestComponent/>, {context: {store}}).dive().dive().dive();
        expect(rendered.find(LoadingElement).length).toBe(1);
    });

    it(
        "renders ConfidentialityAgreement if touchstone is rfp and not signed",
        () => {
            const rendered = shallow(<TestComponent/>, {context: {store}}).dive().dive().dive().dive();
            const agreement = rendered.find(ConfidentialityAgreementComponent);
            expect(agreement.length).toEqual(1);
            expect(agreement.props().touchstoneId).toBe("rfp-1");
            expect(agreement.props().signed).toBe(false);
            expect(typeof agreement.props().signAgreement).toEqual("function");
        }
    );

    it("renders wrapped component if touchstone is not rfp", () => {
        const anotherState = {...testState, touchstones: {currentTouchstoneVersion: testTouchstone}};
        store = createMockContribStore(anotherState);
        const rendered = shallow(<TestComponent/>, {context: {store}}).dive().dive().dive().dive();
        expect(rendered.find('div').text()).toEqual("Test");
    });

    it("renders wrapped component if signed is true", () => {
        const anotherState = {...testState, user: {signedConfidentialityAgreement: true}};
        store = createMockContribStore(anotherState);
        const rendered = shallow(<TestComponent/>, {context: {store}}).dive().dive().dive().dive();
        expect(rendered.find('div').text()).toBe("Test");
    });

    it("renders checkbox if touchstone is rfp and signed is false", () => {
        const rendered = shallow(<TestComponent/>, {context: {store}}).dive().dive().dive().dive().dive();
        expect(rendered.find('input[type="checkbox"]')).toHaveLength(1);
    });

    it("renders submit button if input checked", () => {
        const rendered = shallow(<TestComponent/>, {context: {store}}).dive().dive().dive().dive().dive();
        rendered.find('input[type="checkbox"]').simulate("change", {target: {checked: true}});
        expect(rendered.find("button")).toHaveLength(1);
    });

    it("does not renders submit button if input not checked", () => {
        const rendered = shallow(<TestComponent/>, {context: {store}}).dive().dive().dive().dive().dive();
        expect(rendered.find("button")).toHaveLength(0);
    });

    it("dispatches signConfidentialityAgreement on submit", () => {
        const signStub = sandbox.setStubReduxAction(userActionCreators, 'signConfidentialityAgreement');

        const rendered = shallow(<TestComponent/>, {context: {store}}).dive().dive().dive().dive().dive();

        rendered.setState({checked: true});
        rendered.find("button").simulate("click");

        expect(signStub.mock.calls.length).toBe(1);
    });

    it("dispatches getConfidentialityAgreement onMount", () => {

        shallow(<TestComponent touchstoneId={"rfp1"}/>,
            {context: {store}}).dive().dive();

        expect(getStub.mock.calls.length).toBe(1);
    });

});
