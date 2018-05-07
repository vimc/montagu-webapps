import * as React from "react";
import { compose } from "recompose";

import { NoRouteFound } from "../../shared/components/NoRouteFound";
import {MainMenuComponent} from "./MainMenu/MainMenu";
import {PageBreadcrumb, PageProperties} from "../../shared/components/PageWithHeader/PageWithHeader";
import {BreadcrumbInitializer} from "../../shared/components/Breadcrumbs/BreadcrumbsInitializer";
import {PageArticle} from "../../shared/components/PageWithHeader/PageArticle";

export class AdminNoRouteFoundPageComponent extends React.Component<PageProperties<undefined>> {
    componentDidMount(){
        this.props.createBreadcrumbs(MainMenuComponent.breadcrumb());
    }

    static breadcrumb() : PageBreadcrumb {
        return {
            name: NoRouteFound.title(),
            urlFragment: null,
            parent: MainMenuComponent.breadcrumb()
        }
    }

    render(): JSX.Element {
        return <PageArticle title={NoRouteFound.title()}>
            {NoRouteFound.render()}
        </PageArticle>;
    }
}

export const AdminNoRouteFoundPage = compose(BreadcrumbInitializer)(AdminNoRouteFoundPageComponent) as
    React.ComponentClass<Partial<PageProperties<undefined>>>;
