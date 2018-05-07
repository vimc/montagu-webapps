import { Dispatch } from "redux";

import {breadcrumbsActionCreators} from "../../../shared/actions/breadcrumbsActionsCreators";
import {AdminAppState} from "../../reducers/adminAppReducers";
import {
    AdminResetPasswordPageComponent,
    AdminResetPasswordPageQuery
} from "../../components/Users/Account/ResetPasswordPage";
import {authActionCreators} from "../../../shared/actions/authActionCreators";

export const resetPasswordPageActionCreators = {

    onLoad(query: AdminResetPasswordPageQuery) {
        return (dispatch: Dispatch<AdminAppState>) => {
            dispatch(this.loadData(query));
            dispatch(breadcrumbsActionCreators.createBreadcrumbs(AdminResetPasswordPageComponent.breadcrumb()));
        }
    },

    loadData(query: AdminResetPasswordPageQuery) {
        return (dispatch: Dispatch<AdminAppState>) => {
            dispatch(authActionCreators.setResetPasswordToken(query.token));
        }
    }

};
