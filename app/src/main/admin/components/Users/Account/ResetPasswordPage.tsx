import * as React from "react";
import { compose } from "recompose";
import * as queryString from "query-string";


import {MainMenuComponent} from "../../MainMenu/MainMenu";
import {PageArticle} from "../../../../shared/components/PageWithHeader/PageArticle";
import {PageBreadcrumb, PageProperties} from "../../../../shared/components/PageWithHeader/PageWithHeader";
import {AdminAppState} from "../../../reducers/adminAppReducers";
import {connect} from "react-redux";
import {Dispatch} from "redux";
import {resetPasswordPageActionCreators} from "../../../actions/pages/resetPasswordPageActionCreators";
import { ResetPasswordForm } from "./ResetPasswordForm";

export interface AdminResetPasswordPageQuery {
    token: string;
}

export interface AdminResetPasswordPageProps extends PageProperties<undefined, AdminResetPasswordPageQuery> {
    token: string;
}

export class AdminResetPasswordPageComponent extends React.Component<AdminResetPasswordPageProps> {
    static pageTitle:string = "Reset your password";

    componentDidMount(){
        this.props.onLoad(undefined, queryString.parse(this.props.location.search));
    }

    static breadcrumb() : PageBreadcrumb {
        return {
            name: AdminResetPasswordPageComponent.pageTitle,
            urlFragment: "set-password/",
            parent: MainMenuComponent.breadcrumb()
        }
    }

    render(): JSX.Element {
        return <PageArticle title={AdminResetPasswordPageComponent.pageTitle}>
            <ResetPasswordForm/>
        </PageArticle>;
    }
}

export const mapDispatchToProps = (dispatch: Dispatch<AdminAppState>): Partial<AdminResetPasswordPageProps> => {
    return {
        onLoad: (match: undefined, query: AdminResetPasswordPageQuery) => dispatch(resetPasswordPageActionCreators.onLoad(query))
    }
};

export const AdminResetPasswordPage = compose(
    connect(state => state, mapDispatchToProps)
)(AdminResetPasswordPageComponent) as React.ComponentClass<Partial<AdminResetPasswordPageProps>>;
