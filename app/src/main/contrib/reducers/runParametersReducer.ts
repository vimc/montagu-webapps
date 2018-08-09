import {ErrorInfo, ModelRunParameterSet} from "../../shared/models/Generated";
import {
    RunParametersAction, RunParametersTypes
} from "../actionTypes/RunParametersTypes";

export interface TokensMap {
    [setId: string]: string;
}

export interface RunParametersState {
    sets: ModelRunParameterSet[];
    tokens: TokensMap,
    errors: ErrorInfo[];
    uploading: boolean;
    success: boolean;
}

export const runParametersInitialState: RunParametersState = {
    sets: [],
    tokens: {},
    errors: [],
    uploading: false,
    success: false
};

export const runParametersReducer = (state = runParametersInitialState, action: RunParametersAction): RunParametersState => {
    switch (action.type) {
        case RunParametersTypes.RUN_PARAMETERS_SETS_FETCHED:
            return {...state, sets: action.data ? action.data : [] };
        case RunParametersTypes.RUN_PARAMETERS_TOKEN_FETCHED:
            return { ...state,  tokens: {...state.tokens, ...{[action.data.id]: action.data.token}}};
        case RunParametersTypes.RUN_PARAMETERS_SET_UPLOADING:
            return {...state, uploading: true };
        case RunParametersTypes.RUN_PARAMETERS_SET_UPLOADED:
            return {...state, success: true, uploading: false };
        case RunParametersTypes.RUN_PARAMETERS_SET_UPLOAD_ERROR:
            return {...state, errors: action.errors, uploading: false };
        default:
            return state;
    }
};

