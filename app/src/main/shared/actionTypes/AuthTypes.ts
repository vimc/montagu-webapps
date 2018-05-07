import { AuthState } from "../reducers/authReducer";

export enum AuthTypeKeys {
    AUTHENTICATED = "AUTHENTICATED",
    UNAUTHENTICATED = "UNAUTHENTICATED",
    AUTHENTICATION_ERROR = "AUTHENTICATION_ERROR",
    SET_RESET_PASSWORD_TOKEN = "SET_RESET_PASSWORD_TOKEN",
    SET_RESET_PASSWORD_ERROR = "SET_RESET_PASSWORD_ERROR",
    SET_RESET_PASSWORD_TOKEN_EXPIRED = "SET_RESET_PASSWORD_TOKEN_EXPIRED",
}

export interface Authenticated {
    type: AuthTypeKeys.AUTHENTICATED;
    data: AuthState;
}

export interface AuthenticationError {
    type: AuthTypeKeys.AUTHENTICATION_ERROR;
    error: string;
}

export interface Unauthenticated {
    type: AuthTypeKeys.UNAUTHENTICATED;
}

export interface SetResetPasswordToken {
    type: AuthTypeKeys.SET_RESET_PASSWORD_TOKEN;
    data: string;
}

export interface SetResetPasswordError {
    type: AuthTypeKeys.SET_RESET_PASSWORD_ERROR;
    error: string;
}

export interface SetResetPasswordTokenExpired {
    type: AuthTypeKeys.SET_RESET_PASSWORD_TOKEN_EXPIRED;
}

export type AuthActionsTypes =
    | Authenticated
    | AuthenticationError
    | Unauthenticated
    | SetResetPasswordToken
    | SetResetPasswordError
    | SetResetPasswordTokenExpired
    ;