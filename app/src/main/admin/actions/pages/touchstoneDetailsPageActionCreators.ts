import {Dispatch} from "redux";
import {AdminAppState} from "../../reducers/adminAppReducers";
import {TouchstoneDetailsPageLocationProps} from "../../components/Touchstones/Details/TouchstoneDetailsPage";
import {touchstonesActionCreators} from "../../../shared/actions/touchstoneActionCreators";
import {AdminPageActionCreators} from "./AdminPageActionCreators";
import {PageBreadcrumb} from "../../../shared/components/PageWithHeader/PageProperties";
import {touchstoneListPageActionCreators} from "./TouchstoneListPageActionCreators";

export class TouchstoneDetailsPageActionCreators extends AdminPageActionCreators<{}> {

    parent = touchstoneListPageActionCreators;

    title(state: AdminAppState): string {
        return state.touchstones.currentTouchstone ? state.touchstones.currentTouchstone.description : ""
    }

    createBreadcrumb(state?: AdminAppState): PageBreadcrumb {
        return {
            name: state.touchstones.currentTouchstone.id,
            urlFragment: `${state.touchstones.currentTouchstone.id}/`
        };
    }

    loadData(params: TouchstoneDetailsPageLocationProps) {
        return async (dispatch: Dispatch<AdminAppState>, getState: () => AdminAppState) => {
            dispatch(touchstonesActionCreators.setCurrentTouchstone(
                params.touchstoneId,
                getState().touchstones.touchstones
            ));
        }
    }
}

export const touchstoneDetailsPageActionCreators = new TouchstoneDetailsPageActionCreators();