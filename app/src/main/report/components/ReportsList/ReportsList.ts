import { connect } from 'react-redux';
import { Dispatch } from "redux";
import { compose, branch, renderComponent } from "recompose";
import { createSelector } from "reselect";
import withLifecycle, {LifecycleMethods} from '@hocs/with-lifecycle';

import {ReportAppState} from "../../reducers/reportAppReducers";
import { reportActionCreators } from "../../actions/reportActionCreators";
import { LoadingElement } from "../../../shared/partials/LoadingElement/LoadingElement";
import {ReportsListTable, ReportsListTableProps} from "./ReportListTable";

export interface ReportsListContainerProps extends ReportsListTableProps {
    getReports: () => void;
    ready: boolean;
}

const lifecyleProps: Partial<LifecycleMethods<ReportsListContainerProps>> = {
    onDidMount(props: ReportsListContainerProps) {
        props.getReports();
    }
};

export const mapStateToProps = (state: ReportAppState): Partial<ReportsListContainerProps> => {
    return {
        reports: state.reports.reports,
        isReviewer: state.auth.isReportReviewer,
        ready: Array.isArray(state.reports.reports)
    }
};

export const mapDispatchToProps = (dispatch: Dispatch<ReportAppState>): Partial<ReportsListContainerProps> => {
    return {
        getReports: () => dispatch(reportActionCreators.getReports())
    }
};

const enhance = compose(
    connect(mapStateToProps, mapDispatchToProps),
    withLifecycle(lifecyleProps),
    branch((props: ReportsListContainerProps) => !props.ready, renderComponent(LoadingElement))
);
export const ReportsList = enhance(ReportsListTable);