import { Dispatch } from "redux";

import {AdminAppState} from "../reducers/adminAppReducers";
import {User} from "../../shared/models/Generated";
import {UsersService} from "../services/UsersService";
import {
    AllUserRolesFetched,
    AllUsersFetched,
    SetCreateUserError,
    SetCurrentUser,
    ShowCreateUser,
    UsersTypes
} from "../actionTypes/UsersTypes";
import {UserRole} from "../components/Users/SingleUser/UserRoleComponent";

export const usersActionCreators = {

    getAllUsers() {
        return async (dispatch: Dispatch<AdminAppState>, getState: () => AdminAppState) => {
            const users: User[] = await (new UsersService(dispatch, getState)).getAllUsers();
            dispatch({
                type: UsersTypes.ALL_USERS_FETCHED,
                data: users
            } as AllUsersFetched);
        }
    },

    getAllUserRoles() {
        return async (dispatch: Dispatch<AdminAppState>, getState: () => AdminAppState) => {
            const userRoles: UserRole[] = await (new UsersService(dispatch, getState)).getAllUserRoles();
            dispatch({
                type: UsersTypes.ALL_USER_ROLES_FETCHED,
                data: userRoles
            } as AllUserRolesFetched);
        }
    },

    clearUsersListCache() {
        return (dispatch: Dispatch<AdminAppState>, getState: () => AdminAppState) => {
            (new UsersService(dispatch, getState)).clearUsersListCache();
        }
    },

    setShowCreateUser(value: boolean) {
        return {
            type: UsersTypes.SHOW_CREATE_USER,
            data: value
        } as ShowCreateUser;
    },

    createUser(name: string, email: string, username: string) {
        return async (dispatch: Dispatch<AdminAppState>, getState: () => AdminAppState) => {
            const result = await (new UsersService(dispatch, getState)).createUser(name, email, username);
            if (result.errors) {
                dispatch({
                    type: UsersTypes.SET_CREATE_USER_ERROR,
                    error: result.errors[0].message
                } as SetCreateUserError);
            } else {
                dispatch(this.clearUsersListCache());
                dispatch(this.setShowCreateUser(false));
                await dispatch(this.getAllUsers());
            }
        }
    },

    setCurrentUser(username: string) {
        return (dispatch: Dispatch<AdminAppState>, getState: () => AdminAppState) => {
            const currentUser: User = getState().users.users.find((user) => user.username === username);
            dispatch({
                type: UsersTypes.SET_CURRENT_USER,
                data: currentUser
            } as SetCurrentUser);
        }
    },


};
