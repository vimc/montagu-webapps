import * as React from "react";
import { compose } from "recompose";

import { NoRouteFound } from "../../shared/components/NoRouteFound";
import {ChooseGroupPageComponent} from "./ChooseGroup/ChooseGroupPage";
import {PageProperties} from "../../shared/components/PageWithHeader/PageProperties";
import {BreadcrumbInitializer} from "../../shared/components/Breadcrumbs/BreadcrumbsInitializer";
import {PageArticle} from "../../shared/components/PageWithHeader/PageArticle";
import {PageBreadcrumb} from "../../shared/components/PageWithHeader/PageProperties";

export class ContribNoRouteFoundPageComponent extends React.Component<PageProperties<undefined>> {
    componentDidMount(){
        this.props.createBreadcrumbs(ChooseGroupPageComponent.breadcrumb());
    }

    static breadcrumb() : PageBreadcrumb {
        return {
            name: NoRouteFound.title(),
            urlFragment: null,
            parent: ChooseGroupPageComponent.breadcrumb()
        }
    }

    render(): JSX.Element {
        return <PageArticle title={NoRouteFound.title()}>
            {NoRouteFound.render()}
        </PageArticle>;
    }
}

export const ContribNoRouteFoundPage = compose(BreadcrumbInitializer)(ContribNoRouteFoundPageComponent) as
    React.ComponentClass<Partial<PageProperties<undefined>>>;
