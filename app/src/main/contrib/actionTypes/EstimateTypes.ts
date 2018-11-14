export enum EstimateTypes {
    DEATHS_FETCHED = "COVERAGE_DATA_SETS_FETCHED"
}

export namespace Estimates {

    export interface DeathsFetched {
        type: EstimateTypes.DEATHS_FETCHED;
        data: any[];
    }

}

export type EstimatesAction =
    | Estimates.DeathsFetched
