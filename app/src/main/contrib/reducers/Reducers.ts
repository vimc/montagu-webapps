import { combineReducers } from "redux";
import { reducer as formReducer } from "redux-form";

import { authReducer, AuthState } from "./AuthReducer";
import { modellingGroupsReducer } from "./ModellingGroupsReducer";

export interface GlobalState {
    auth: AuthState;
    form: any;
    groups: any;
}

const reducers = combineReducers({
    auth: authReducer,
    form: formReducer,
    groups: modellingGroupsReducer,
});

export default reducers;

