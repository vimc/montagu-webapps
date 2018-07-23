import { combineReducers } from "redux";
import { reducer as formReducer, FormReducer } from "redux-form";
import { routerReducer } from 'react-router-redux';

import {authReducer, AuthState} from "../../shared/reducers/authReducer";
import {reportsReducer, ReportsState} from "./reportsReducer";
import {usersReducer, UsersState} from "./userReducer";
import {breadcrumbsReducer, BreadcrumbsState} from "../../shared/reducers/breadcrumbsReducer";
import {onetimeTokenReducer, OneTimeTokenState} from "../../shared/reducers/oneTimeTokenReducer";

export interface ReportAppState {
    auth: AuthState;
    form: FormReducer;
    reports: ReportsState;
    users: UsersState;
    breadcrumbs: BreadcrumbsState;
    onetimeTokens: OneTimeTokenState
}

const reducers = combineReducers({
    auth: authReducer,
    form: formReducer,
    reports: reportsReducer,
    router: routerReducer,
    users: usersReducer,
    breadcrumbs: breadcrumbsReducer,
    onetimeTokens: onetimeTokenReducer
});

export default reducers;

