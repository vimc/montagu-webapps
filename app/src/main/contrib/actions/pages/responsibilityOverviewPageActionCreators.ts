import { Dispatch } from "redux";

import {breadcrumbsActionCreators} from "../../../shared/actions/breadcrumbsActionsCreators";
import {touchstonesActionCreators} from "../touchstonesActionCreators";
import {ContribAppState} from "../../reducers/contribAppReducers";
import {
    ResponsibilityOverviewPageComponent,
    ResponsibilityOverviewPageLocationProps,
} from "../../components/Responsibilities/Overview/ResponsibilityOverviewPage";
import {responsibilitiesActionCreators} from "../responsibilitiesActionCreators";
import {diseasesActionCreators} from "../diseasesActionCreators";
import {chooseActionPageActionCreators} from "./chooseActionPageActionCreators";
import {userActionCreators} from "../userActionCreators";

export const responsibilityOverviewPageActionCreators = {

    onLoad(props: ResponsibilityOverviewPageLocationProps) {
        return async (dispatch: Dispatch<ContribAppState>, getState: () => ContribAppState) => {
            await dispatch(this.loadData(props));
            dispatch(breadcrumbsActionCreators.createBreadcrumbs(ResponsibilityOverviewPageComponent.breadcrumb(getState())));
        }
    },

    loadData(props: ResponsibilityOverviewPageLocationProps) {
        return async (dispatch: Dispatch<ContribAppState>, getState: () => ContribAppState) => {
            await dispatch(chooseActionPageActionCreators.loadData(props));
            await dispatch(diseasesActionCreators.getAllDiseases());
            console.log("Fetched diseases: " + JSON.stringify(getState().diseases.diseases));
            dispatch(touchstonesActionCreators.setCurrentTouchstoneVersion(props.touchstoneId));
            console.log("Set current touchstone version: " + JSON.stringify(getState().touchstones.currentTouchstoneVersion));
            await dispatch(responsibilitiesActionCreators.getResponsibilitySet());
            console.log("Fetched responsibilities: " + JSON.stringify(getState().responsibilities.responsibilitiesSet));
        }
    }

};