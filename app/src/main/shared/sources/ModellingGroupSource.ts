import { Source } from "./Source";
import { ModellingGroup, ModellingGroupDetails } from "../models/Generated";
import SourceModel = AltJS.SourceModel;
import { modellingGroupActions } from "../actions/ModellingGroupActions";
import {RemoteContent} from "../models/RemoteContent";
import {ILookup} from "../models/Lookup";

export class ModellingGroupSource extends Source<GroupState> {
    fetchGroups: () => SourceModel<ModellingGroup[]>;
    fetchGroupDetails: () => SourceModel<ModellingGroupDetails>;

    constructor() {
        super();
        this.fetchGroups = () => this.doFetch(_ => "/modelling-groups/", {
            success: modellingGroupActions.updateGroups,
            loading: modellingGroupActions.beginFetchGroups
        });
        this.fetchGroupDetails = () => this.doFetch(s => `/modelling-groups/${s.currentGroupId}/`, {
            success: modellingGroupActions.updateGroupDetails,
            loading: modellingGroupActions.beginFetchDetails
        });
    }
}


export interface GroupState extends RemoteContent {
    groups: ModellingGroup[];
    groupDetails: ILookup<ModellingGroupDetails>;
    currentGroupId: string;
}