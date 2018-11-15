import {EstimatesAction, EstimateTypes} from "../actionTypes/EstimateTypes";
import {ILookup} from "../../shared/models/Lookup";
import {DataPoint} from "../components/Responsibilities/BurdenEstimates/ChartPrototypingPage";

export interface EstimatesState {
    deaths: ILookup<DataPoint[]>;
}

export const estimatesInitialState: EstimatesState = {
    deaths: null
};

export const estimatesReducer = (state = estimatesInitialState, action: EstimatesAction) => {
    switch (action.type) {
        case EstimateTypes.DEATHS_FETCHED:
            return {...state, deaths: action.data };
        default:
            return state;
    }
};
