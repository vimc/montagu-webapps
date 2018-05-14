import * as React from "react";
import { compose } from "recompose";

import {ReportsList} from "./ReportsList";
import {PageArticle} from "../../../shared/components/PageWithHeader/PageArticle";
import {PageBreadcrumb, PageProperties} from "../../../shared/components/PageWithHeader/PageWithHeader";
import {BreadcrumbInitializer} from "../../../shared/components/Breadcrumbs/BreadcrumbsInitializer";

export class ReportsListPageComponent extends React.Component<PageProperties<undefined>> {
    componentDidMount(){
        this.props.createBreadcrumbs(ReportsListPageComponent.breadcrumb());
    }

    static breadcrumb() : PageBreadcrumb {
        return {
            name: "Main menu",
            urlFragment: "/",
            parent: null
        }
    }

    render() :JSX.Element {
        return <div className="page container pt-5">
            <ReportsList/>
        </div>
    }
}

export const ReportsListPage = compose(BreadcrumbInitializer)(ReportsListPageComponent) as
    React.ComponentClass<Partial<PageProperties<undefined>>>;
