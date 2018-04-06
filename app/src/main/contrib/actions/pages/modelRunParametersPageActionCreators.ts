import { Dispatch, Action } from "redux";

import {breadcrumbsActions} from "../../../shared/actions/breadcrumbsActions";
import {ContribAppState} from "../../reducers/contribAppReducers";
import {responsibilityOverviewPageActionCreators} from "./responsibilityOverviewPageActionCreators";
import {
    ModelRunParametersPageComponent,
    ModelRunParametersPageLocationProps
} from "../../components/Responsibilities/ModelRunParameters/ModelRunParametersPage";
import {runParametersActionCreators} from "../runParametersActionCreators";

export const modelRunParametersPageActionCreators = {
    onLoad(props: ModelRunParametersPageLocationProps) {
        return async (dispatch: Dispatch<any>, getState: () => any) => {
            await dispatch(this.loadData(props));
            dispatch(breadcrumbsActions.createBreadcrumbs(ModelRunParametersPageComponent.breadcrumb(getState())));
        }
    },

    loadData(props: ModelRunParametersPageLocationProps) {
        return async (dispatch: Dispatch<any>) => {
            await dispatch(responsibilityOverviewPageActionCreators.loadData(props));
            await dispatch(runParametersActionCreators.getParameterSets(props.groupId, props.touchstoneId));
        }
    }
};