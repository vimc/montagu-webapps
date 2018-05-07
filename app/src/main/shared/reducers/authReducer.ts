import { AuthActionsTypes, AuthTypeKeys } from "../actionTypes/AuthTypes";

export interface AuthState {
    loggedIn: boolean;
    username: string;
    bearerToken: string;
    permissions: string[];
    modellingGroups?: any;
    isAccountActive: boolean;
    isModeller: boolean;
    errorMessage?: string;
    resetPasswordToken?: string;
    resetPasswordTokenExpired?: boolean;
    resetPasswordError?: string;
}

export const initialAuthState: AuthState = {
    loggedIn: false,
    username: null,
    bearerToken: null,
    permissions: [],
    isAccountActive: false,
    isModeller: false,
    resetPasswordToken: null,
    resetPasswordTokenExpired: false,
    resetPasswordError: null
};

export const authReducer = (state = initialAuthState, action: AuthActionsTypes) => {
    switch (action.type) {
        case AuthTypeKeys.AUTHENTICATED:
            return { ...action.data };
        case AuthTypeKeys.UNAUTHENTICATED:
            return initialAuthState;
        case AuthTypeKeys.AUTHENTICATION_ERROR:
            return { ...state, errorMessage: action.error };
        case AuthTypeKeys.SET_RESET_PASSWORD_TOKEN:
            return { ...state, resetPasswordToken: action.data };
        case AuthTypeKeys.SET_RESET_PASSWORD_TOKEN_EXPIRED:
            return { ...state, resetPasswordTokenExpired: true };
        case AuthTypeKeys.SET_RESET_PASSWORD_ERROR:
            return { ...state, resetPasswordError: action.error };
        default:
            return state;
    }
};
