import {combineReducers} from "redux";
import {reducer as formReducer} from "redux-form";

import {authReducer} from "../../shared/reducers/authReducer";
import {breadcrumbsReducer, BreadcrumbsState} from "../../shared/reducers/breadcrumbsReducer";
import {modellingGroupsReducer, ModellingGroupsState} from "./modellingGroupsReducer";
import {usersReducer, UsersState} from "./usersReducer";
import {adminTouchstoneReducer, AdminTouchstoneState} from "./adminTouchstoneReducer";
import {CommonState} from "../../shared/reducers/CommonState";
import {notificationReducer} from "../../shared/reducers/notificationReducer";
import {demographicsReducer, DemographicsState} from "../../shared/reducers/demographicsReducer";

export interface AdminAppState extends CommonState {
    groups: ModellingGroupsState
    breadcrumbs: BreadcrumbsState;
    users: UsersState;
    touchstones: AdminTouchstoneState;
    demographics: DemographicsState;
}

const reducers = combineReducers({
    auth: authReducer,
    form: formReducer,
    groups: modellingGroupsReducer,
    breadcrumbs: breadcrumbsReducer,
    users: usersReducer,
    touchstones: adminTouchstoneReducer,
    notifications: notificationReducer,
    demographics: demographicsReducer
});

export default reducers;

