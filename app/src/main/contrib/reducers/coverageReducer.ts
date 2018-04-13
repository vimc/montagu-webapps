import {CoverageAction, CoverageTypes} from "../actionTypes/CoverageTypes";
import {CoverageSet} from "../../shared/models/Generated";

export interface CoverageState {
    dataSets: CoverageSet[];
    selectedFormat: string;
    token: string;
}

export const coverageInitialState: CoverageState = {
    dataSets: null,
    selectedFormat: "long",
    token: null
};

export const coverageReducer = (state = coverageInitialState, action: CoverageAction) => {
    switch (action.type) {
        case CoverageTypes.COVERAGE_DATA_SETS_FETCHED:
            return {...state, dataSets: action.data };
        case CoverageTypes.COVERAGE_SET_FORMAT:
            return {...state, selectedFormat: action.data };
        case CoverageTypes.COVERAGE_ONE_TIME_TOKEN_FETCHED:
            return {...state, token: action.data };
        case CoverageTypes.COVERAGE_ONE_TIME_TOKEN_CLEAR:
            return {...state, token: null };
        default:
            return state;
    }
};

