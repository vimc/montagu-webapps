import * as React from "react";
import { Dispatch } from "redux";
import { compose} from "recompose";
import { connect } from 'react-redux';

import {PageArticle} from "../../../../shared/components/PageWithHeader/PageArticle";
import { ResponsibilityOverviewDescription } from "./ResponsibilityOverviewDescription";
import { ResponsibilityOverviewContent } from "./ResponsibilityOverviewContent";
import {ChooseActionPageComponent} from "../../ChooseAction/ChooseActionPage";
import {PageBreadcrumb, PageProperties} from "../../../../shared/components/PageWithHeader/PageWithHeader";
import {ContribAppState} from "../../../reducers/contribAppReducers";
import {Touchstone} from "../../../../shared/models/Generated";
import {LoadingElement} from "../../../../shared/partials/LoadingElement/LoadingElement";
import {responsibilityOverviewPageActionCreators} from "../../../actions/pages/responsibilityOverviewPageActionCreators";

export interface ResponsibilityOverviewPageLocationProps {
    groupId: string;
    touchstoneId: string;
}

export interface ResponsibilityOverviewPageProps extends PageProperties<ResponsibilityOverviewPageLocationProps> {
    touchstone: Touchstone;
}

export class ResponsibilityOverviewPageComponent extends React.Component<ResponsibilityOverviewPageProps> {
    componentDidMount() {
        this.props.onLoad(this.props.match.params)
    }

    static breadcrumb(state: ContribAppState): PageBreadcrumb {
        return {
            name: state.touchstones.currentTouchstone.description,
            urlFragment: `responsibilities/${state.touchstones.currentTouchstone.id}/`,
            parent: ChooseActionPageComponent.breadcrumb(state)
        }
    }

    render(): JSX.Element {
        if (this.props.touchstone) {
            return <PageArticle title={`Responsibilities in ${this.props.touchstone.description }`}>
                <ResponsibilityOverviewContent/>
            </PageArticle>;
        } else {
            return <LoadingElement/>
        }
    }
}

export const mapStateToProps = (state: ContribAppState): Partial<ResponsibilityOverviewPageProps> => {
    return {
        touchstone: state.touchstones.currentTouchstone
    }
};

export const mapDispatchToProps = (dispatch: Dispatch<ContribAppState>): Partial<ResponsibilityOverviewPageProps> => {
    return {
        onLoad: (params: ResponsibilityOverviewPageLocationProps) => dispatch(responsibilityOverviewPageActionCreators.onLoad(params))
    }
};

export const ResponsibilityOverviewPage = compose(
    connect(mapStateToProps, mapDispatchToProps),
)(ResponsibilityOverviewPageComponent) as React.ComponentClass<Partial<ResponsibilityOverviewPageProps>>;
