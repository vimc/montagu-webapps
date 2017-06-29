import * as React from "react";
import { InternalLink } from "../../../../shared/components/InternalLink";
import {User} from "../../../../shared/models/Generated";

export class UserListItem extends React.Component<User, undefined> {
    render() {
        const url = `/users/${ this.props.username }/`;
        return <tr>
                    <td><InternalLink href={ url }>{ this.props.username}
                        </InternalLink>
                    </td>
                    <td>{ this.props.name }</td>
                    <td>{ this.props.email }</td>
                    <td>{ this.props.last_logged_in || "never" }</td>
                </tr>;
    }
}