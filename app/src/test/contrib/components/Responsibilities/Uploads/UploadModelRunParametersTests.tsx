import * as React from "react";
import { expect } from "chai";
import { shallow, ShallowWrapper } from "enzyme";
import {  mockResponsibility, mockScenario } from "../../../../mocks/mockModels";
import { setupMainStore } from "../../../../mocks/mocks";
import { Sandbox } from "../../../../Sandbox";
import {UploadForm} from "../../../../../main/shared/components/UploadForm";
import {UploadModelRunParametersForm} from "../../../../../main/contrib/components/Responsibilities/ModelRunParameters/UploadModelRunParametersComponent";

describe('UploadModelRunParametersForm', () => {
    let rendered: ShallowWrapper<any, any>;
    const sandbox = new Sandbox();

    function setUpComponent() {
        setupMainStore({
            diseases: [
                { id: "disease-id", name: "Disease name" }
            ]
        });

        const responsibility = mockResponsibility({
            status: "empty"
        }, mockScenario({
            id: "scenario-1",
            description: "Description",
        }));

        rendered = shallow(<UploadModelRunParametersForm
            groupId={"group-1"}
            scenarioId={responsibility.scenario.id}/>);
    }

    afterEach(() => sandbox.restore());

    it("has description field", () => {
        setUpComponent();

        const form = rendered.find(UploadForm);
        const descriptionField = form.prop("fields").first();
    });

    it("passes through choose model run parameter set text to UploadForm", () => {
        setUpComponent();

        const form = rendered.find(UploadForm);
        expect(form.prop("uploadText")).to.eq("Choose a model run parameter set")
    });

    it("gets token from store", () => {

    })

});