import * as React from "react";
import {shallow} from "enzyme";
import {expect} from "chai";
import {Store} from "redux";

import "../../../../helper";
import {
    mockDisease,
    mockModellingGroup,
    mockModelRunParameterSet,
    mockTouchstoneVersion
} from "../../../../mocks/mockModels";
import {Sandbox} from "../../../../Sandbox";
import {createMockContribStore, createMockStore} from "../../../../mocks/mockStore";
import {ContribAppState} from "../../../../../main/contrib/reducers/contribAppReducers";
import {LoadingElement} from "../../../../../main/shared/partials/LoadingElement/LoadingElement";

import {
    ModelRunParametersStatus,
    ModelRunParametersStatusComponent,
    ModelRunParametersStatusProps
} from "../../../../../main/contrib/components/Responsibilities/ModelRunParameters/ModelRunParametersStatus";
import {longestTimestamp} from "../../../../../main/shared/Helpers";
import {ModelRunParameterDownloadCertificate} from "../../../../../main/contrib/components/Responsibilities/ModelRunParameters/ModelRunParameterDownloadCertificate";
import {FileDownloadLink} from "../../../../../main/shared/components/FileDownloadLink";

describe("Model Run Parameters Status component tests", () => {

    const testGroup = mockModellingGroup({ id: "group-1" });
    const testDisease = mockDisease();
    const testTouchstone = mockTouchstoneVersion({ id: "touchstone-1" });
    const testRunParametersSet = mockModelRunParameterSet({disease: testDisease.id, id: 1});

    const testState = {
        groups: {currentUserGroup: testGroup},
        touchstones: {currentTouchstoneVersion: testTouchstone},
        runParameters: {sets: [testRunParametersSet], tokens:{[testRunParametersSet.id]: 'test-token'}}
    };

    let store : Store<ContribAppState>;

    const sandbox = new Sandbox();
    beforeEach(() => {
        store = createMockContribStore(testState);
    });
    afterEach(() => sandbox.restore());

    test("renders on connect level", () => {
        const rendered = shallow(<ModelRunParametersStatus disease={testDisease.id}/>, {context: {store}});
        expect(rendered.props().touchstone).to.eql(testTouchstone);
        expect(rendered.props().group).to.eql(testGroup);
        expect(rendered.props().set).to.eql(testRunParametersSet);
        expect(rendered.props().disease).to.eql(testDisease.id);
    });

    test("renders on branch level, passes", () => {
        const rendered = shallow(<ModelRunParametersStatus disease={testDisease.id}/>, {context: {store}}).dive();
        expect(rendered.find(ModelRunParametersStatusComponent).length).to.eql(1);
    });

    test("renders on branch level, not passes", () => {
        store = createMockStore({...testState, touchstones: {currentTouchstone: null}});
        const rendered = shallow(<ModelRunParametersStatus disease={testDisease.id}/>, {context: {store}}).dive().dive();
        expect(rendered.find(LoadingElement).length).to.eql(1);
    });

    test("renders on component level, shows alert if no set received ", () => {
        store = createMockStore({...testState, runParameters: {...testState.runParameters, sets: []}});
        const rendered = shallow(<ModelRunParametersStatus disease={testDisease.id}/>, {context: {store}}).dive().dive();
        expect(rendered.find('Alert').find('span').text()).to
            .equal(`You have not uploaded any parameter sets for ${testDisease.id}`);
    });

    test("renders on component level, shows message of downloadable files", () => {
        const rendered = shallow(<ModelRunParametersStatus disease={testDisease.id}/>, {context: {store}}).dive().dive();
        expect(rendered.find("Alert").find('span').text()
            .indexOf(`You last uploaded a parameter set on ${longestTimestamp(new Date(testRunParametersSet.uploaded_on))}`))
            .to.equal(0);
    });

    test(
        "renders on component level, passes params to certificate download",
        () => {
            const rendered = shallow(<ModelRunParametersStatus disease={testDisease.id}/>, {context: {store}}).dive().dive();

            const certificate = rendered.find(ModelRunParameterDownloadCertificate);
            expect(certificate.props().set).to.eql(testRunParametersSet);
        }
    );

    test("renders on component level, passes URL to set download link", () => {
        const props: ModelRunParametersStatusProps = {
            disease: testDisease.id,
            group: testGroup,
            set: testRunParametersSet,
            touchstone: testTouchstone
        };
        const rendered = shallow(<ModelRunParametersStatus {...props}/>, {context: {store}}).dive().dive();
        const button = rendered.find(FileDownloadLink);
        expect(button.prop("href")).to.equal("/modelling-groups/group-1/model-run-parameters/touchstone-1/1/");
    });
});