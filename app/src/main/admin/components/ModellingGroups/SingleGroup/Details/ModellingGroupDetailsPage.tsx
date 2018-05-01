import * as React from "react";
import { compose} from "recompose";
import { connect } from 'react-redux';
import { Dispatch } from "redux";

import { ModellingGroupDetailsContent } from "./ModellingGroupDetailsContent";
import {ModellingGroupsListPageComponent} from "../../List/ModellingGroupsListPage";
import { PageArticle } from "../../../../../shared/components/PageWithHeader/PageArticle";
import {PageBreadcrumb, PageProperties} from "../../../../../shared/components/PageWithHeader/PageWithHeader";
import {AdminAppState} from "../../../../reducers/adminAppReducers";
import {AdminPageHeader} from "../../../AdminPageHeader";
import {modellingGroupDetailsPageActionCreators} from "../../../../actions/pages/modellingGroupDetailsPageActionCreators";

export interface ModellingGroupDetailsPageLocationProps {
    groupId: string;
};

export interface ModellingGroupDetailsPageProps extends PageProperties<ModellingGroupDetailsPageLocationProps> {
    groupDescription: string;
};

export class ModellingGroupDetailsPageComponent extends React.Component<ModellingGroupDetailsPageProps> {
    componentDidMount() {
        this.props.onLoad(this.props.match.params)
    }

    static breadcrumb(state: AdminAppState): PageBreadcrumb {
        return {
            name: state.groups.currentGroup.id,
            urlFragment: `${state.groups.currentGroup.id}/`,
            parent: ModellingGroupsListPageComponent.breadcrumb()
        }
    }

    render() :JSX.Element {
        return <div>
            <AdminPageHeader/>
            <PageArticle title={this.props.groupDescription}>
                <ModellingGroupDetailsContent />
            </PageArticle>
        </div>;;
    }
}

const mapStateToProps = (state: AdminAppState) :Partial<ModellingGroupDetailsPageProps> => {
    console.log('ppp', state)
    return {
        groupDescription: state.groups.currentGroup ? state.groups.currentGroup.description : ''
    }
};

export const mapDispatchToProps = (dispatch: Dispatch<AdminAppState>): Partial<ModellingGroupDetailsPageProps> => {
    return {
        onLoad: (params: ModellingGroupDetailsPageLocationProps) => dispatch(modellingGroupDetailsPageActionCreators.onLoad(params))
    }
};

export const ModellingGroupDetailsPage = compose(
    connect(mapStateToProps, mapDispatchToProps),
)(ModellingGroupDetailsPageComponent) as React.ComponentClass<Partial<ModellingGroupDetailsPageProps>>;