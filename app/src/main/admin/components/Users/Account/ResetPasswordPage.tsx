import * as React from "react";
import { compose } from "recompose";

import {MainMenuComponent} from "../../MainMenu/MainMenu";
import {PageArticle} from "../../../../shared/components/PageWithHeader/PageArticle";
import {PageBreadcrumb, PageProperties} from "../../../../shared/components/PageWithHeader/PageWithHeader";
import {BreadcrumbInitializer} from "../../../../shared/components/Breadcrumbs/BreadcrumbsInitializer";
import { ResetPasswordForm } from "./ResetPasswordForm";

export class AdminResetPasswordPageComponent extends React.Component<PageProperties<undefined>> {
    static pageTitle:string = "Reset your password";

    componentDidMount(){
        this.props.createBreadcrumbs(AdminResetPasswordPageComponent.breadcrumb());
    }

    static breadcrumb() : PageBreadcrumb {
        return {
            name: AdminResetPasswordPageComponent.pageTitle,
            urlFragment: "forgotten-password/",
            parent: MainMenuComponent.breadcrumb()
        }
    }

    render(): JSX.Element {
        return <PageArticle title={AdminResetPasswordPageComponent.pageTitle}>
            <ResetPasswordForm/>
        </PageArticle>;
    }
}

export const AdminResetPasswordPage = compose(BreadcrumbInitializer)(AdminResetPasswordPageComponent) as
    React.ComponentClass<Partial<PageProperties<undefined>>>;


/*
import { AdminPageWithHeader } from "../../AdminPageWithHeader";
import { accountActions } from "../../../actions/AccountActions";
import { FormConnector } from "alt-reform";
import { ResetPasswordFormComponent } from "./ResetPasswordFormComponent";
import { resetPasswordForm } from "./ResetPasswordForm";
import { accountStore } from "../../../stores/AccountStore";
import { connectToStores } from "../../../../shared/alt";
import { InternalLink } from "../../../../shared/components/InternalLink";
import { helpers } from "../../../../shared/Helpers";
import {IPageWithParent} from "../../../../shared/models/Breadcrumb";
import {MainMenu} from "../../MainMenu/MainMenu";
import { Page } from "../../../../shared/components/PageWithHeader/Page";

export interface ResetPasswordPageProps {
    token: string;
}

interface RequestResetButtonProps {
    tokenExpired: boolean;
}

const ResetPasswordForm = FormConnector(resetPasswordForm(accountStore))(ResetPasswordFormComponent);

export class ResetPasswordPage extends AdminPageWithHeader<ResetPasswordPageProps> {
    name(): string {
        return "Reset your password";
    }

    urlFragment(): string {
        return "set-password/";
    }

    parent(): IPageWithParent {
        return new MainMenu();
    }

    load(props: ResetPasswordPageProps) {
        return this.loadParent(props).then(() => {
            accountActions.setPasswordResetToken(helpers.queryStringAsObject().token);
        });
    }

    render(): JSX.Element {
        return <Page page={this}>
            <ResetPasswordForm  />
            <ResetPasswordButton />
        </Page>;
    }
}

class ResetPasswordButtonComponent extends React.Component<RequestResetButtonProps, undefined>{
    static getStores() {
        return [ accountStore ];
    }

    static getPropsFromStores(): RequestResetButtonProps {
        const account = accountStore.getState();
        return {
            tokenExpired: account.tokenExpired
        };
    }

    render() {
        const forgottenPasswordLinkStyle = () => {
            return this.props.tokenExpired ? { "display": "block" } : { "display": "none" };
        };

        return <div style={forgottenPasswordLinkStyle()}>
            <InternalLink href="/forgotten-password/">
                <button>Request new reset password link</button>
            </InternalLink>
        </div>

    }
}

const ResetPasswordButton = connectToStores(ResetPasswordButtonComponent);
*/