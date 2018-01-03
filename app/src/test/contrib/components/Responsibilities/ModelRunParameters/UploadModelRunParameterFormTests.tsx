import * as React from "react";
import {expect} from "chai";
import {shallow, ShallowWrapper} from "enzyme";
import {Sandbox} from "../../../../Sandbox";
import {mockFetcher} from "../../../../mocks/mockRemote";
import {UploadFileForm} from "../../../../../main/shared/components/UploadFileForm";
import {ModelRunParameterSection} from "../../../../../main/contrib/components/Responsibilities/ModelRunParameters/ModelRunParameterSection";
import {Form} from "../../../../../main/shared/components/Form";

describe('UploadModelRunParametersForm', () => {
    let rendered: ShallowWrapper<any, any>;
    const sandbox = new Sandbox();

    before(() => mockFetcher(Promise.resolve(null)));

    afterEach(() => sandbox.restore());

    it("renders UploadForm", () => {

        rendered = shallow(<ModelRunParameterSection
            url={"url"}
            sets={[]}
            disease={"d1"}
        />);

        const form = rendered.find(Form);
        expect(form).to.have.lengthOf(1);
    });

    it("populates hidden disease input", () => {

        rendered = shallow(<ModelRunParameterSection
            url={"token"}
            sets={[]}
            disease={"d1"}
        />);

        const input = rendered.find('input[name="disease"]');
        expect(input).to.have.lengthOf(1);
        expect(input.prop("value")).to.eql("d1");

    });

    it("populate hidden description input", () => {

        rendered = shallow(<ModelRunParameterSection
            url={"token"}
            sets={[]}
            disease={"d1"}
        />);

        const input = rendered.find('input[name="description"]');
        expect(input).to.have.lengthOf(1);
    });

});