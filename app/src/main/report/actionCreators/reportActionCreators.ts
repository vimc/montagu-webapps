import {Dispatch} from "redux";

import { ReportsService } from "../services/ReportsService";
import {
    ReportsAction, ReportsFetched, ReportTypeKeys,
    ReportVersionDetailssFetched,
    ReportVersionsFetched,
    ReportVersionChangelogFetched,
    ReportVersionChangelogReset,
    ReportPublished,
    ReportUnpublished
} from "../actionTypes/ReportsActionsTypes";
import {GlobalState} from "../../shared/reducers/GlobalState";
import {ReportVersion} from "../../shared/models/Generated";

export const reportActionCreators = {

    getReports() {
        return async (dispatch: Dispatch<ReportsAction>, getState: () => GlobalState) => {
            const reports: ReportVersion[] = await (new ReportsService(dispatch, getState)).getAllReports();
            dispatch({
                type: ReportTypeKeys.REPORTS_FETCHED,
                data: reports
            } as ReportsFetched);
        }
    },

    setCurrentReport(report: string) {
        return {
            type: ReportTypeKeys.SET_CURRENT_REPORT,
            data: report
        }
    },
    publishReport(name: string, version: string) {
        return async (dispatch: Dispatch<any>, getState: () => GlobalState) => {
            const result = await (new ReportsService(dispatch, getState)).publishReport(name, version);
            dispatch({
                type: ReportTypeKeys.REPORT_PUBLISHED,
                data: {name: name, version: version}
            } as ReportPublished );
        }
    },
    unPublishReport(name: string, version: string) {
        return async (dispatch: Dispatch<any>, getState: () => GlobalState) => {
            const result = await (new ReportsService(dispatch, getState)).unPublishReport(name, version);
            dispatch({
                type: ReportTypeKeys.REPORT_UNPUBLISHED,
                data: {name: name, version: version}
            } as ReportUnpublished );
        }
    },

    getReportVersions(reportId: string) {
        return async (dispatch: Dispatch<any>, getState: () => GlobalState) => {
            const versions = await (new ReportsService(dispatch, getState)).getReportVersions(reportId);
            dispatch({
                type: ReportTypeKeys.REPORT_VERSIONS_FETCHED,
                data: versions
            } as ReportVersionsFetched );
        }
    },

    getVersionDetails(reportId: string, versionId: string) {
        return async (dispatch: Dispatch<any>, getState: () => GlobalState) => {
            const versionDetails = await (new ReportsService(dispatch, getState)).getVersionDetails(reportId, versionId);
            dispatch({
                type: ReportTypeKeys.REPORT_VERSION_DETAILS_FETCHED,
                data: versionDetails
            } as ReportVersionDetailssFetched );
        }
    },

    resetVersionChangelog(): ReportVersionChangelogReset {
        return {
            type: ReportTypeKeys.REPORT_VERSION_CHANGELOG_RESET
        }
    },

    getVersionChangelog(reportId: string, versionId: string) {
        return async (dispatch: Dispatch<any>, getState: () => GlobalState) => {
            const versionChangelog = await (new ReportsService(dispatch, getState)).getVersionChangelog(reportId, versionId);
            dispatch({
                type: ReportTypeKeys.REPORT_VERSION_CHANGELOG_FETCHED,
                data: versionChangelog
            } as ReportVersionChangelogFetched );
        }
    }

};
