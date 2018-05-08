import {UsersTypes, UsersAction} from "../actionTypes/UsersTypes";
import {User} from "../../shared/models/Generated";
import {isNonEmptyArray} from "../../shared/Helpers";

export interface UsersState {
    users: User[],
    showCreateUser: boolean,
    createUserError: string
}

export const usersInitialState: UsersState = {
    users: [],
    showCreateUser: false,
    createUserError: null
};

export const usersReducer = (state = usersInitialState, action: UsersAction) => {
    switch (action.type) {
        case UsersTypes.ALL_USERS_FETCHED:
            return {...state, users: isNonEmptyArray(action.data) ? action.data : []};
        case UsersTypes.SHOW_CREATE_USER:
            return {...state, showCreateUser: action.data};
        case UsersTypes.SET_CREATE_USER_ERROR:
            return {...state, createUserError: action.error};
        default:
            return state;
    }
};

