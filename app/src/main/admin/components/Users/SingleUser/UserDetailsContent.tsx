import * as React from "react";
import { connect } from 'react-redux';
import { compose, branch, renderComponent} from "recompose";

import { User } from "../../../../shared/models/Generated";
import { UserRole } from "./UserRoleComponent";
import { AddRoles } from "./AddRoles";
import {AdminAppState} from "../../../reducers/adminAppReducers";
import {LoadingElement} from "../../../../shared/partials/LoadingElement/LoadingElement";

export interface UserDetailsRolesProps  {
    user: User;
    isAdmin: boolean;
}
export const UserDetailsRoles: React.SFC<UserDetailsRolesProps> = (props: UserDetailsRolesProps) => {

    const addRoles = props.isAdmin ?
        <AddRoles userRoles={props.user.roles.filter(r => r.scope_prefix == null).map(r => r.name)}
                  username={props.user.username}/>
        : "";

    return <div className="mt-4">
        <h3>Manage roles</h3>
        <form className="form">
            <hr className={"dashed"}/>
            {props.user.roles.map(r =>
                <UserRole
                    key={r.name + r.scope_prefix + r.scope_id}
                    {...r}
                    username={props.user.username}
                    showdelete={props.isAdmin}
                />
            )}
        </form>
        {addRoles}
    </div>;
}


export interface UserDetailsContentProps  {
    user: User;
    isAdmin: boolean;
}
export const UserDetailsContentComponent: React.SFC<UserDetailsContentProps> = (props: UserDetailsContentProps) => {
    return <div className="col-xs-12 col-lg-8">
        <table className="specialColumn">
            <tbody>
            <tr>
                <td>Username</td>
                <td>{props.user.username}</td>
            </tr>
            <tr>
                <td>Email</td>
                <td>{props.user.email}</td>
            </tr>
            <tr>
                <td>Last logged in</td>
                <td>{props.user.last_logged_in || "never"}</td>
            </tr>
            </tbody>
        </table>
        <div>
            <UserDetailsRoles user={props.user} isAdmin={props.isAdmin}/>
        </div>
    </div>;
}

export const mapStateToProps = (state: AdminAppState) :Partial<UserDetailsContentProps> => {
    return {
        isAdmin: state.auth.permissions.indexOf("*/roles.write") > -1,
        user: state.users.currentUser,
    }
};

export const UserDetailsContent = compose(
    connect(mapStateToProps),
    branch((props: UserDetailsContentProps) => !props.user, renderComponent(LoadingElement))
)(UserDetailsContentComponent);