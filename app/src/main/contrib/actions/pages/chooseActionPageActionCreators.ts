import { Dispatch } from "redux";

import { modellingGroupsActionCreators } from "../modellingGroupsActionCreators";
import {breadcrumbsActionCreators} from "../../../shared/actions/breadcrumbsActionsCreators";
import {ChooseActionPageComponent, ChooseActionPageLocationProps} from "../../components/ChooseAction/ChooseActionPage";
import {contribTouchstonesActionCreators} from "../contribTouchstonesActionCreators";
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
        return async (dispatch: Dispatch<ContribAppState>) => {
            await dispatch(chooseGroupPageActionCreators.loadData());
            dispatch(modellingGroupsActionCreators.setCurrentGroup(props.groupId));
            await dispatch(contribTouchstonesActionCreators.getTouchstonesByGroupId(props.groupId));
        }
    }

};