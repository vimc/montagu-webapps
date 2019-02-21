import {ILookup} from "../../shared/models/Lookup";
import {DataPoint} from "../reducers/estimatesReducer";
import SetChartType = Estimates.SetChartType;
import UploadTokenFetched = Estimates.UploadTokenFetched;
import {BurdenEstimateSetStatus, ErrorInfo} from "../../shared/models/Generated";
import EstimateSetPopulated = Estimates.EstimateSetPopulated;
import ResetPopulateState = Estimates.ResetPopulateState;

export enum EstimateTypes {
    UPLOAD_TOKEN_FETCHED,
    BURDEN_ESTIMATES_FETCHED,
    ESTIMATE_SET_POPULATED,
    SET_CHART_TYPE,
    RESET_POPULATE_STATE
}

export enum BurdenOutcome {
    DEATHS = "deaths",
    CASES = "cases",
    DALYS = "dalys"
}

export namespace Estimates {

    export interface BurdenEstimatesFetched {
        type: EstimateTypes.BURDEN_ESTIMATES_FETCHED;
        data: { setId: number, burdens: ILookup<DataPoint[]>, type: BurdenOutcome }
    }

    export interface SetChartType {
        type: EstimateTypes.SET_CHART_TYPE;
        data: BurdenOutcome
    }

    export interface UploadTokenFetched {
        type: EstimateTypes.UPLOAD_TOKEN_FETCHED,
        data: string
    }

    export interface EstimateSetPopulated {
        type: EstimateTypes.ESTIMATE_SET_POPULATED,
        data: { setStatus: BurdenEstimateSetStatus, errors: ErrorInfo[] }
    }

    export interface ResetPopulateState {
        type: EstimateTypes.RESET_POPULATE_STATE,
        data: boolean
    }
}

export type EstimatesAction =
    | Estimates.BurdenEstimatesFetched
    | SetChartType
    | UploadTokenFetched
    | EstimateSetPopulated
    | ResetPopulateState
