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
            return {...state, users: isNonEmptyArray(action.data) ? action.data : usersInitialState.users};
        case UsersTypes.ALL_USER_ROLES_FETCHED:
            return {...state, allUserRoles: isNonEmptyArray(action.data) ? action.data : usersInitialState.allUserRoles};
        case UsersTypes.SHOW_CREATE_USER:
            return {...state, showCreateUser: typeof action.data == "boolean" ? action.data : usersInitialState.showCreateUser};
        case UsersTypes.SET_CREATE_USER_ERROR:
            return {...state, createUserError: typeof action.error == "string" ? action.error : usersInitialState.createUserError};
        case UsersTypes.SET_CURRENT_USER:
            return {...state, currentUser: typeof action.data == "object" ? action.data : usersInitialState.currentUser};
        default:
            return state;
    }
};

