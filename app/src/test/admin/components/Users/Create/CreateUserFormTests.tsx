import * as React from "react";
import { Reform } from "alt-reform";
import { expect } from "chai";
import { shallow } from "enzyme";
import * as sinon from "sinon";
import { Sandbox } from "../../../../Sandbox";
import { mockFormProperties, numberOfSubmissionActions } from "../../../../mocks/mockForm";
import { ReduxFormValidationError } from "../../../../../main/shared/components/ReduxForm/ReduxFormValidationError";
import { mockFetcher, mockResponse, mockResult } from "../../../../mocks/mockRemote";
import { userStore } from "../../../../../main/admin/stores/UserStore";
import { mockEvent } from "../../../../mocks/mocks";
import { expectOrderedActions } from "../../../../actionHelpers";
import {
    CreateUserFields,
    createUserFormStore, suggestUsername
} from "../../../../../main/admin/components/Users/Create/CreateUserFormStore";
import {
    CreateUserForm,
    CreateUserFormComponent
} from "../../../../../main/admin/components/Users/Create/CreateUserForm";

function checkSubmit(form: Reform<CreateUserFields>,
                     done: DoneCallback,
                     sandbox: Sandbox,
                     callback: (spy: sinon.SinonSpy) => void) {
    const spy = sandbox.dispatchSpy();
    form.submit(mockEvent()).then(() => {
        callback(spy);
        done();
    }).catch(x => {
        done(Error(x));
    });
}

describe("CreateUserForm", () => {
    const sandbox = new Sandbox();
    let form: Reform<CreateUserFields>;

    before(() => {
        form = createUserFormStore("test");
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("renders fields", () => {
        form.change({
            name: "Saruman the Wise",
            email: "saruman@isengard",
            username: "the.wise"
        });

        const rendered = shallow(<CreateUserFormComponent {...mockFormProperties(form)} />);
        expect(rendered.find({ name: "name" }).prop("value")).to.equal("Saruman the Wise");
        expect(rendered.find({ name: "email" }).prop("value")).to.equal("saruman@isengard");
        expect(rendered.find({ name: "username" }).prop("value")).to.equal("the.wise");
    });

    it("renders validation errors", () => {
        const errors = {
            username: "Blah blah"
        };
        const rendered = shallow(<CreateUserFormComponent {...mockFormProperties(form, errors)} />);
        const validationErrors = rendered.find(ValidationError);
        let hasMessage: boolean = false;
        validationErrors.forEach(x => {
            hasMessage = hasMessage || x.prop("message") == "Blah blah";
        });
        expect(hasMessage).to.equal(true, "Expected there to be at least one ValidationError containing the message 'Blah blah'");
    });

    it("posts when form is submitted", (done: DoneCallback) => {
        mockFetcher(mockResponse(mockResult("")));
        const spy = sandbox.fetcherSpy();
        const fetchUsers = sandbox.stubFetch(userStore, "fetchUsers");
        const data = {
            name: "Name",
            email: "email@example.com",
            username: "user.name"
        };
        form.change(data);
        checkSubmit(form, done, sandbox, _ => {
            expect(spy.called).to.be.true;
            expect(spy.args[0][0]).to.equal("/users/");
            expect(spy.args[0][1]).to.eql({
                method: "post",
                body: JSON.stringify(data)
            });
            expect(fetchUsers.called).to.equal(true, "Expected fetchUsers to be called");
        });
    });

    it("displays error when post fails", (done: DoneCallback) => {
        mockFetcher(Promise.reject(true));
        form.change({
            name: "Name",
            email: "email@example.com",
            username: "user.name"
        });
        checkSubmit(form, done, sandbox, spy => {
            expectOrderedActions(
                spy,
                [{ action: "CreateUser_test/submitFailed", payload: "An error occurred creating the user" }],
                numberOfSubmissionActions
            );
        });
    });

    it("sets username to suggestion when name changes", () => {
        const props = mockFormProperties(form);
        const baseCallbackSpy = sandbox.sinon.stub(props.fields.name, "onChange");
        const changeSpy = sandbox.sinon.stub(props, "change");

        const rendered = shallow(<CreateUserFormComponent {...props} />);
        const event = { target: { value: "Joe Bloggs" } };
        rendered.find({ name: "name" }).simulate("change", event);
        expect(baseCallbackSpy.args[0][0]).to.eql(event);
        expect(changeSpy.args[0][0]).to.eql({
            username: "joe.bloggs"
        });
    });

    describe("username suggestor", () => {
        it("can handle one word", () => {
            expect(suggestUsername("joe")).to.equal("joe");
        });
        it("can handle two words", () => {
            expect(suggestUsername("joe bloggs")).to.equal("joe.bloggs");
        });
        it("can handle many words", () => {
            expect(suggestUsername("joe samuel stephen bloggs")).to.equal("joe.bloggs");
        });
        it("converts to lower case", () => {
            expect(suggestUsername("Joe Bloggs")).to.equal("joe.bloggs");
        });
        it("strips out bad characters", () => {
            expect(suggestUsername("j_1-o=%_e_")).to.equal("joe");
        });
    });
});