import {User} from "../../shared/models/Generated";

export enum UsersTypes {
    ALL_USERS_FETCHED = "ALL_USERS_FETCHED",
    SHOW_CREATE_USER = "SHOW_CREATE_USER",
}

export interface AllUsersFetched {
    type: UsersTypes.ALL_USERS_FETCHED;
    data: User[];
}

export interface ShowCreateUser {
    type: UsersTypes.SHOW_CREATE_USER;
}

export type UsersAction =
    | AllUsersFetched
    | ShowCreateUser;
