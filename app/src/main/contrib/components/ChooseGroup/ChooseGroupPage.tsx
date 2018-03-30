import * as React from "react";
import { compose } from "recompose";

import { ChooseGroupContent } from "./ChooseGroupContent";
import {PageArticle} from "../../../shared/components/PageWithHeader/PageArticle";
import {PageBreadcrumb, PageProperties} from "../../../shared/components/PageWithHeader/PageWithHeader";
import {BreadcrumbInitializer} from "../../../shared/components/Breadcrumbs/BreadcrumbsInitializer";

export class ChooseGroupPageComponent extends React.Component<PageProperties<undefined>> {

    static title: string = "Modellers' contribution portal";

    componentDidMount(){
        this.props.createBreadcrumbs(ChooseGroupPageComponent.breadcrumb());
    }

    static breadcrumb() : PageBreadcrumb {
        return {
            name: ChooseGroupPageComponent.title,
            urlFragment: "/",
            parent: null
        }
    }

    render() :JSX.Element {
        return <PageArticle title={ChooseGroupPageComponent.title}>
            <p>
                Montagu's database hosts estimates provided to Gavi in the
                past, and will hold those generated by the VIMC going forward.
                The contribution portal facilitates interaction of modellers
                with the database to generate estimates going forward. To this
                end, it is a platform for modellers contributing vaccine
                impact estimates to the VIMC to download input datasets and
                upload, review and approve model estimates.
            </p>
            <ChooseGroupContent />
        </PageArticle>;
    }
}

export const ChooseGroupPage = compose(BreadcrumbInitializer)(ChooseGroupPageComponent) as
    React.ComponentClass<Partial<PageProperties<undefined>>>;
