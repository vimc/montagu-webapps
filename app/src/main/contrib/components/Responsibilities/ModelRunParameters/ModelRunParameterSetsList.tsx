import {ModelRunParameterSet, Touchstone} from "../../../../shared/models/Generated";
import {runParametersStore} from "../../../stores/RunParametersStore";
import {RemoteContent} from "../../../../shared/models/RemoteContent";
import {RemoteContentComponent} from "../../../../shared/components/RemoteContentComponent/RemoteContentComponent";
import {connectToStores} from "../../../../shared/alt";
import * as React from "react";
import {longTimestamp} from "../../../../shared/Helpers";
import {responsibilityStore} from "../../../stores/ResponsibilityStore";

interface Props {
    sets: ModelRunParameterSet[];
    touchstone: Touchstone;
}

export class ModelRunParameterSetsList extends React.Component<Props, undefined> {

    render(): JSX.Element {
        if (this.props.sets && this.props.sets.length > 0) {
            const items = this.props.sets.map((set, i) => <tr key={i}>
                <td>{set.uploaded_by}</td>
                <td>{longTimestamp(new Date(set.uploaded_on))}</td>
            </tr>);
            return <table>
                <thead>
                <tr>
                    <th scope="col">Uploaded by</th>
                    <th scope="col">Uploaded on</th>
                </tr>
                </thead>
                <tbody>
                {items}
                </tbody>
            </table>;
        } else {
            return <span>No parameter sets have been uploaded for this touchstone</span>;
        }
    }
}
