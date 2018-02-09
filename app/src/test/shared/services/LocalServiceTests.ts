import { expect } from "chai";
import { createStore, applyMiddleware, combineReducers } from "redux";
import thunk from 'redux-thunk';

import { Sandbox } from "../../Sandbox";

import { authReducer } from "../../../main/shared/reducers/authReducer";
import { LocalService } from "../../../main/shared/services/LocalService";
import { settings } from "../../../main/shared/Settings";

describe('Local service class initialization tests', () => {

    const sandbox = new Sandbox();

    afterEach(() => {
        sandbox.restore();
    });

    it('initializes default service with default option url', () => {
        const store = createStore(state => state, {});
        class TestService extends LocalService {
            test() {
                return {
                    options: this.options
                };
            }
        }
        sandbox.setStubFunc(settings, 'apiUrl', () => 'test-url')
        const testService = new TestService(store.dispatch, store.getState);
        const serviceData = testService.test();
        expect(serviceData.options.baseURL).is.equal('test-url');
        expect(typeof serviceData.options.bearerToken).to.equal('undefined')
    });

    it('initializes default service with request engine and token', () => {
        const store = createStore(state => state, {auth: {bearerToken: "token"}});

        class TestService extends LocalService {
            test() {
                return {
                    options: this.options,
                    requestOptions: this.makeRequestOptions('POST')
                };
            }
        }
        const testService = new TestService(store.dispatch, store.getState);
        const serviceData = testService.test();
        expect(serviceData.options.baseURL).is.not.empty;
        expect(serviceData.options.Authorization).is.equal("Bearer token");
        expect(serviceData.requestOptions.headers.Authorization).is.equal("Bearer token");
    });

    it('initializes default service with request engine, token and withCredentials option', () => {
        const store = createStore(state => state, {auth: {bearerToken: "token"}});

        class TestService extends LocalService {
            test() {
                this.setOptions({credentials: "include"})
                return {
                    requestOptions: this.makeRequestOptions('POST'),
                    options: this.options
                };
            }
        }
        const testService = new TestService(store.dispatch, store.getState);
        const serviceData = testService.test();
        expect(serviceData.options.baseURL).is.not.empty;
        expect(serviceData.options.Authorization).is.equal("Bearer token");
        expect(serviceData.requestOptions.credentials).is.equal("include");

    });

    it('initializes default service with request engine and basic authorization', () => {
        const store = createStore(state => state, {});
        const email = "abc@abc.com";
        const password = "abc";

        class TestService extends LocalService {
            test() {
                this.setOptions({Authorization: 'Basic ' + btoa(`${email}:${password}`)});
                return {
                    requestOptions: this.makeRequestOptions('POST'),
                    options: this.options
                };
            }
        }

        const testService = new TestService(store.dispatch, store.getState);
        const serviceData = testService.test();
        expect(serviceData.options.baseURL).is.not.empty;
        expect(serviceData.options.Authorization).is.equal("Basic " + btoa(`${email}:${password}`));

    });
});

describe('Local service class requests tests', () => {

    const sandbox = new Sandbox();

    afterEach(() => {
        sandbox.restore();
    });

    it('performs successful query', async () => {
        const store = createStore(state => state, {});
        class TestService extends LocalService {
            test() {
                return this.get("/test/");
            }
        }
        const testService = new TestService(store.dispatch, store.getState);
        sandbox.setStubFunc(testService, "doFetch", ()=> Promise.resolve());
        sandbox.setStubFunc(testService, "processResponse", ()=> Promise.resolve("testData"));
        const serviceData = await testService.test();
        expect(serviceData).to.equal("testData");
    });
});