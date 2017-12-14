import SourceModel = AltJS.SourceModel;
import {modelParameterActions} from "../actions/RunParameterActions";
import {Source} from "../../shared/sources/Source";
import {ModelRunParameterSet} from "../../shared/models/Generated";
import {RunParametersState} from "../stores/RunParametersStore";

export class RunParametersSource extends Source<RunParametersState> {
    _fetchOneTimeParametersToken: () => SourceModel<string>;
    fetchParameterSets: () => SourceModel<ModelRunParameterSet[]>;

    constructor() {
        super();
        this._fetchOneTimeParametersToken = () => this.doFetch(state => {
                let queryString = this.buildQueryStringWithRedirectUrl(state.redirectPath);
                return `/modelling-groups/${state.groupId}/model-run-parameters/`
                    + `${state.touchstoneId}/get_onetime_link/${queryString}`;
            },
            {
                success: modelParameterActions.receiveToken,
                loading: modelParameterActions.beginFetchToken,
                isCached: () => false   // Always get a fresh token
            }
        );
        this.fetchParameterSets = () => this.doFetch(
            s => `/modelling-groups/${s.groupId}/model-run-parameters/${s.touchstoneId}/`,
            {
                success: modelParameterActions.updateParameterSets,
                loading: modelParameterActions.beginFetchParameterSets,
                isCached: s => s.parameterSets != null
            }
        );
    }
}
