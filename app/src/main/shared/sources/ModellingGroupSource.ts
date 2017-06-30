import { Source } from "./Source";
import { ModellingGroup } from "../models/Generated";
import SourceModel = AltJS.SourceModel;
import { modellingGroupActions } from "../actions/ModellingGroupActions";


export class GroupSourceBase<TState> extends Source<TState> {

    fetchGroups: () => SourceModel<ModellingGroup[]>;

    constructor() {
        super();
        this.fetchGroups = () => this.doFetch(_ => "/modelling-groups/", {
            success: modellingGroupActions.updateGroups,
            loading: modellingGroupActions.beginFetchGroups
        });
    }
}