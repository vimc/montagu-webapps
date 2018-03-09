import * as React from "react";

import {ReportsList} from "./ReportsList";
import {ReportsListSorting} from "./ReportsListSorting";
import {ReportsListFilter} from "./Filter/ReportsListFilter";
import {IPageWithParent} from "../../../shared/models/Breadcrumb";
import {ReportingPage} from "../ReportingPage";

import {PageArticle} from "../../../shared/components/PageWithHeader/PageArticle";

export class ReportsListPage extends React.Component {

    name() {
        return "Main menu";
    }

    title() {
        return <span>Choose a report to view</span>;
    }

    urlFragment() {
        return "/";
    }

    parent(): IPageWithParent {
        return null;
    }

    render() :JSX.Element {
        return <PageArticle title={this.title()}>
            <ReportsListFilter/>
            <ReportsListSorting/>
            <ReportsList/>
        </PageArticle>;
    }
}