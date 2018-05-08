import * as React from "react";
import {compose} from "recompose";
import { connect } from 'react-redux';
import {orderBy} from "lodash";

import {User} from "../../../../shared/models/Generated";

import {AdminAppState} from "../../../reducers/adminAppReducers";
import {isNonEmptyArray} from "../../../../shared/Helpers";
import {UserListItem} from "./UserListItem";

interface UsersListProps {
    users: User[]
}

export const UsersListComponent: React.SFC<UsersListProps> = (props: UsersListProps) => {
    return <table>
        <thead>
        <tr>
            <th>Username</th>
            <th>Name</th>
            <th>Email</th>
            <th>Last logged in</th>
        </tr>
        </thead>
        <tbody>
        {props.users.map(g => <UserListItem key={ g.username } {...g} />) }
        </tbody>
    </table>;
};

// TODO: move to reselect later if logic will get more complicated
export const sortUsers = (users: User[]): User[] => {
    if (!isNonEmptyArray(users)) {
        return [];
    }
    return orderBy(users, ['username'], ['asc']);
}

export const mapStateToProps = (state: AdminAppState): UsersListProps => {
    return {
        users: sortUsers(state.users.users)
    }
};

export const UsersList = compose(
    connect(mapStateToProps)
)(UsersListComponent) as React.ComponentClass<Partial<UsersListProps>>;
