import { Dispatch, Action } from "redux";
import { settings } from "../Settings";
import { localStorageHandler } from "./localStorageHandler";
import {ErrorInfo, Result} from "../models/Generated";
import {
    makeNotificationException,
    Notification,
    NotificationException,
    notificationActions
} from "../actions/NotificationActions";

import { AuthTypeKeys } from "../actionTypes/AuthTypes";
import {GlobalState} from "../reducers/GlobalState";

export interface OptionsHeaders {
   Authorization?: string;
   'Content-Type'?: string;
};

export interface RequestOptions {
    headers?: OptionsHeaders;
    body?: any;
    method?: string;
    credentials?: "omit" | "same-origin" | "include";
}

export interface InputOptions {
    Authorization?: string;
    'Content-Type'?: string;
    credentials?: "omit" | "same-origin" | "include";
    baseURL?: string;
}

export abstract class LocalService {
    protected dispatch: Dispatch<Action>;
    protected getGlobalState: Function;
    protected abstract stateSegment: string;

    protected bearerToken: string;
    protected options: InputOptions = {};

    protected isCached: boolean = false;
    protected cachedData: any;

    public constructor(dispatch: Dispatch<Action>, getState: () => GlobalState) {
        this.dispatch = dispatch;
        this.getGlobalState = getState;

        this.bearerToken = this.getTokenFromState(getState());
        this.initOptions();

        this.processResponse = this.processResponse.bind(this);
        this.notifyOnErrors = this.notifyOnErrors.bind(this);
    }

    protected setCached(isCached: boolean, cachedData?: any) {
        this.isCached = isCached;
        this.cachedData = cachedData;
    }

    protected getState(){
        return this.getGlobalState()[this.stateSegment];
    }

    protected getTokenFromState(state: GlobalState) {
        if (state.auth && state.auth.bearerToken) {
            return state.auth.bearerToken
        }
    }

    public setOptions(options: InputOptions) {
        Object.assign(this.options, options);
    }

    protected initOptions() {
        this.options.baseURL = settings.apiUrl();
        if (this.bearerToken) {
            this.options.Authorization = 'Bearer ' + this.bearerToken;
        }
    }

    protected makeRequestOptions(method: string, body?: any) :RequestOptions {
        const headers: OptionsHeaders = {};
        if (this.options.Authorization) headers.Authorization = this.options.Authorization;
        if (this.options['Content-Type']) headers['Content-Type'] = this.options['Content-Type'];
        const requestOptions : RequestOptions = {
            method,
            headers,
        }
        if (this.options.credentials) requestOptions.credentials = this.options.credentials;
        if (body) requestOptions.body = body;
        return requestOptions;
    }

    protected makeUrl(uri: string) {
        return this.options.baseURL + uri;
    }

    protected doFetch(url: string, params? :any) {
        return fetch(url, params)
    }

    public get(url: string){
        console.log('get', url);
        return this.doRequest(url, "GET");
    }

    public post(url: string, params?:any){
        console.log('post', url, params);
        return this.doRequest(url, "POST");
    }

    protected doRequest(url: string, method: string) {
        if (this.isCached) {
           return Promise.resolve(this.cachedData);
        } else {
            return this.doFetch(this.makeUrl(url), this.makeRequestOptions(method))
                .then(this.processResponse)
                .catch(this.notifyOnErrors);
        }
    }

    public postNoProcess(url: string, params?:any){
        return this.doFetch(this.makeUrl(url), this.makeRequestOptions('POST', params))
            .then((response:any) => response.json());
    }

    processResponse<TModel>(response: Response): Promise<any> {
        return response.json()
            .then((response: any) => {
                const apiResponse = <Result>response;
                return this.processResult(apiResponse, response);
            });
    }

    processResult<TModel>(result: Result, response: any): TModel | void {
        const handleError = (error: ErrorInfo) => {
            switch (error.code) {
                case "bearer-token-invalid":
                    console.log("Access token has expired or is otherwise invalid: Logging out.");
                    this.dispatch(this.logOut())
                    const notification: Notification = {
                        message: "Your session has expired. You will need to log in again",
                        type: "info"
                    };
                    throw new NotificationException(notification);
                default:
                    throw makeNotificationException(error.message, "error");
            }
        };

        switch (result.status) {
            case "success":
                return result.data as TModel;
            case "failure":
                return result.errors.forEach(handleError);
            default:
                throw makeNotificationException("The server response was not correctly formatted: "
                    + response.toString(), "error");
        }
    }

    notifyOnErrors(error: any) {
        notificationActions.notify(error);
    }

    errorToNotificationException(error: any): NotificationException {
        if (error.hasOwnProperty("notification")) {
            return error;
        } else if (error instanceof Error) {
            return makeNotificationException(error.message, "error");
        } else {
            return makeNotificationException(error, "error");
        }
    }


    protected logOut() {
        return (dispatch: Dispatch<Action>) => {
            localStorageHandler.remove("accessToken");
            dispatch({
                type: AuthTypeKeys.UNAUTHENTICATED
            });
        };
    }

}
