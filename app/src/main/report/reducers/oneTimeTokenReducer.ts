import {OneTimeToken} from "../models/OneTimeToken";
import {ILookup} from "../../shared/models/Lookup";
import {OnetimeTokenAction, OnetimeTokenActionType} from "../actionTypes/OnetimeTokenActions";

export interface OneTimeTokenState {
    tokens: ILookup<OneTimeToken>;
}

export const onetimeTokensInitialState: OneTimeTokenState = {
    tokens: {}
};

export const onetimeTokenReducer = (state = onetimeTokensInitialState,
                                    action: OnetimeTokenAction): OneTimeTokenState => {
    switch (action.type) {
        case OnetimeTokenActionType.TOKEN_FETCHED: {
            const url = action.data.url;
            const token = action.data.token;
            const tokenLookup = {...state.tokens};
            tokenLookup[url] = token;
            return {
                ...state, tokens: tokenLookup
            }
        }
        default:
            return state;
    }
};