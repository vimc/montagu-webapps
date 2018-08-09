import * as React from "react";
import {expect} from "chai";
import {shallow} from "enzyme";
import {FormValidationErrors} from "../../../main/shared/components/ReduxForm/ReduxFormValidationError";

describe("FormValidationErrors", () => {

    it("should return null if no errors", () => {

        const rendered = shallow(<FormValidationErrors errors={[]}/>);
        expect(rendered.find("div")).to.have.lengthOf(0);
    });

    it("should return all error messages", () => {

        const rendered = shallow(<FormValidationErrors errors={[{message: "first error", code: "e"},
            {code: "e", message: "second error"}]}/>);
        expect(rendered.find("div").childAt(0).text()).to.eq("first error, second error")
    })

});