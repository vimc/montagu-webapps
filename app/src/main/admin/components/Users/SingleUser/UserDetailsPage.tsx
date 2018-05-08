import * as React from "react";
import { compose} from "recompose";
import { connect } from 'react-redux';
import { Dispatch } from "redux";

import { PageArticle } from "../../../../shared/components/PageWithHeader/PageArticle";
import {PageBreadcrumb, PageProperties} from "../../../../shared/components/PageWithHeader/PageWithHeader";
import {AdminAppState} from "../../../reducers/adminAppReducers";
import {UsersListPageComponent} from "../List/UsersListPage";
import {userDetailsPageActionCreators} from "../../../actions/pages/userDetailsPageActionCreators";

export interface UserDetailsPageLocationProps {
    username: string;
};

export interface UserDetailsPageProps extends PageProperties<UserDetailsPageLocationProps> {
    currentUserName: string;
};

export class UserDetailsPageComponent extends React.Component<UserDetailsPageProps> {
    componentDidMount() {
        this.props.onLoad(this.props.match.params)
    }

    static breadcrumb(state: AdminAppState): PageBreadcrumb {
        return {
            name: state.users.currentUser.username,
            urlFragment: `${state.users.currentUser.username}/`,
            parent: UsersListPageComponent.breadcrumb()
        }
    }

    render() :JSX.Element {
        return <PageArticle title={this.props.currentUserName}>
            {/*<ModellingGroupDetailsContent />*/}
        </PageArticle>;
    }
}

const mapStateToProps = (state: AdminAppState) :Partial<UserDetailsPageProps> => {
    return {
        currentUserName: state.users.currentUser ? state.users.currentUser.name : ''
    }
};

export const mapDispatchToProps = (dispatch: Dispatch<AdminAppState>): Partial<UserDetailsPageProps> => {
    return {
        onLoad: (params: UserDetailsPageLocationProps) => dispatch(userDetailsPageActionCreators.onLoad(params))
    }
};

export const UserDetailsPage = compose(
    connect(mapStateToProps, mapDispatchToProps),
)(UserDetailsPageComponent) as React.ComponentClass<Partial<UserDetailsPageProps>>;








/*

import * as React from "react";
import { connectToStores } from "../../../../shared/alt";
import { AdminPageWithHeader } from "../../AdminPageWithHeader";
import {UserTitle, UserTitleProps} from "./UserTitle";
import {UserDetailsContent} from "./UserDetailsContent";
import {userActions} from "../../../actions/UserActions";
import {userStore} from "../../../stores/UserStore";
import {IPageWithParent} from "../../../../shared/models/Breadcrumb";
import {UsersListPage} from "../List/ViewAllUsersPage";
import { Page } from "../../../../shared/components/PageWithHeader/Page";

export interface UserDetailsPageProps {
    username: string;
}

export class ViewUserDetailsPage extends AdminPageWithHeader<UserDetailsPageProps> {
    load(props: UserDetailsPageProps) {
        return this.loadParent(props).then(() => {
            userActions.setCurrentUser(props.username);
        });
    }

    name(): string {
        const s = userStore.getState();
        return s.currentUsername;
    }

    title(): JSX.Element {
        return <Title />;
    }

    urlFragment(): string {
        const s = userStore.getState();
        return `${s.currentUsername}/`;
    }

    parent(): IPageWithParent {
        return new UsersListPage();
    }

    render(): JSX.Element {
        return <Page page={this}>
            <UserDetailsContent />
        </Page>;
    }
}
*/

// const Title = connectToStores(class extends UserTitle {
//     renderContent(props: UserTitleProps) {
//         return <h1>{ props.user.name }</h1>;
//     }
// });

