import {modellingGroupActions} from "../../shared/actions/ModellingGroupActions";
import {ModellingGroup, ModellingGroupDetails} from "../../shared/models/Generated";
import SourceModel = AltJS.SourceModel;
import {GroupSourceBase} from "../../shared/sources/ModellingGroupSource";
import {ILookup} from "../../shared/models/Lookup";
import {RemoteContent} from "../../shared/models/RemoteContent";

export interface GroupState extends RemoteContent {
    groups: ModellingGroup[];
    groupDetails: ILookup<ModellingGroupDetails>;
    currentGroupId: string;
}

export class ModellingGroupSource extends GroupSourceBase<GroupState> {

    fetchGroupDetails: () => SourceModel<ModellingGroupDetails>;

    constructor() {
        super();

        this.fetchGroupDetails = () => this.doFetch(s => `/modelling-groups/${s.currentGroupId}/`, {
            success: modellingGroupActions.updateGroupDetails,
            loading: modellingGroupActions.beginFetchDetails
        });
    }
}