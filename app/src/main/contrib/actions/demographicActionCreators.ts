import { Dispatch } from "redux";

import {ContribAppState} from "../reducers/contribAppReducers";
import {DemographicService} from "../services/DemographicService";
import {Demographic, DemographicTypes} from "../actionTypes/DemographicTypes";
import {DemographicDataset} from "../../shared/models/Generated";

export const demographicActionCreators = {

    getDataSets(touchstoneId: string) {
        return async (dispatch: Dispatch<ContribAppState>, getState: () => ContribAppState) => {
            const dataSets: DemographicDataset[] = await (new DemographicService(dispatch, getState))
                .getDataSetsByTouchstoneId(touchstoneId);
            return dispatch({
                type: DemographicTypes.DEMOGRAPHIC_DATA_SETS_FETCHED,
                data: dataSets
            } as Demographic.DataSetsFetched );
        }
    },

    setDataSet(dataSetId: string) {
        return (dispatch: Dispatch<ContribAppState>, getState: () => ContribAppState) => {
            const dataSets = getState().demographic.dataSets;
            const dataSet = dataSets.find((set: DemographicDataset) => set.id === dataSetId);
            return dispatch({
                type: DemographicTypes.DEMOGRAPHIC_SET_DATA_SET,
                data: dataSet
            } as Demographic.SetDataSet );
        }
    },

    setGender(gender: string) {
        return {
            type: DemographicTypes.DEMOGRAPHIC_SET_GENDER,
            data: gender
        } as Demographic.SetGender;
    },

    setFormat(format: string) {
        return {
            type: DemographicTypes.DEMOGRAPHIC_SET_FORMAT,
            data: format
        } as Demographic.SetFormat;
    },

    getOneTimeToken() {
        return async (dispatch: Dispatch<ContribAppState>, getState: () => ContribAppState) => {
            dispatch({
                type: DemographicTypes.DEMOGRAPHIC_ONE_TIME_TOKEN_CLEAR,
            } as Demographic.OneTimeTokenClear );

            const demographicState = getState().demographic;

            const dataSet = demographicState.selectedDataSet;
            const touchstone = getState().touchstones.currentTouchstone;
            const format = demographicState.selectedFormat;

            const gender = dataSet.gender_is_applicable ? demographicState.selectedGender : 'both';

            if (!dataSet || !touchstone || !format ) {
                return dispatch({
                    type: DemographicTypes.DEMOGRAPHIC_ONE_TIME_TOKEN_CLEAR,
                } as Demographic.OneTimeTokenClear);
            }

            const token: string = await (new DemographicService(dispatch, getState))
                .getOneTimeToken(touchstone.id, dataSet.source, dataSet.id, format, gender);

            return dispatch({
                type: DemographicTypes.DEMOGRAPHIC_ONE_TIME_TOKEN_FETCHED,
                data: token
            } as Demographic.OneTimeTokenFetched );
        }
    },
};
