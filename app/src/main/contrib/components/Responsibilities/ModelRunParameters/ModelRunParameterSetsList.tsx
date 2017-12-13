import {ModelRunParameterSet} from "../../../../shared/models/Generated";
import {runParametersStore} from "../../../stores/RunParametersStore";
import {RemoteContent} from "../../../../shared/models/RemoteContent";
import {RemoteContentComponent} from "../../../../shared/components/RemoteContentComponent/RemoteContentComponent";
import {connectToStores} from "../../../../shared/alt";
import * as React from "react";

interface Props extends RemoteContent {
    sets: ModelRunParameterSet[];
}

export class ModelRunParameterSetsListComponent extends RemoteContentComponent<Props, undefined> {
    static getStores() {
        return runParametersStore;
    }

    static getPropsFromStores(props: Props) {
        const s = runParametersStore.getState();
        return {
            sets: s.parameterSets,
            ready: s.parameterSets != null
        }
    }

    renderContent(props: Props): JSX.Element {
        const items = props.sets.map(set => <div>
            {set.id}
            {set.description}
            {set.model}
            {set.uploaded_by}
            {set.uploaded_on}
        </div>);
        return <div>{items}</div>;
    }
}

export const ModelRunParameterSetsList = connectToStores(ModelRunParameterSetsListComponent);
