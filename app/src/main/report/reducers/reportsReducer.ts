import {
    ReportPublished,
    ReportsAction,
    ReportTypeKeys,
    ReportUnpublished
} from "../actionTypes/ReportsActionsTypes";
import {Changelog, ReportVersion} from "../../shared/models/Generated";
import {Version} from "../../shared/models/reports/Report";
import {RunningReportStatus, RunningReportStatusValues} from "../models/RunningReportStatus";

export interface ReportsState {
    reports: ReportVersion[];
    versions: string[];
    currentReport: string;
    versionDetails: Version;
    versionChangelog: Changelog[];
    runningReports: RunningReportStatus[];
}

export const reportsInitialState: ReportsState = {
    reports: null,
    versions: null,
    currentReport: null,
    versionDetails: null,
    versionChangelog: null,
    runningReports: []
};

export const reportsReducer = (state = reportsInitialState, action: ReportsAction) : ReportsState => {
    switch (action.type) {
        case ReportTypeKeys.REPORTS_FETCHED:
            return { ...state, reports: action.data };
        case ReportTypeKeys.REPORT_VERSIONS_FETCHED:
            return {...state, versions: action.data};
        case ReportTypeKeys.SET_CURRENT_REPORT:
            return { ...state, currentReport: action.data };
        case ReportTypeKeys.REPORT_VERSION_DETAILS_FETCHED:
            return {...state, versionDetails: action.data};
        case ReportTypeKeys.REPORT_VERSION_CHANGELOG_RESET:
            return {...state, versionChangelog: null};
        case ReportTypeKeys.REPORT_VERSION_CHANGELOG_FETCHED:
            return {...state, versionChangelog: action.data};
        case ReportTypeKeys.REPORT_PUBLISHED:
            let report = (action as ReportPublished).data;
            // TODO actually update report status
            return {...state};
        case ReportTypeKeys.REPORT_UNPUBLISHED:
            report = (action as ReportUnpublished).data;
            // TODO actually update report status
            return {...state};
        case ReportTypeKeys.REPORT_RUN_STARTED:
            let runningReports = state.runningReports.filter(r => r.name != action.data.name);
            runningReports.push({
                name: action.data.name,
                key: action.data.key,
                status: RunningReportStatusValues.RUNNING_REPORT_STATUS_STARTED,
                version: null,
                output: null
            });
            return {...state, runningReports: runningReports};
        case ReportTypeKeys.REPORT_RUN_STATUS_FETCHED:
            runningReports = state.runningReports;
            const runningReport = runningReports.find(r => r.key == action.data.key);
            //Update the object in the state
            if (runningReport) {
                runningReport.output = action.data.output;
                runningReport.status = action.data.status;
                runningReport.version = action.data.version;
            }
            return {...state, runningReports: runningReports}
        default:
            return state;
    }
};
