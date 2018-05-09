import { expect } from "chai";

import { Sandbox } from "../../Sandbox";
import { usersActionCreators } from "../../../main/admin/actions/usersActionCreators";
import {createMockStore} from "../../mocks/mockStore";
import {UsersService} from "../../../main/admin/services/UsersService";
import {UsersTypes} from "../../../main/admin/actionTypes/UsersTypes";
import {mockUser} from "../../mocks/mockModels";
import {runParametersActionCreators} from "../../../main/contrib/actions/runParametersActionCreators";
import {RunParametersService} from "../../../main/contrib/services/RunParametersService";

describe("Admin Users actions tests", () => {
    const sandbox = new Sandbox();

    afterEach(() => {
        sandbox.restore();
    });

    const testUser = mockUser();
    const testUser2 = mockUser();

    it("gets all users", (done) => {
        const store = createMockStore({});
        const getUsersServiceStub = sandbox.setStubFunc(UsersService.prototype, "getAllUsers", ()=>{
            return Promise.resolve([testUser, testUser2]);
        });
        store.dispatch(usersActionCreators.getAllUsers());
        setTimeout(() => {
            const actions = store.getActions()
            const expectedPayload = { type: UsersTypes.ALL_USERS_FETCHED, data: [testUser, testUser2]};
            expect(actions).to.eql([expectedPayload]);
            expect(getUsersServiceStub.called).to.be.true;
            done();
        });
    });

    it("gets all user roles", (done) => {
        const store = createMockStore({});
        const getAllUserRolesServiceStub = sandbox.setStubFunc(UsersService.prototype, "getAllUserRoles", ()=>{
            return Promise.resolve(['test-role-1', 'test-role-2']);
        });
        store.dispatch(usersActionCreators.getAllUserRoles());
        setTimeout(() => {
            const actions = store.getActions()
            const expectedPayload = { type: UsersTypes.ALL_USER_ROLES_FETCHED, data: ['test-role-1', 'test-role-2']};
            expect(actions).to.eql([expectedPayload]);
            expect(getAllUserRolesServiceStub.called).to.be.true;
            done();
        });
    });

    it("clears cache for user list", (done) => {
        const store = createMockStore({});
        const clearGetAllUsersServiceStub = sandbox.setStubFunc(UsersService.prototype, "clearUsersListCache", ()=>{
            return Promise.resolve();
        });
        store.dispatch(usersActionCreators.clearUsersListCache());
        setTimeout(() => {
            const actions = store.getActions();
            expect(actions).to.eql([]);
            expect(clearGetAllUsersServiceStub.called).to.be.true;
            done();
        });
    });

    it("sets show create user form", (done) => {
        const store = createMockStore({});
        store.dispatch(usersActionCreators.setShowCreateUser(true));
        setTimeout(() => {
            const actions = store.getActions()
            const expectedPayload = { type: UsersTypes.SHOW_CREATE_USER, data: true};
            expect(actions).to.eql([expectedPayload])
            done();
        });
    });

    it("creates user", (done) => {
        const testState = {
             users: {users: [testUser, testUser2]}
        };
        const store = createMockStore({});
        sandbox.setStubFunc(UsersService.prototype, "createUser", ()=>{
            return Promise.resolve("OK");
        });
        sandbox.setStubFunc(UsersService.prototype, "getAllUsers", ()=>{
            return Promise.resolve([testUser, testUser2]);
        });
        store.dispatch(usersActionCreators.createUser('name-1','email-1', 'username-1'));
        setTimeout(() => {
            const expectedPayload = [
                { type: UsersTypes.SHOW_CREATE_USER, data: false},
                { type: UsersTypes.ALL_USERS_FETCHED, data: [testUser, testUser2]},
            ];
            const actions = store.getActions();
            expect(actions).to.eql(expectedPayload);
            done();
        });
    });
});