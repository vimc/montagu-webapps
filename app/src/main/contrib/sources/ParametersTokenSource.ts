import {CoverageSource} from "./CoverageSource";
import SourceModel = AltJS.SourceModel;
import {estimateTokenActions} from "../actions/EstimateActions";
import {settings} from "../../shared/Settings";
import {modelParameterActions} from "../actions/ModelParameterActions";

export class ModelParametersTokenSource extends CoverageSource {
    _fetchOneTimeParametersToken: () => SourceModel<string>;

    constructor() {
        super();
        this._fetchOneTimeParametersToken = () => this.doFetch(state => {
            let queryString = "";
            if (state.redirectPath && state.redirectPath.length > 0) {
                queryString = "?redirectUrl=" + encodeURI(settings.montaguUrl() + state.redirectPath);
            }
            return this.baseURL(state) + `/estimate-sets/model-run-parameters/${queryString}`;
        }, {
            success: modelParameterActions.update,
            loading: modelParameterActions.beginFetch,
            isCached: () => false   // Always get a fresh token
        });
    }
}
