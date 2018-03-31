import * as React from "react";
import { compose } from "recompose";
import { connect } from 'react-redux';
import { Action, Dispatch } from "redux";

import {ChooseGroupContent} from "./ChooseGroupContent";
import {PageArticle} from "../../../shared/components/PageWithHeader/PageArticle";
import {PageBreadcrumb, PageProperties} from "../../../shared/components/PageWithHeader/PageWithHeader";
import {ContribAppState} from "../../reducers/contribAppReducers";
import {ModellingGroup} from "../../../shared/models/Generated";
import {chooseGroupPageActionCreators} from "../../actions/chooseGroupPageActionCreators";

interface ChooseGroupPageProps extends PageProperties<undefined> {
    groups: ModellingGroup[];
}

export class ChooseGroupPageComponent extends React.Component<ChooseGroupPageProps> {

    static title: string = "Modellers' contribution portal";

    componentDidMount(){
        this.props.onLoad()
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
            <ChooseGroupContent groups={this.props.groups} />
        </PageArticle>;
    }
}

export const mapStateToProps = (state: ContribAppState): Partial<ChooseGroupPageProps> => {
    return {
        groups: state.groups.userGroups,
    }
};

export const mapDispatchToProps = (dispatch: Dispatch<Action>): Partial<ChooseGroupPageProps> => {
    return {
        onLoad: () => dispatch(chooseGroupPageActionCreators.onLoad())
    }
};

export const ChooseGroupPage = compose(
    connect(mapStateToProps, mapDispatchToProps)
)(ChooseGroupPageComponent) as React.ComponentClass<Partial<PageProperties<undefined>>>;
