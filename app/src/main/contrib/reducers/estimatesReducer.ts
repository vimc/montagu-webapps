import {EstimatesAction, EstimateTypes} from "../actionTypes/EstimateTypes";

export interface EstimatesState {
    deaths: any[];
}

export const estimatesInitialState: EstimatesState = {
    deaths: []
};

export const estimatesReducer = (state = estimatesInitialState, action: EstimatesAction) => {
    switch (action.type) {
        case EstimateTypes.DEATHS_FETCHED:
            return {...state, deaths: action.data };
        default:
            return state;
    }
};
