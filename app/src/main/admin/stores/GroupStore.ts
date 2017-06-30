import * as AltJS from "alt";
import { ModellingGroup, ModellingGroupDetails } from "../../shared/models/Generated";
import { alt } from "../../shared/alt";
import { AbstractStore } from "../../shared/stores/AbstractStore";
import { modellingGroupActions } from "../../shared/actions/ModellingGroupActions";
import { ILookup } from "../../shared/models/Lookup";
import StoreModel = AltJS.StoreModel;
import {GroupState, ModellingGroupSource} from "../sources/ModellingGroupSource";

interface Interface extends AltJS.AltStore<GroupState> {
    fetchGroups(): Promise<ModellingGroup[]>;
    fetchGroupDetails(): Promise<ModellingGroupDetails>;
    getCurrentGroupDetails(): ModellingGroupDetails;
}

export class GroupStore extends AbstractStore<GroupState, Interface> {
    groups: ModellingGroup[];
    groupDetails: ILookup<ModellingGroupDetails>;
    currentGroupId: string;
    ready: boolean;

    constructor() {
        super();
        this.bindListeners({
            handleBeginFetchGroups: modellingGroupActions.beginFetchGroups,
            handleUpdateGroups: modellingGroupActions.updateGroups,

            handleSetCurrentGroup: modellingGroupActions.setCurrentGroup,

            handleBeginFetchDetails: modellingGroupActions.beginFetchDetails,
            handleUpdateGroupDetails: modellingGroupActions.updateGroupDetails,
        });
        this.registerAsync(new ModellingGroupSource());
        this.exportPublicMethods({
            getCurrentGroupDetails: () => {
                if (this.currentGroupId && this.groupDetails.hasOwnProperty(this.currentGroupId)) {
                    return this.groupDetails[this.currentGroupId]
                } else {
                    return null;
                }
            }
        })
    }

    initialState(): GroupState {
        return {
            groups: [],
            groupDetails: {},
            currentGroupId: null,
            ready: false
        };
    }

    handleBeginFetchGroups() {
        this.ready = false;
        this.groups = [];
    }
    handleUpdateGroups(groups: ModellingGroup[]) {
        this.ready = true;
        this.groups = groups;
    }
    handleSetCurrentGroup(groupId: string) {
        this.currentGroupId = groupId;
    }
    handleBeginFetchDetails(groupId: string) {
        this.ready = false;
        delete this.groupDetails[groupId];
    }
    handleUpdateGroupDetails(details: ModellingGroupDetails) {
        this.ready = true;
        this.groupDetails[details.id] = details;
    }
}

export const groupStore = alt.createStore<GroupState>(GroupStore as StoreModel<GroupState>) as Interface;
