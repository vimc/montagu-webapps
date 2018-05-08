import * as React from "react";
import { compose } from "recompose";
import { connect } from 'react-redux';
import { Dispatch } from "redux";

import {PageBreadcrumb, PageProperties} from "../../../../shared/components/PageWithHeader/PageWithHeader";
import {PageArticle} from "../../../../shared/components/PageWithHeader/PageArticle";
import {AdminAppState} from "../../../reducers/adminAppReducers";
import {MainMenuComponent} from "../../MainMenu/MainMenu";
import {usersListPageActionCreators} from "../../../actions/pages/usersListPageActionCreators";
// import {CreateUserSection} from "../Create/CreateUserSection";
import {UsersList} from "./UsersList";

export class UsersListPageComponent extends React.Component<PageProperties<undefined>> {
    static title: string = "Users";

    componentDidMount(){
        this.props.onLoad()
    }

    static breadcrumb() : PageBreadcrumb {
        return {
            name: UsersListPageComponent.title,
            urlFragment: "users/",
            parent: MainMenuComponent.breadcrumb()
        }
    }

    render() :JSX.Element {
        return <PageArticle title={UsersListPageComponent.title}>
            {/*<CreateUserSection/>*/}
            <div className="sectionTitle">All users</div>
            <UsersList/>
        </PageArticle>;
    }
}

export const mapDispatchToProps = (dispatch: Dispatch<AdminAppState>): Partial<PageProperties<undefined>> => {
    return {
        onLoad: () => dispatch(usersListPageActionCreators.onLoad())
    }
};

export const UsersListPage = compose(
    connect(state => state, mapDispatchToProps)
)(UsersListPageComponent) as React.ComponentClass<Partial<PageProperties<undefined>>>;
