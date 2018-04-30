import * as React from "react";
import {ReportAppState} from "../../reducers/reportAppReducers";
import {connect, Dispatch} from "react-redux";
import {userActionCreators} from "../../actions/userActionCreators";
import {branch, compose, renderNothing} from "recompose";
import withLifecycle, {LifecycleMethods} from "@hocs/with-lifecycle";
import {SidebarAdminComponent, SidebarAdminProps} from "./SidebarAdminComponent";

export interface SidebarAdminPublicProps {
    onChangeVersion: (version: string) => any;
}

const mapStateToProps = (state: ReportAppState): Partial<SidebarAdminProps> => {

    const versionDetails = state.reports.versionDetails;

    const ready = !!versionDetails
        && !!state.reports.versions;

    return {
        ready: ready,
        isReviewer: state.auth.permissions.indexOf("*/reports.review") > -1,
        isAdmin: state.auth.permissions.indexOf("*/roles.read") > -1,
        published: versionDetails && versionDetails.published,
        allVersions: state.reports.versions,
        report: versionDetails && versionDetails.name,
        version: versionDetails && versionDetails.id,
        reportReaders: state.users.reportReaders
    };
};

export const mapDispatchToProps = (dispatch: Dispatch<any>): Partial<SidebarAdminProps> => {

    return {
        removeReportReader: (report: string, username: string) =>
            dispatch(userActionCreators.removeReportReader(report, username)),
        addReportReader: (report: string, username: string) =>
            dispatch(userActionCreators.addReportReader(report, username)),
        getReportReaders: (reportName: string) =>
            dispatch(userActionCreators.getReportReaders(reportName))
    }
};

const lifecycleMethods: Partial<LifecycleMethods<SidebarAdminProps>> = {
    onWillReceiveProps(_: SidebarAdminProps, nextProps: SidebarAdminProps) {
        if (nextProps.ready && nextProps.isAdmin) {
            nextProps.getReportReaders(nextProps.report)
        }
    }
};

const enhance = compose<SidebarAdminProps, SidebarAdminPublicProps>(
    connect(mapStateToProps, mapDispatchToProps),
    withLifecycle(lifecycleMethods),
    branch((props: SidebarAdminProps) =>  !props.ready, renderNothing)
);

export const SidebarAdmin = enhance(SidebarAdminComponent);