import * as React from "react";
import {expect} from "chai";
import {shallow, ShallowWrapper} from "enzyme";
import {Sandbox} from "../../../../Sandbox";
import {Field, UploadForm} from "../../../../../main/shared/components/UploadForm";

const buttonStyles = require("../../../../../main/shared/styles/buttons.css");

describe('UploadForm', () => {
    let rendered: ShallowWrapper<any, any>;
    const sandbox = new Sandbox();

    function setUpComponent(canUpload: boolean,
                            token: string = "TOKEN",
                            fields: Field[] = []) {

        rendered = shallow(<UploadForm
            token={token}
            fields={fields}
            uploadText="Upload text"
            disabledText="Disabled text"
            canUpload={canUpload}/>);
    }

    afterEach(() => sandbox.restore());

    it("disables the choose file button if canUpload is false", () => {
        setUpComponent(false);
        const chooseFileButton = rendered.find(`.${buttonStyles.button}`).first();
        expect(chooseFileButton.text()).to.eq("Disabled text");
        expect(chooseFileButton.hasClass(buttonStyles.disabled)).to.eq(true);
    });

    it("disables the choose file button if token is null", () => {
        setUpComponent(true, null);
        const uploadButton = rendered.find(`button`).first();
        expect(uploadButton.prop("disabled")).to.eq(true);
    });

    it("enables choose file button if canUpload is true", () => {
        setUpComponent(true);

        const chooseFileButton = rendered.find(`.${buttonStyles.button}`).first();
        expect(chooseFileButton.text()).to.eq("Upload text");
        expect(chooseFileButton.hasClass(buttonStyles.disabled)).to.eq(false);
    });

    it("displays provided fields", () => {
        setUpComponent(true, "TOKEN", [
            {
                name: "field1",
                type: "text",
                label: "field1"
            }, {
                name: "field2",
                type: "number",
                label: "field2"
            }]);

        let inputs = rendered.find(`input[type="text"]`);
        const textInput = inputs.first();
        expect(textInput.prop("name")).to.eq("field1");

        inputs = rendered.find(`input[type="number"]`);
        const numericalInput = inputs.first();
        expect(numericalInput.prop("name")).to.eq("field2");
    });

});