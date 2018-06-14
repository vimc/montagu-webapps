import { Dispatch } from "redux";

import { modellingGroupsActionCreators } from "../modellingGroupsActionCreators";
import {breadcrumbsActionCreators} from "../../../shared/actions/breadcrumbsActionsCreators";
import {ChooseActionPageComponent, ChooseActionPageLocationProps} from "../../components/ChooseAction/ChooseActionPage";
import {touchstonesActionCreators} from "../touchstonesActionCreators";
import {chooseGroupPageActionCreators} from "./chooseGroupPageActionCreators";
import {ContribAppState} from "../../reducers/contribAppReducers";

export const chooseActionPageActionCreators = {

    onLoad(props: ChooseActionPageLocationProps) {
        return async (dispatch: Dispatch<ContribAppState>, getState: () => ContribAppState) => {
            await dispatch(this.loadData(props));
            dispatch(breadcrumbsActionCreators.createBreadcrumbs(ChooseActionPageComponent.breadcrumb(getState())));
        }
    },

    loadData(props: ChooseActionPageLocationProps) {
        return async (dispatch: Dispatch<ContribAppState>, getState: () => ContribAppState) => {
            await dispatch(chooseGroupPageActionCreators.loadData());
            dispatch(modellingGroupsActionCreators.setCurrentGroup(props.groupId));
            console.log("Set current group: " + JSON.stringify(getState().groups.currentUserGroup));
            await dispatch(touchstonesActionCreators.getTouchstonesByGroupId(props.groupId));
            console.log("Fetched touchstones for group (i.e. responsibilities): " + JSON.stringify(getState().touchstones.touchstones));
        }
    }

};