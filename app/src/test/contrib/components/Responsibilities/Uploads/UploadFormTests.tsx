import * as React from "react";
import { expect } from "chai";
import { shallow, ShallowWrapper } from "enzyme";
import { Sandbox } from "../../../../Sandbox";
import {UploadForm} from "../../../../../main/shared/components/UploadForm";

const buttonStyles = require("../../../../../main/shared/styles/buttons.css");

describe('UploadForm', () => {
    let rendered: ShallowWrapper<any, any>;
    const sandbox = new Sandbox();

    function setUpComponent(canUpload: boolean,
                            token: string = "TOKEN") {

        rendered = shallow(<UploadForm
            token={token}
            fieldNames={[]}
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

});