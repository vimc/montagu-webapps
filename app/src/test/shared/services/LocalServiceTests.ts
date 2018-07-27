import {expect} from "chai";
import {createStore} from "redux";

import {Sandbox} from "../../Sandbox";
import * as sinon from 'sinon';
import {AbstractLocalService} from "../../../main/shared/services/AbstractLocalService";
import {settings} from "../../../main/shared/Settings";
import {AuthTypeKeys} from "../../../main/shared/actionTypes/AuthTypes";
import {createMockStore} from "../../mocks/mockStore";
import {SingletonVariableCache} from "../../../main/shared/modules/cache/singletonVariableCache";
import {Dispatch} from "react-redux";
import {GlobalState} from "../../../main/shared/reducers/GlobalState";
import {CacheInterface} from "../../../main/shared/modules/cache/CacheInterface";
import {mockContribState} from "../../mocks/mockStates";
import {NotificationTypeKeys} from "../../../main/shared/actionTypes/NotificationTypes";

describe('Local service class initialization tests', () => {

    const sandbox = new Sandbox();

    afterEach(() => {
        sandbox.restore();
    });

    it('initializes default service', () => {
        const store = createStore(state => state, mockContribState({auth: {bearerToken: null}}));
        class TestService extends AbstractLocalService {
            test() {
                return {
                    options: this.options
                };
            }
        }
        const testService = new TestService(store.dispatch, store.getState);
        const serviceData = testService.test();
        expect(typeof serviceData.options.Authorization).to.equal('undefined')
    });

    it('initializes default service with request engine and compressed token', () => {
        const store = createStore(state => state, mockContribState({auth: {bearerToken: "token"}}));

        class TestService extends AbstractLocalService {
            test() {
                return {
                    options: this.options,
                    requestOptions: this.makeRequestOptions('POST')
                };
            }
        }
        const testService = new TestService(store.dispatch, store.getState);
        const serviceData = testService.test();
        expect(serviceData.options.Authorization).is.equal("Bearer token");
        expect(serviceData.requestOptions.headers.Authorization).is.equal("Bearer token");
    });

    it('initializes default service with request engine, token and withCredentials option', () => {

        const store = createStore(state => state, mockContribState({auth: {bearerToken: "token"}}));

        class TestService extends AbstractLocalService {
            test() {
                this.setOptions({credentials: "include"});
                return {
                    requestOptions: this.makeRequestOptions('POST'),
                    options: this.options
                };
            }
        }
        const testService = new TestService(store.dispatch, store.getState);
        const serviceData = testService.test();
        expect(serviceData.options.Authorization).is.equal("Bearer token");
        expect(serviceData.requestOptions.credentials).is.equal("include");

    });

    it('initializes default service with request engine and basic authorization', () => {
        const store = createStore(state => state, mockContribState());
        const email = "abc@abc.com";
        const password = "abc";

        class TestService extends AbstractLocalService {
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
        expect(serviceData.options.Authorization).is.equal("Basic " + btoa(`${email}:${password}`));

    });
});

describe('Local service class requests tests', () => {

    const sandbox = new Sandbox();

    afterEach(() => {
        sandbox.restore();
    });

    it('performs successful query', async () => {
        sandbox.setStubFunc(settings, 'apiUrl', () => 'api.address');
        sandbox.setStubFunc(settings, 'reportingApiUrl', () => 'reporting.address');
        const store = createStore(state => state, mockContribState());
        class TestService extends AbstractLocalService {
            test() {
                return this.get("/test/");
            }
        }
        const testService = new TestService(store.dispatch, store.getState);
        const doFetch = sandbox.setStubFunc(testService, "doFetch", () => Promise.resolve());
        sandbox.setStubFunc(testService, "processResponse", ()=> Promise.resolve("testData"));
        const serviceData = await testService.test();
        expect(serviceData).to.equal("testData");
        expect(doFetch.args[0][0]).to.eql("api.address/test/");
    });

    it('performs successful query to reporting API', async () => {
        sandbox.setStubFunc(settings, 'apiUrl', () => 'api.address');
        sandbox.setStubFunc(settings, 'reportingApiUrl', () => 'reporting.address');
        const store = createStore(state => state, mockContribState());
        class TestService extends AbstractLocalService {
            test() {
                return this.get("/test/", "reporting");
            }
        }
        const testService = new TestService(store.dispatch, store.getState);
        const doFetch = sandbox.setStubFunc(testService, "doFetch", () => Promise.resolve());
        sandbox.setStubFunc(testService, "processResponse", ()=> Promise.resolve("testData"));
        const serviceData = await testService.test();
        expect(serviceData).to.equal("testData");
        expect(doFetch.args[0][0]).to.eql("reporting.address/test/");
    });

    it('performs query and api says token expired', async () => {
        const store = createMockStore();
        class TestService extends AbstractLocalService {
            test() {
                return this.get("/test/");
            }
        }
        const testService = new TestService(store.dispatch, store.getState);
        sandbox.setStubFunc(testService, "doFetch", ()=> Promise.resolve({
            json: (): any => {
                return Promise.resolve({
                    status: "failure",
                    errors: [{code: "bearer-token-invalid"}]
                })
            }
        }));
        try {
            await testService.test();
        } catch(e) {
            const actions = store.getActions();
            expect(actions[0].type).to.eql(AuthTypeKeys.UNAUTHENTICATED);
            expect(actions[1].type).to.eql(NotificationTypeKeys.NOTIFY);
            expect(actions[1].severity).to.eql("error");
            expect(actions[1].message).to.contain("You will need to log in again");
        }
    });

    it("raises error if API returns errors", async () => {
        const store = createMockStore();
        class TestService extends AbstractLocalService {
            test() {
                return this.get("/test/");
            }
        }
        const testService = new TestService(store.dispatch, store.getState);
        sandbox.setStubFunc(testService, "doFetch", ()=> Promise.resolve({
            json: (): any => {
                return Promise.resolve({
                    status: "failure",
                    errors: [{code: "normal-error", message: "some message"}]
                })
            }
        }));
        try {
            await testService.test();
        } catch(e) {
            const actions = store.getActions();
            expect(actions[0].type).to.eql(AuthTypeKeys.UNAUTHENTICATED);
            expect(actions[1].type).to.eql(NotificationTypeKeys.NOTIFY);
            expect(actions[1].severity).to.eql("error");
            expect(actions[1].message).to.contain("some message");
        }
    });

    it("raises error if API returns badly formatted result", async () => {
        const store = createMockStore();
        class TestService extends AbstractLocalService {
            test() {
                return this.get("/test/");
            }
        }
        const testService = new TestService(store.dispatch, store.getState);
        sandbox.setStubFunc(testService, "doFetch", ()=> Promise.resolve({
            json: (): any => Promise.resolve("just a string")
        }));
        try {
            await testService.test();
        } catch(e) {
            const actions = store.getActions();
            expect(actions[0].type).to.eql(AuthTypeKeys.UNAUTHENTICATED);
            expect(actions[1].type).to.eql(NotificationTypeKeys.NOTIFY);
            expect(actions[1].severity).to.eql("error");
            expect(actions[1].message).to.contain("The server response was not correctly formatted");
        }
    });
});

describe('Local service cache tests', () => {

    const sandbox = new Sandbox();

    class TestService extends AbstractLocalService {
        constructor(dispatch: Dispatch<any>, getState: () => GlobalState) {
            super(dispatch, getState);
            this.cacheEngine = new SingletonVariableCache()
        }
        testWithoutCache() {
            return this.get("/test/");
        }
        testWithCache() {
            return this.setOptions({cacheKey: "test"}).get("/test/");
        }
        getCacheEngine() {
            return this.cacheEngine;
        }
        publicClearCache(cacheKey: string, url: string) {
            this.clearCache(cacheKey, url);
        }
    }

    let testService: TestService, cacheEngine: CacheInterface, setCacheSpy: sinon.SinonSpy,
        getCacheSpy: sinon.SinonSpy, doFetchStub: sinon.SinonStub;

    afterEach(() => {
        sandbox.restore();
    });

    beforeEach(() => {
        const store = createMockStore();

        testService = new TestService(store.dispatch, store.getState);
        cacheEngine = testService.getCacheEngine();
        setCacheSpy = sandbox.setSpy(cacheEngine, "set");
        getCacheSpy = sandbox.setSpy(cacheEngine, "get");

        doFetchStub = sandbox.setStubFunc(testService, "doFetch", ()=> Promise.resolve({
            json: (): any => {
                return Promise.resolve({
                    status: "success",
                    data: "testData"
                })
            },
            url: settings.apiUrl() + "/test/"
        }));
    });

    it('clears individual cache item by key', async () => {

        const url =  "/test/";
        const fullyQualifiedKey = ["localService", "TestService", "test",
            encodeURIComponent(settings.apiUrl() + url)].join(".");

        // first set the cache
        await testService.testWithCache();

        expect(cacheEngine.get(fullyQualifiedKey)).to.not.be.undefined;

        // now clear
        testService.publicClearCache("test", url);

        expect(cacheEngine.get(fullyQualifiedKey)).to.be.undefined;

    });

    it('performs query without a cache', async () => {

        const result = await testService.testWithoutCache();

        expect(doFetchStub.called).to.equal(true);
        expect(setCacheSpy.called).to.equal(false);
        expect(getCacheSpy.called).to.equal(false);
        expect(result).to.equal("testData");
    });

    it('performs query with the cache 2 times, first time from api, second from cache', async () => {

        const resultFromApi = await testService.testWithCache();

        // first time it makes request and sets data to cache
        expect(doFetchStub.called).to.equal(true);
        expect(setCacheSpy.called).to.equal(true);
        expect(resultFromApi).to.equal("testData");

        doFetchStub.reset();

        // do second request
        const resultFromCache = await testService.testWithCache();

        // second time it doesn't make a request and fetches data from cache
        expect(doFetchStub.called).to.equal(false);
        expect(getCacheSpy.called).to.equal(true);
        expect(resultFromCache).to.equal("testData");
        expect(cacheEngine.get(["localService", "TestService", "test",
            encodeURIComponent(settings.apiUrl() + "/test/")].join("."))).to.equal("testData");
    });
});