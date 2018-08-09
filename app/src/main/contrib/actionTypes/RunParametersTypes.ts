import {ErrorInfo, ModelRunParameterSet} from "../../shared/models/Generated";

export interface RunParametersTokenData {
    id: number,
    token: string
}

export enum RunParametersTypes {
    RUN_PARAMETERS_SETS_FETCHED = "RUN_PARAMETERS_SETS_FETCHED",
    RUN_PARAMETERS_TOKEN_FETCHED = "RUN_PARAMETERS_TOKEN_FETCHED",
    RUN_PARAMETERS_SET_UPLOADING = "RUN_PARAMETERS_SET_UPLOADING",
    RUN_PARAMETERS_SET_UPLOAD_ERROR = "RUN_PARAMETERS_UPLOAD_ERROR",
    RUN_PARAMETERS_SET_UPLOADED = "RUN_PARAMETERS_SET_UPLOADED"
}

export interface RunParametersSetsFetched {
    type: RunParametersTypes.RUN_PARAMETERS_SETS_FETCHED;
    data: ModelRunParameterSet[];
}

export interface RunParametersTokenFetched {
    type: RunParametersTypes.RUN_PARAMETERS_TOKEN_FETCHED;
    data: RunParametersTokenData;
}

export interface RunParametersSetUploading {
    type: RunParametersTypes.RUN_PARAMETERS_SET_UPLOADING;
    data: boolean
}

export interface RunParametersSetUploaded {
    type: RunParametersTypes.RUN_PARAMETERS_SET_UPLOADED;
    data: boolean
}

export interface RunParametersUploadError {
    type: RunParametersTypes.RUN_PARAMETERS_SET_UPLOAD_ERROR;
    errors: ErrorInfo[]
}

export type RunParametersAction =
    | RunParametersSetsFetched
    | RunParametersTokenFetched
    | RunParametersSetUploading
    | RunParametersUploadError
    | RunParametersSetUploaded
