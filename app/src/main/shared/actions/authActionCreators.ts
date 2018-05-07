import { Dispatch } from "redux";

import { jwtTokenAuth } from "../modules/jwtTokenAuth";
import { AuthService } from "../services/AuthService";
import { makeNotificationException, notificationActions} from "./NotificationActions";
import { appSettings, settings } from "../Settings";
import { appName } from 'appName';
import { AuthTokenData } from "../modules/jwtTokenAuth";
import { AuthState } from "../reducers/authReducer";
import { makeNotification, Notification } from "../actions/NotificationActions";
import { localStorageHandler } from "../services/localStorageHandler";
import {
    Authenticated, AuthenticationError, AuthTypeKeys, Unauthenticated
} from "../actionTypes/AuthTypes";
import {GlobalState} from "../reducers/GlobalState";
import {isNonEmptyArray} from "../Helpers";

export const authActionCreators = {

    logIn(email: string, password: string) {
        return async (dispatch: Dispatch<any>, getState: () => GlobalState) => {
            try {
                const response = await (new AuthService(dispatch, getState)).logIn(email, password)
                if (response.error) {
                    dispatch(this.authenticationError(response.error));
                } else {
                    dispatch(this.tokenReceived(response.access_token));
                }
            } catch(error) {
                const errorNotification = this.makeNotificationError('Server error');
                notificationActions.notify(errorNotification);
                throw makeNotificationException(error.message, "error");
            }
        }
    },

    loadSavedToken() {
        return (dispatch: Dispatch<any>) => {
            const token = localStorageHandler.get("accessToken");
            if (token) {
                const decoded: AuthTokenData = jwtTokenAuth.decodeToken(token);
                if (jwtTokenAuth.isExpired(decoded.exp)) {
                    console.log("Token is expired");
                    localStorageHandler.remove("accessToken");
                    dispatch(this.logOut())
                } else {
                    console.log("Found unexpired access token in local storage, so we're already logged in");
                    dispatch(this.tokenReceived(token));
                }
            }
        }
    },

    validateAuthResult(user: any)  {
        if (!user.isAccountActive) {
            return this.makeNotificationError("Your account has been deactivated");
        }
        if (appSettings.requiresModellingGroupMembership && (!user.modellingGroups || !user.modellingGroups.length)) {
            return this.makeNotificationError( "Only members of modelling groups can log into the contribution portal");
        }
    },

    makeNotificationError(error: string) :Notification {
        if (!error) return null;
        const support = settings.supportContact;
        return makeNotification(`${error}. Please contact ${support} for help.`, "error")
    },

    tokenReceived(token: string) {
        return (dispatch: Dispatch<any>, getState: () => GlobalState) => {
            const user: AuthState = jwtTokenAuth.getDataFromToken(token);
            const error: Notification = this.validateAuthResult(user);
            if (!error) {
                localStorageHandler.set("accessToken", token);
                dispatch({
                    type: AuthTypeKeys.AUTHENTICATED,
                    data: user,
                } as Authenticated);
                (new AuthService(dispatch, getState)).setShinyCookie();
            } else {
                notificationActions.notify(error);
                dispatch(this.authenticationError(error.message));
            }
        }
    },

    authenticationError(error: any) {
        return {
            type: AuthTypeKeys.AUTHENTICATION_ERROR,
            error: error ? "Your username or password is incorrect" : "An error occurred logging in",
        } as AuthenticationError;
    },

    logOut() {
        return (dispatch: Dispatch<any>, getState: () => GlobalState) => {
            localStorageHandler.remove("accessToken");
            (new AuthService(dispatch, getState))
                .clearAllCache()
                .clearShinyCookie();
            dispatch({
                type: AuthTypeKeys.UNAUTHENTICATED,
            } as Unauthenticated);
        }
    },

    forgotPassword(email: string) {
        return async (dispatch: Dispatch<any>, getState: () => GlobalState) => {
            const result = await (new AuthService(dispatch, getState)).forgotPassword(email);
            if (result) {
                return notificationActions.notify(makeNotification("Thank you. If we have an account registered for this email address you will receive a reset password link", "info"));
            }
        }
    },

    setResetPasswordToken(token: string) {
        return {
            type: AuthTypeKeys.SET_RESET_PASSWORD_TOKEN,
            data: token
        }
    },

    setResetPasswordError(error: string) {
        return {
            type: AuthTypeKeys.SET_RESET_PASSWORD_ERROR,
            error: error
        }
    },

    setResetPasswordTokenExpired() {
        return {
            type: AuthTypeKeys.SET_RESET_PASSWORD_TOKEN_EXPIRED,
        }
    },

    resetPassword(password: string) {
        return async (dispatch: Dispatch<any>, getState: () => GlobalState) => {
            const token = getState().auth.resetPasswordToken;
            let result = await (new AuthService(dispatch, getState)).resetPassword(password, token);
            if (result === "OK") {
                notificationActions.notify(makeNotification("Your password has been set. You are now being redirected to the Montagu homepage...", "info"))
                setTimeout(() => window.location.replace(settings.montaguUrl()), 3000);
            } else if (result && isNonEmptyArray(result.errors)) {
                if (result.errors[0].code == "invalid-token-used") {
                    dispatch(this.setResetPasswordError("This password reset link has expired. Please request a new one."));
                    dispatch(this.setResetPasswordTokenExpired());
                } else {
                    dispatch(this.setResetPasswordError(result.errors[0].Message));
                }
            } else {
                dispatch(this.setResetPasswordError("An error occurred setting the password"));
            }
        }
    }

};
