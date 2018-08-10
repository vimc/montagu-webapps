import * as React from "react";
import {expect} from "chai";
import {shallow, ShallowWrapper} from "enzyme";
import {Sandbox} from "../../Sandbox";
import {UploadFileForm} from "../../../main/shared/components/UploadFileForm";
import {helpers} from "../../../main/shared/Helpers";
import {Alert} from "reactstrap";
import {resetFetcher} from "../../mocks/mockRemote";

describe('UploadForm', () => {
    let rendered: ShallowWrapper<any, any>;
    const sandbox = new Sandbox();

    before(() => resetFetcher());
    afterEach(() => sandbox.restore());

    it("disables the submit button if enable submit is false", () => {

        rendered = shallow(<UploadFileForm successMessage={"success"}
                                           enableSubmit={false}
                                           href="url"/>);

        rendered.setState({"fileSelected": true});
        assertButtonIsDisabled();
    });

    it("disables submit button if href is null", () => {

        rendered = shallow(<UploadFileForm successMessage={"success"}
                                           enableSubmit={true}
                                           href={null}/>);

        rendered.setState({"fileSelected": true});
        assertButtonIsDisabled();
    });

    it("disables submit button if file not selected", () => {

        rendered = shallow(<UploadFileForm successMessage={"success"}
                                           enableSubmit={true}
                                           href="url"/>);
        assertButtonIsDisabled();
    });

    it("disables submit button and renders explanation if checkPath fails validation", () => {
        const validate = () => {
            return {
                isValid: false,
                content: <span>Bad things</span>
            };
        };
        rendered = shallow(<UploadFileForm href="url"
                                           enableSubmit={true}
                                           successMessage="success"
                                           validatePath={validate}/>);
        rendered.setState({"fileSelected": true});
        assertButtonIsDisabled();
        expect(rendered.find(".pathProblems").children().text()).to.contain("Bad things");
    });

    it("enables submit button if enableSubmit is true and URL is set", () => {

        rendered = shallow(<UploadFileForm successMessage={"success"}
                                           enableSubmit={true}
                                           href="url"/>);

        rendered.setState({"fileSelected": true});

        const uploadButton = rendered.find(`button`).first();
        expect(uploadButton.prop("disabled")).to.eq(false);
        expect(uploadButton.hasClass("disabled")).to.eq(false);
    });

    it("does not show alert", () => {

        sandbox.sinon.stub(helpers, "ingestQueryStringAndReturnResult").returns(null);

        rendered = shallow(<UploadFileForm successMessage={"success message"}
                                           enableSubmit={true}
                                           href="url"/>);

        const alerts = rendered.find(Alert);
        expect(alerts).to.have.lengthOf(2);
        expect(alerts.first().prop("isOpen")).to.eq(false);
        expect(alerts.last().prop("isOpen")).to.eq(false);

    });

    it("ingests query string and displays error", () => {

        sandbox.sinon.stub(helpers, "ingestQueryStringAndReturnResult").returns({
            status: "failure",
            errors: [{code: "code", message: "error message"}],
            data: null
        });

        rendered = shallow(<UploadFileForm successMessage={"success"}
                                           enableSubmit={true}
                                           href="url"/>);

        const alerts = rendered.find(Alert);
        const errorAlert = alerts.first();
        const successAlert = alerts.last();
        expect(errorAlert.prop("isOpen")).to.eq(true);
        expect(successAlert.prop("isOpen")).to.eq(false);
        expect(errorAlert.childAt(0).text()).to.eql("error message");
    });

    it("ingests query string and displays success message", () => {

        sandbox.sinon.stub(helpers, "ingestQueryStringAndReturnResult").returns({
            status: "success",
            errors: [],
            data: "OK"
        });

        rendered = shallow(<UploadFileForm successMessage={"success message"}
                                           enableSubmit={true}
                                           href="url"/>);

        const alerts = rendered.find(Alert);
        const errorAlert = alerts.first();
        const successAlert = alerts.last();
        expect(errorAlert.prop("isOpen")).to.eq(false);
        expect(successAlert.prop("isOpen")).to.eq(true);
        expect(successAlert.childAt(0).text()).to.eql("success message");
    });

    function assertButtonIsDisabled() {
        const uploadButton = rendered.find(`button`).first();
        expect(uploadButton.prop("disabled")).to.eq(true);
        expect(uploadButton.hasClass("disabled")).to.eq(true);
    }

});