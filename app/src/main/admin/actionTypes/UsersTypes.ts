import {User} from "../../shared/models/Generated";

export enum UsersTypes {
    ALL_USERS_FETCHED = "ALL_USERS_FETCHED",
    SHOW_CREATE_USER = "SHOW_CREATE_USER",
    SET_CREATE_USER_ERROR = "SET_CREATE_USER_ERROR",
    SET_CURRENT_USER = "SET_CURRENT_USER"
}

export interface AllUsersFetched {
    type: UsersTypes.ALL_USERS_FETCHED;
    data: User[];
}

export interface ShowCreateUser {
    type: UsersTypes.SHOW_CREATE_USER;
    data: boolean;
}

export interface SetCreateUserError {
    type: UsersTypes.SET_CREATE_USER_ERROR;
    error: string;
}

export interface SetCurrentUser {
    type: UsersTypes.SET_CURRENT_USER;
    data: User;
}

export type UsersAction =
    | AllUsersFetched
    | ShowCreateUser
    | SetCreateUserError
    | SetCurrentUser
;
