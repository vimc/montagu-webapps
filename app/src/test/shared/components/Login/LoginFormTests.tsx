import * as React from "react";
import {expect} from "chai";
import {shallow} from "enzyme";
import {applyMiddleware, combineReducers, createStore} from "redux";
import {Provider} from "react-redux";
import {reducer as formReducer} from "redux-form";
import thunk from 'redux-thunk';
import {MemoryRouter as Router} from 'react-router-dom';

import "../../../helper";
import {authReducer} from "../../../../main/shared/reducers/authReducer";
import {Sandbox} from "../../../Sandbox";
import {LoginForm, LoginFormComponent} from "../../../../main/shared/components/Login/LoginForm";
import {ValidationError} from "../../../../main/shared/components/Login/ValidationError";
import {authActionCreators} from "../../../../main/shared/actions/authActionCreators";
import {InternalLink} from "../../../../main/shared/components/InternalLink";

describe("LoginFormComponent unit testing", () => {
    const sandbox = new Sandbox();
    let formWrapper: any = null;
    const submitMock = sandbox.createSpy();

    before(() => {
        const spy = sandbox.sinon.spy();
        formWrapper = shallow(<LoginFormComponent handleSubmit={submitMock} submit={spy} email=""/>)
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("renders form and fields elements and submits on button click", () => {
        expect(formWrapper.find('Field[name="email"]')).to.have.length(1);
        expect(formWrapper.find('Field[name="password"]')).to.have.length(1);
        expect(formWrapper.find('form')).to.have.length(1);
        expect(formWrapper.find('button[type="submit"]')).to.have.length(1);
        formWrapper.find('button[type="submit"]').simulate('click');
        expect(submitMock.called).to.equal(true);
    });


});

describe("LoginForm connected with redux-form", () => {
    const sandbox = new Sandbox();
    let formWrapper: any = null;
    let store: any = null;

    beforeEach(() => {
        store = createStore(combineReducers({
            form: formReducer,
            auth: authReducer,
        }), applyMiddleware(thunk));

        formWrapper = sandbox.mount(<Provider store={store}><Router><LoginForm/></Router></Provider>);
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("validates email field while typing", () => {
        // initially validation box is empty
        expect(formWrapper.find(ValidationError).at(0).props().message).to.equal(null);
        // this sets field as touched
        formWrapper.find('input[name="email"]').simulate('focus');
        // this triggers validation
        formWrapper.find('input[name="email"]').simulate('blur');
        // validation box will show that email is required if we touch input field and keep it empty
        // check validation block prop
        expect(formWrapper.find(ValidationError).at(0).props().message).to.equal("Email address is required");
        // check if validation block rendered error
        expect(formWrapper.find(ValidationError).at(0).text()).to.equal("Email address is required");
        // trigger change of email field with invalid value
        formWrapper.find('input[name="email"]').simulate('change', {target: {value: 'abc'}});
        expect(formWrapper.find(ValidationError).at(0).props().message).to.equal("Email address is invalid");
        expect(formWrapper.find(ValidationError).at(0).text()).to.equal("Email address is invalid");
        // enter right value
        formWrapper.find('input[name="email"]').simulate('change', {target: {value: 'abc@abc.com'}});
        expect(formWrapper.find(ValidationError).at(0).props().message).to.equal(null);
    });

    it("validates password field while typing", () => {
        // initially validation box is empty
        expect(formWrapper.find(ValidationError).at(1).props().message).to.equal(null);
        // this sets field as touched
        formWrapper.find('input[name="password"]').simulate('focus');
        // this triggers validation
        formWrapper.find('input[name="password"]').simulate('blur');
        // validation box will show that password is required if we touch input field and keep it empty
        // check validation block prop
        expect(formWrapper.find(ValidationError).at(1).props().message).to.equal("Password is required");
        // check if validation block rendered error
        expect(formWrapper.find(ValidationError).at(1).text()).to.equal("Password is required");
        // trigger change of email field with invalid value
        formWrapper.find('input[name="password"]').simulate('change', {target: {value: 'abc'}});
        expect(formWrapper.find(ValidationError).at(1).props().message).to.equal(null);
    });

    it("submits login form data", () => {
        formWrapper.find('input[name="email"]').simulate('focus');
        formWrapper.find('input[name="email"]').simulate('change', {target: {value: 'abc@abc.com'}});
        formWrapper.find('input[name="password"]').simulate('focus');
        formWrapper.find('input[name="password"]').simulate('change', {target: {value: 'abc'}});
        const logInActionSpy = sandbox.setStubFunc(authActionCreators, "logIn", () => ({type: 'test'}));
        // simulate form submit
        formWrapper.find('form.form').simulate('submit');
        expect(logInActionSpy.callCount).to.equal(1);
        expect(logInActionSpy.getCall(0).args[0]).to.equal('abc@abc.com');
        expect(logInActionSpy.getCall(0).args[1]).to.equal('abc');
    });

    it("sets link to forgotten password page", () => {
        const href1 = formWrapper.find(".forgotten-password-link").find(InternalLink).prop("href");
        expect(href1).to.equal("/forgotten-password/");

        formWrapper.find('input[name="email"]').simulate('change', {target: {value: 'abc@abc.com'}});
        formWrapper.update();
        const href2 = formWrapper.find(".forgotten-password-link").find(InternalLink).prop("href");
        expect(href2).to.equal("/forgotten-password/?email=abc@abc.com");
    });
});