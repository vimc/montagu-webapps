import * as React from "react";
import {InternalLink} from "../../../../shared/components/InternalLink";
import {Touchstone, User} from "../../../../shared/models/Generated";

export class TouchstoneListItem extends React.Component<Touchstone, undefined> {
    render() {
        // The API is guaranteed to return version in descending order
        const latestVersion = this.props.versions[0];
        return <tr>
            <td>{this.props.id}</td>
            <td>{this.props.description}</td>
            <td>{this.props.comment}</td>
            <td>{latestVersion.id}</td>
        </tr>;
    }
}