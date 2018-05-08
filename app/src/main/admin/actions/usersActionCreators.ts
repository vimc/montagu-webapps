import { Dispatch } from "redux";

import {AdminAppState} from "../reducers/adminAppReducers";
import {User} from "../../shared/models/Generated";
import {UsersService} from "../services/UsersService";
import {AllUsersFetched, SetCreateUserError, ShowCreateUser, UsersTypes} from "../actionTypes/UsersTypes";

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
    }
};
