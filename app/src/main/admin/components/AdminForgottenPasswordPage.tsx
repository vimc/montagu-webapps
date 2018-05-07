import * as React from "react";
import { compose } from "recompose";

import {ForgottenPasswordForm} from "../../shared/components/Login/ForgottenPasswordForm";
import {MainMenuComponent} from "./MainMenu/MainMenu";
import {PageArticle} from "../../shared/components/PageWithHeader/PageArticle";
import {PageBreadcrumb, PageProperties} from "../../shared/components/PageWithHeader/PageWithHeader";
import {BreadcrumbInitializer} from "../../shared/components/Breadcrumbs/BreadcrumbsInitializer";

const pageTitle = "Forgotten your password?";

export class AdminForgottenPasswordPageComponent extends React.Component<PageProperties<undefined>> {
    componentDidMount(){
        this.props.createBreadcrumbs(AdminForgottenPasswordPageComponent.breadcrumb());
    }

    static breadcrumb() : PageBreadcrumb {
        return {
            name: pageTitle,
            urlFragment: "forgotten-password/",
            parent: MainMenuComponent.breadcrumb()
        }
    }

    render(): JSX.Element {
        return <PageArticle title={pageTitle}>
            <ForgottenPasswordForm />
        </PageArticle>;
    }
}

export const AdminForgottenPasswordPage = compose(BreadcrumbInitializer)(AdminForgottenPasswordPageComponent) as
    React.ComponentClass<Partial<PageProperties<undefined>>>;
