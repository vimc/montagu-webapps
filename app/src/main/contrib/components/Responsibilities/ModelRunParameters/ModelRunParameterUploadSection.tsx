import {RemoteContentComponent} from "../../../../shared/components/RemoteContentComponent/RemoteContentComponent";
import {RemoteContent} from "../../../../shared/models/RemoteContent";
import {ModellingGroup, ModelRunParameterSet, Touchstone} from "../../../../shared/models/Generated";
import {responsibilityStore} from "../../../stores/ResponsibilityStore";
import {runParametersStore} from "../../../stores/RunParametersStore";
import {connectToStores} from "../../../../shared/alt";
import * as React from "react";
import {ModelRunParameterSection} from "./ModelRunParameterSection";

export interface Props extends RemoteContent {
    touchstone: Touchstone;
    group: ModellingGroup;
    parametersToken: string;
    diseases: string[];
    sets: ModelRunParameterSet[];
}

export class ModelRunParameterUploadSectionComponent
    extends RemoteContentComponent<Props, undefined> {


    static getStores() {
        return [responsibilityStore, runParametersStore];
    }

    static getPropsFromStores(): Props {
        const state = responsibilityStore.getState();
        const runParameterState = runParametersStore.getState();

        if (runParameterState.oneTimeToken != null) {
            return {
                ready: state.ready,
                touchstone: state.currentTouchstone,
                group: state.currentModellingGroup,
                parametersToken: runParameterState.oneTimeToken,
                sets: runParameterState.parameterSets,
                diseases: Array.from(new Set([].concat.apply([],
                    state.responsibilitySets.map(set => set.responsibilities.map(r => r.scenario.disease)))))
            };
        } else {
            return {
                ready: false,
                touchstone: null,
                group: null,
                parametersToken: null,
                diseases: [],
                sets: []
            };
        }
    }

    renderContent(props: Props): JSX.Element {
        this.props.diseases.push("Hib");
        return <div>
            {
                this.props.diseases.map(d => <ModelRunParameterSection key={d}
                    disease={d} sets={props.sets.filter(set => set.disease == d)} parametersToken={props.parametersToken}/>)
            }
        </div>;
    }
}

export const ModelRunParameterUploadSection = connectToStores(ModelRunParameterUploadSectionComponent);