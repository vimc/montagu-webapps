import * as React from "react";
import { compose } from "recompose";

import {PageArticle} from "../../../../../shared/components/PageWithHeader/PageArticle";
import {PageProperties} from "../../../../../shared/components/PageWithHeader/PageProperties";
import {ChooseGroupPageComponent} from "../../../ChooseGroup/ChooseGroupPage";
import {BreadcrumbInitializer} from "../../../../../shared/components/Breadcrumbs/BreadcrumbsInitializer";
import {PageScrollOnMount} from "../../../../../shared/components/PageWithHeader/PageScrollUpOnMount";
import {PageBreadcrumb} from "../../../../../shared/components/PageWithHeader/PageProperties";

const iframeSrc = "/contribution/guidance/over80.html";

export class ResponsibilityGuidanceOver80PageComponent extends React.Component<PageProperties<undefined>> {
    componentDidMount(){
        this.props.createBreadcrumbs(ResponsibilityGuidanceOver80PageComponent.breadcrumb());
    }

    static breadcrumb() : PageBreadcrumb {
        return {
            name: "Over 80",
            urlFragment: "help/over80/",
            parent: ChooseGroupPageComponent.breadcrumb()
        }
    }

    render() :JSX.Element {
        return <PageArticle hideTitle={true}>
            <iframe src={iframeSrc} width="100%" height="5836px" frameBorder="0"></iframe>
        </PageArticle>;
    }
}

export const ResponsibilityGuidanceOver80Page = compose(
    BreadcrumbInitializer,
    PageScrollOnMount
)(ResponsibilityGuidanceOver80PageComponent) as React.ComponentClass<Partial<PageProperties<undefined>>>;
