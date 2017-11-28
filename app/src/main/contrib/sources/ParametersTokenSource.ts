import SourceModel = AltJS.SourceModel;
import {settings} from "../../shared/Settings";
import {modelParameterActions} from "../actions/ModelParameterActions";
import {ResponsibilityState} from "../stores/ResponsibilityStore";
import {Source} from "../../shared/sources/Source";

export class ModelParametersTokenSource extends Source<ResponsibilityState> {

    _fetchOneTimeParametersToken: () => SourceModel<string>;

    constructor() {
        super();
        this._fetchOneTimeParametersToken = () => this.doFetch(state => {
            let queryString = "";
            if (state.redirectPath && state.redirectPath.length > 0) {
                queryString = "?redirectUrl=" + encodeURI(settings.montaguUrl() + state.redirectPath);
            }
            return `/modelling-groups/${state.currentModellingGroup.id}/model-run-parameters/`
                + `${state.currentTouchstone.id}/${state.currentDiseaseId}/get_onetime_link/${queryString}`;
        }, {
            success: modelParameterActions.update,
            loading: modelParameterActions.beginFetch,
            isCached: () => false   // Always get a fresh token
        });
    }
}