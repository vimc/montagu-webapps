import { expect } from 'chai';
import { Sandbox } from "../Sandbox";
import { alt } from "../../main/alt";
import { authActions, LogInProperties } from "../../main/actions/AuthActions";
import { expectOrderedActions } from "../actionHelpers";
import { AuthState, authStore, initialAuthState } from "../../main/stores/AuthStore";
import { initialMainState, mainStore, makeLookup } from "../../main/stores/MainStore";
import { mockModellingGroup } from "../mocks/mockModels";
import { ModellingGroup } from "../../main/models/Generated";
import { modellingGroupActions } from "../../main/actions/ModellingGroupActions";
const jwt = require("jsonwebtoken");

function setModellingGroups(group: ModellingGroup) {
    alt.bootstrap(JSON.stringify({
        MainStore: {
            modellingGroups: makeLookup([group])
        }
    }))
}

describe("AuthStore", () => {
    const sandbox = new Sandbox();

    beforeEach(() => {
        alt.recycle();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("handles logIn event", () => {
        const token = jwt.sign({
            sub: "test.user",
            permissions: "*/can-login,*/other",
            roles: "r1,modelling-group:test.group/member"
        }, 'secret');
        authActions.logIn(token);

        const expected: AuthState = {
            loggedIn: true,
            modellingGroups: null,
            permissions: [ "*/can-login", "*/other" ],
            username: "test.user",
            bearerToken: token
        };
        expect(authStore.getState()).to.eql(expected);

        const group = mockModellingGroup({ id: "test.group" });
        modellingGroupActions.update([ mockModellingGroup(), group ]);
        expect(authStore.getState().modellingGroups).to.eql(group);
    });

    it("clears everything on logOut", () => {
        alt.bootstrap(JSON.stringify({
            AuthStore: {
                loggedIn: true,
                username: "username",
                bearerToken: "TOKEN",
                permissions: [ "p1", "p2" ],
                modellingGroups: [ "group-1" ]
            },
            MainStore: {
                ready: true
            }
        }));
        authActions.logOut();
        expect(authStore.getState()).to.eql(initialAuthState());
        expect(mainStore.getState()).to.eql(initialMainState());
    });

    it("logIn invokes logIn action", () => {
        const spy = sandbox.dispatchSpy();
        const storeLoad = sandbox.sinon.stub(mainStore, "load");
        const token = "TOKEN";
        authStore.logIn(token);
        const expectedPayload: LogInProperties = {
            token: "TOKEN",
            username: null,
            modellingGroups: [],
            permissions: [],
            isModeller: false,
            isAccountActive: false
        };
        expectOrderedActions(spy, [{ action: "AuthActions.logIn", payload: expectedPayload }], 0);
        expect(storeLoad.called).to.be.false;
        storeLoad.restore();
    });

    it("logIn with good token also invokes MainStore.load", () => {
        const spy = sandbox.dispatchSpy();
        const storeLoad = sandbox.sinon.stub(mainStore, "load");
        const token = jwt.sign({
            sub: "test.user",
            permissions: "*/can-login,*/other",
            roles: "r1,modelling-group:test.group/member"
        }, 'secret');
        authStore.logIn(token);
        expectOrderedActions(spy, [{ action: "AuthActions.logIn" }], 0);
        expect(storeLoad.called).to.be.true;
        storeLoad.restore();
    });
});
