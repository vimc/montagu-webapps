import * as React from "react";
import { compose } from "recompose";
import { connect } from 'react-redux';
import { Dispatch } from "redux";

import { ModellingGroupsListContent } from "./ModellingGroupsListContent";
import {PageBreadcrumb, PageProperties} from "../../../../shared/components/PageWithHeader/PageWithHeader";
import {PageArticle} from "../../../../shared/components/PageWithHeader/PageArticle";
import {AdminAppState} from "../../../reducers/adminAppReducers";
import {MainMenuComponent} from "../../MainMenu/MainMenu";
import {modellingGroupsListPageActionCreators} from "../../../actions/pages/modellingGroupsListPageActionCreators";

export class ModellingGroupsListPageComponent extends React.Component<PageProperties<undefined>> {
    static title: string = "Modelling groups";

    componentDidMount(){
        this.props.onLoad()
    }

    static breadcrumb() : PageBreadcrumb {
        return {
            name: ModellingGroupsListPageComponent.title,
            urlFragment: "modelling-groups/",
            parent: MainMenuComponent.breadcrumb()
        }
    }

    render() :JSX.Element {
        return <PageArticle title={ModellingGroupsListPageComponent.title}>
            <ModellingGroupsListContent />
        </PageArticle>;
    }
}

export const mapDispatchToProps = (dispatch: Dispatch<AdminAppState>): Partial<PageProperties<undefined>> => {
    return {
        onLoad: () => dispatch(modellingGroupsListPageActionCreators.onLoad())
    }
};

export const ModellingGroupsListPage = compose(
    connect(state => state, mapDispatchToProps)
)(ModellingGroupsListPageComponent) as React.ComponentClass<Partial<PageProperties<undefined>>>;
