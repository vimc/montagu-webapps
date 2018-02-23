import {
    ReportPublished,
    ReportsActionsTypes,
    ReportTypeKeys,
    ReportUnpublished
} from "../actionTypes/ReportsActionsTypes";
import {Report} from "../../shared/models/Generated";
import {Version} from "../../shared/models/reports/Report";
import {SearchTag} from "../components/MainMenu/Search";

export interface ReportsState {
    reports: Report[];
    versions: string[];
    currentReport: string;
    versionDetails: Version;
    filteredReports: Report[];
    tags: SearchTag[];
}

export const reportsInitialState: ReportsState = {
    reports: [],
    filteredReports: [],
    versions: [],
    currentReport: null,
    versionDetails: null,
    tags: []
};

export const reportsReducer = (state = reportsInitialState, action: ReportsActionsTypes): ReportsState => {
    switch (action.type) {
        case ReportTypeKeys.FILTER:
            return filterReports(state, action.data);
        case ReportTypeKeys.REPORTS_FETCHED:
            return initReports(state, action.data);
        case ReportTypeKeys.REPORT_VERSIONS_FETCHED:
            return {...state, versions: action.data};
        case ReportTypeKeys.SET_CURRENT_REPORT:
            return {...state, currentReport: action.data};
        case ReportTypeKeys.REPORT_VERSION_DETAILS_FETCHED:
            return {...state, versionDetails: action.data};
        case ReportTypeKeys.REPORT_PUBLISHED:
            let report = (action as ReportPublished).data;
            // TODO actually update report status
            return {...state};
        case ReportTypeKeys.REPORT_UNPUBLISHED:
            report = (action as ReportUnpublished).data;
            // TODO actually update report status
            return {...state};
        default:
            return state;
    }
};

function filterReports(state: ReportsState, tag: SearchTag): ReportsState {

    const filteredReports = state.filteredReports.filter(r =>
        r[tag.field] && r[tag.field].indexOf(tag.value) > -1
    );

    return {...state, filteredReports: filteredReports};
}

function initReports(state: ReportsState, reports: Report[]): ReportsState {

    const nameTags = reports.map(r => new SearchTag("name", r.name));
    const displayNameTags = reports.filter(r => r.display_name).map(r => new SearchTag("display_name", r.display_name));
    const versionTags = reports.map(r => new SearchTag("latest_version", r.latest_version));

    return {
        ...state,
        reports: reports,
        filteredReports: reports,
        tags: nameTags.concat(displayNameTags).concat(versionTags)
    };
}

