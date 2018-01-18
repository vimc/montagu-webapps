import * as React from "react";
import { FormConnector } from "alt-reform";
import { forgottenPasswordFormStore } from "../../shared/components/Login/ForgottenPasswordFormStore";
import { ContribPageWithHeader } from "./PageWithHeader/ContribPageWithHeader";
import {
    ForgottenPasswordFormComponent,
    ForgottenPasswordPageTitle
} from "../../shared/components/Login/ForgottenPasswordForm";
import {IPageWithParent} from "../../shared/models/Breadcrumb";
import {ChooseGroupPage} from "./ChooseGroup/ChooseGroupPage";
import { Page } from "../../shared/components/PageWithHeader/Page";

const ForgottenPasswordForm = FormConnector(forgottenPasswordFormStore("contrib"))(ForgottenPasswordFormComponent);

export class ContribForgottenPasswordPage extends ContribPageWithHeader<undefined> {
    name(): string {
        return ForgottenPasswordPageTitle;
    }

    urlFragment(): string {
        return "/forgotten-password/";
    }

    parent(): IPageWithParent {
        return new ChooseGroupPage();
    }

    render(): JSX.Element {
        return <Page page={this}>
            <ForgottenPasswordForm />
        </Page>;
    }
}