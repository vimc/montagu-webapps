import alt from "../../shared/alt";
import * as AltJS from "alt";
import { AbstractStore } from "../../shared/stores/AbstractStore";
import { Disease, ModellingGroup } from "../../shared/models/Generated";
import { emptyLookup, getFromLookup, ILoadable, makeLookup } from "./Loadable";
import { diseaseActions } from "../actions/DiseaseActions";
import { RemoteContent } from "../../shared/models/RemoteContent";
import { DiseaseSource } from "../sources/DiseaseSource";
import { doNothing } from "../../shared/Helpers";
import StoreModel = AltJS.StoreModel;
import {modellingGroupActions} from "../../shared/actions/ModellingGroupActions";
import { GroupSourceBase } from "../../shared/sources/ModellingGroupSource";

export interface MainState extends RemoteContent {
    diseases: ILoadable<Disease>;
    modellingGroups: ILoadable<ModellingGroup>;
}

interface Interface extends AltJS.AltStore<MainState> {
    load(): void;

    getDiseaseById(id: string): Disease;
    getGroupById(id: string): ModellingGroup;

    fetchDiseases(): Promise<Disease[]>;
    fetchGroups(): Promise<ModellingGroup[]>;

    isLoading(): boolean;
}

export function initialMainState(): MainState {
    return {
        diseases: emptyLookup<Disease>(),
        modellingGroups: emptyLookup<ModellingGroup>(),
        ready: false
    };
}

class MainStore extends AbstractStore<MainState, Interface> {
    ready: boolean;
    diseases: ILoadable<Disease>;
    modellingGroups: ILoadable<ModellingGroup>;

    constructor() {
        super();
        this.bindListeners({
            handleDiseases: diseaseActions.update,
            handleModellingGroups: modellingGroupActions.updateGroups,
        });
        this.registerAsync(new DiseaseSource());
        this.registerAsync(new GroupSourceBase<MainState>());
        this.exportPublicMethods({
            getDiseaseById: id => getFromLookup(this.diseases, id),
            getGroupById: id => getFromLookup(this.modellingGroups, id),
            load: () => {
                this.getInstance().fetchDiseases().catch(doNothing);
                this.getInstance().fetchGroups().catch(doNothing);
            }
        })
    }

    initialState(): MainState {
        return initialMainState();
    }

    handleDiseases(diseases: Array<Disease>) {
        this.diseases = makeLookup(diseases);
        this.checkReadiness();
    }

    handleModellingGroups(groups: Array<ModellingGroup>) {
        this.modellingGroups = makeLookup(groups);
        this.checkReadiness();
    }

    checkReadiness(): void {
        const ready = this.diseases.loaded
            && this.modellingGroups.loaded;
        if (!this.ready && ready) {
            this.ready = true;
        }
    }
}

export const mainStore = alt.createStore<MainState>(MainStore as StoreModel<MainState>) as Interface;