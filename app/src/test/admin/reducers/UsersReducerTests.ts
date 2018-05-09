import { expect } from "chai";

import {usersInitialState, usersReducer} from "../../../main/admin/reducers/usersReducer";
import {UsersTypes} from "../../../main/admin/actionTypes/UsersTypes";
import {mockUser} from "../../mocks/mockModels";

describe('Admin Users reducer tests', () => {

    const testUser = mockUser();
    const testUser2 = mockUser();

    const testRole = "r-1";
    const testRole2 = "r-2";

    it('sets fetched users', () => {
        expect(usersReducer(undefined, {
            type: UsersTypes.ALL_USERS_FETCHED,
            data: [testUser, testUser2]
        })).to.eql({...usersInitialState, users: [testUser, testUser2]});
    });

    it('sets fetched users empty ', () => {
        expect(usersReducer(undefined, {
            type: UsersTypes.ALL_USERS_FETCHED,
            data: null
        })).to.eql(usersInitialState);
    });

    it('sets fetched all user roles', () => {
        expect(usersReducer(undefined, {
            type: UsersTypes.ALL_USER_ROLES_FETCHED,
            data: [testRole, testRole2]
        })).to.eql({...usersInitialState, allUserRoles: [testRole, testRole2]});
    });

    it('sets fetched all user roles empty ', () => {
        expect(usersReducer(undefined, {
            type: UsersTypes.ALL_USER_ROLES_FETCHED,
            data: null
        })).to.eql(usersInitialState);
    });

    it('sets show create user form prop', () => {
        expect(usersReducer(undefined, {
            type: UsersTypes.SHOW_CREATE_USER,
            data: true
        })).to.eql({...usersInitialState, showCreateUser: true});
    });

    it('sets show create user form prop as null', () => {
        expect(usersReducer(undefined, {
            type: UsersTypes.SHOW_CREATE_USER,
            data: null
        })).to.eql(usersInitialState);
    });

    it('sets create user error', () => {
        expect(usersReducer(undefined, {
            type: UsersTypes.SET_CREATE_USER_ERROR,
            error: "Test error"
        })).to.eql({...usersInitialState, createUserError: "Test error"});
    });

    it('sets create user error as null', () => {
        expect(usersReducer(undefined, {
            type: UsersTypes.SET_CREATE_USER_ERROR,
            error: null
        })).to.eql(usersInitialState);
    });

    it('sets current user', () => {
        expect(usersReducer(undefined, {
            type: UsersTypes.SET_CURRENT_USER,
            data: testUser,
        })).to.eql({...usersInitialState, currentUser: testUser});
    });

    it('sets current user as null', () => {
        expect(usersReducer(undefined, {
            type: UsersTypes.SET_CURRENT_USER,
            data: null
        })).to.eql(usersInitialState);
    });

});