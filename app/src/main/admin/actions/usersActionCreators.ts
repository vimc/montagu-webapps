import { Dispatch } from "redux";

import {AdminAppState} from "../reducers/adminAppReducers";
import {User} from "../../shared/models/Generated";
import {UsersService} from "../services/UsersService";
import {AllUsersFetched, ShowCreateUser, UsersTypes} from "../actionTypes/UsersTypes";

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

    setShowCreateUser() {
        return {
            type: UsersTypes.SHOW_CREATE_USER
        } as ShowCreateUser;
    }
};
