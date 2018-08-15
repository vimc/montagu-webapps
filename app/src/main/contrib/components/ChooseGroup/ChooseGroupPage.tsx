import * as React from "react";

import {ChooseGroupContent} from "./ChooseGroupContent";
import {PageArticle} from "../../../shared/components/PageWithHeader/PageArticle";
import {PageProperties} from "../../../shared/components/PageWithHeader/PageProperties";
import {chooseGroupPageActionCreators} from "../../actions/pages/chooseGroupPageActionCreators"
import {ContribPage} from "../../ContribPage";
import {PageBreadcrumb} from "../../../shared/components/PageWithHeader/PageProperties";

export class ChooseGroupPageComponent extends React.Component<PageProperties<undefined>> {

    static breadcrumb() : PageBreadcrumb {
        return {
            name: chooseGroupPageActionCreators.title(),
            urlFragment: "/",
            parent: null
        }
    }

    render() :JSX.Element {
        return <PageArticle title={this.props.title}>
            <p>
                Montagu's database hosts estimates provided to Gavi in the
                past, and will hold those generated by the VIMC going forward.
                The contribution portal facilitates interaction of modellers
                with the database to generate estimates going forward. To this
                end, it is a platform for modellers contributing vaccine
                impact estimates to the VIMC to download input datasets and
                upload, review and approve model estimates.
            </p>
            <ChooseGroupContent/>
        </PageArticle>;
    }
}

export const ChooseGroupPage = ContribPage(chooseGroupPageActionCreators)(ChooseGroupPageComponent);
