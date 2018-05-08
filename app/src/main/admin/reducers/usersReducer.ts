import {UsersTypes, UsersAction} from "../actionTypes/UsersTypes";
import {User} from "../../shared/models/Generated";
import {isNonEmptyArray} from "../../shared/Helpers";

export interface UsersState {
    users: User[],
    allUserRoles: string[],
    showCreateUser: boolean,
    createUserError: string,
    currentUser: User
}

export const usersInitialState: UsersState = {
    users: [],
    allUserRoles: [],
    showCreateUser: false,
    createUserError: null,
    currentUser: null
};

export const usersReducer = (state = usersInitialState, action: UsersAction) => {
    switch (action.type) {
        case UsersTypes.ALL_USERS_FETCHED:
            return {...state, users: isNonEmptyArray(action.data) ? action.data : []};
        case UsersTypes.ALL_USER_ROLES_FETCHED:
            return {...state, allUserRoles: isNonEmptyArray(action.data) ? action.data : []};
        case UsersTypes.SHOW_CREATE_USER:
            return {...state, showCreateUser: action.data};
        case UsersTypes.SET_CREATE_USER_ERROR:
            return {...state, createUserError: action.error};
        case UsersTypes.SET_CURRENT_USER:
            return {...state, currentUser: action.data};
        default:
            return state;
    }
};

