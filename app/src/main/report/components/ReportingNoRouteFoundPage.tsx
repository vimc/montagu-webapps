import * as React from "react";
import { ReportingPageWithHeader } from "./ReportingPageWithHeader";
import { NoRouteFound } from "../../shared/components/NoRouteFound";
import {IPageWithParent} from "../../shared/models/Breadcrumb";
import {MainMenu} from "./MainMenu/MainMenu";
import { Page } from "../../shared/components/PageWithHeader/Page";
import {PageNoHeader} from "../../shared/components/PageWithHeader/PageNoHeader";

export class ReportingNoRouteFoundPage extends ReportingPageWithHeader<undefined> {
    name(): string {
        return NoRouteFound.title();
    }

    urlFragment(): string {
        return null;
    }

    url(): string {
        return null;
    }

    parent(): IPageWithParent {
        return new MainMenu();
    }

    render(): JSX.Element {
        return <PageNoHeader page={this}>
            {NoRouteFound.render()}
        </PageNoHeader>;
    }
}