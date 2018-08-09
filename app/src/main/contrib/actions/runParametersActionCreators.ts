import {Dispatch} from "redux";

import {ContribAppState} from "../reducers/contribAppReducers";
import {RunParametersService} from "../services/RunParametersService";
import {
    RunParametersSetsFetched, RunParametersSetUploaded, RunParametersSetUploading, RunParametersTokenFetched,
    RunParametersTypes, RunParametersUploadError
} from "../actionTypes/RunParametersTypes";
import {ErrorInfo, ModelRunParameterSet, Result} from "../../shared/models/Generated";

export const runParametersActionCreators = {

    clearCacheForGetParameterSets(groupId: string, touchstoneId: string) {
        return async (dispatch: Dispatch<ContribAppState>, getState: () => ContribAppState) => {
            (new RunParametersService(dispatch, getState)).clearCacheForGetParameterSets(groupId, touchstoneId);
        }
    },

    getParameterSets(groupId: string, touchstoneId: string) {
        return async (dispatch: Dispatch<ContribAppState>, getState: () => ContribAppState) => {
            const sets: ModelRunParameterSet[] = await (new RunParametersService(dispatch, getState))
                .getParameterSets(groupId, touchstoneId);
            return dispatch({
                type: RunParametersTypes.RUN_PARAMETERS_SETS_FETCHED,
                data: sets
            } as RunParametersSetsFetched);
        }
    },

    getOneTimeToken(groupId: string, touchstoneId: string, setId: number) {
        return async (dispatch: Dispatch<ContribAppState>, getState: () => ContribAppState) => {
            const token: string = await (new RunParametersService(dispatch, getState)).getOneTimeToken(groupId, touchstoneId, setId);
            return dispatch({
                type: RunParametersTypes.RUN_PARAMETERS_TOKEN_FETCHED,
                data: {
                    id: setId,
                    token
                }
            } as RunParametersTokenFetched);
        }
    },

    refreshParameterSets() {
        return (dispatch: Dispatch<ContribAppState>, getState: () => ContribAppState) => {

            const group = getState().groups.currentUserGroup;
            const touchstone = getState().touchstones.currentTouchstoneVersion;

            dispatch(this.clearCacheForGetParameterSets(group.id, touchstone.id));
            dispatch(this.getParameterSets(group.id, touchstone.id))
        }
    },

    uploadSet(data: FormData) {
        return async (dispatch: Dispatch<ContribAppState>, getState: () => ContribAppState) => {

            const group = getState().groups.currentUserGroup;
            const touchstone = getState().touchstones.currentTouchstoneVersion;

            dispatch({
                type: RunParametersTypes.RUN_PARAMETERS_SET_UPLOADING,
                data: true
            } as RunParametersSetUploading);

            const result: Result = await (new RunParametersService(dispatch, getState))
                .uploadSet(group.id, touchstone.id, data);

            if (!result || result.errors) {
                dispatch({
                    type: RunParametersTypes.RUN_PARAMETERS_SET_UPLOAD_ERROR,
                    errors: result && result.errors ? result.errors : [{code: "error",
                        message: "Something went wrong while uploading run parameters"}]
                } as RunParametersUploadError);
            }
            else {
                dispatch(this.refreshParameterSets());
                dispatch({
                    type: RunParametersTypes.RUN_PARAMETERS_SET_UPLOADED,
                    data: true
                } as RunParametersSetUploaded);

            }
        }
    }

};
