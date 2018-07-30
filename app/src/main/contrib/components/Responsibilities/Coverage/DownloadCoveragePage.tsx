import * as React from "react";
import { Dispatch } from "redux";
import { compose} from "recompose";
import { connect } from 'react-redux';

import {DownloadCoverageContent} from "./DownloadCoverageContent";
import {ResponsibilitiesPageTitle} from "../PageTitle";
import {ResponsibilityOverviewPageComponent} from "../Overview/ResponsibilityOverviewPage";
import {PageProperties} from "../../../../shared/components/PageWithHeader/PageProperties";
import {PageArticle} from "../../../../shared/components/PageWithHeader/PageArticle";
import {ContribAppState} from "../../../reducers/contribAppReducers";
import {downloadCoveragePageActionCreators} from "../../../actions/pages/downloadCoveragePageActionCreators";
import {PageBreadcrumb} from "../../../../shared/components/PageWithHeader/PageProperties";

export interface DownloadCoveragePageLocationProps {
    groupId: string;
    touchstoneId: string;
    scenarioId: string;
}

export class DownloadCoveragePageComponent extends React.Component<PageProperties<DownloadCoveragePageLocationProps>> {
    componentDidMount() {
        this.props.onLoad(this.props.match.params)
    }

    static breadcrumb(state: ContribAppState): PageBreadcrumb {
        return {
            name: `Download coverage for ${state.responsibilities.currentResponsibility.scenario.description}`,
            urlFragment: `coverage/${state.responsibilities.currentResponsibility.scenario.id}/`,
            parent: ResponsibilityOverviewPageComponent.breadcrumb(state)
        }
    }

    title(): JSX.Element {
        return <ResponsibilitiesPageTitle title="Download coverage data"/>;
    }

    render(): JSX.Element {
        return <PageArticle title={this.title()}>
            <DownloadCoverageContent/>
        </PageArticle>;
    }
}

export const mapDispatchToProps = (dispatch: Dispatch<ContribAppState>): Partial<PageProperties<DownloadCoveragePageLocationProps>> => {
    return {
        onLoad: (params: DownloadCoveragePageLocationProps) => dispatch(downloadCoveragePageActionCreators.onLoad(params))
    }
};

export const DownloadCoveragePage = compose(
    connect(state => state, mapDispatchToProps),
)(DownloadCoveragePageComponent) as React.ComponentClass<Partial<PageProperties<DownloadCoveragePageLocationProps>>>;
