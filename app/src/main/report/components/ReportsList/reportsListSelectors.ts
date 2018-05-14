import {createSelector, createSelectorCreator, defaultMemoize} from "reselect";
import {clone, isEqual, orderBy} from "lodash";
import {Report} from "../../../shared/models/Generated";
import {
    ReportsFilterFields,
    ReportsFilterPublishTypes,
    ReportsSortingFields
} from "../../actionTypes/ReportsActionsTypes";
import {ReportAppState} from "../../reducers/reportAppReducers";
import {VersionIdentifier} from "../../models/VersionIdentifier";

const createDeepEqualSelector = createSelectorCreator(
    defaultMemoize,
    isEqual
);

function containsSearchTerm(haystack: string, needle: string) {
    return haystack && haystack.toLowerCase().indexOf(needle.toLowerCase()) > -1;
}

export const reportsListSelectors = {

    getRawReportsListSelector: (state: ReportAppState) => state.reports.reports,

    getSortingPropsSelector: (state: ReportAppState) => state.reports.reportsSortBy,

    getFilterPropsSelector: (state: ReportAppState) => state.reports.reportsFilter,

    getSortOrderByReportFieldName: (field: ReportsSortingFields) => field === ReportsSortingFields.name ? 'asc' : 'desc',

    sortReportsList(reports: Report[], sortBy: ReportsSortingFields) {
        return orderBy(reports, [sortBy], [this.getSortOrderByReportFieldName(sortBy)])
    },

    compareVersionAndFilterTime: (version: string, filterTime: string) =>
        (new VersionIdentifier(version)).timestamp.getTime() > Date.parse(filterTime),

    filterReportsList(reports: Report[], filter: ReportsFilterFields) {
        let displayList: Report[] = clone(reports);
        if (filter.published !== ReportsFilterPublishTypes.all) {
            displayList = displayList.filter((item: any) => filter.published === ReportsFilterPublishTypes.published
                ? item.published
                : !item.published
            );
        }
        if (filter.timeFrom) {
            displayList = displayList.filter(item =>
                this.compareVersionAndFilterTime(item.latest_version, filter.timeFrom)
            );
        }
        if (filter.timeUntil) {
            displayList = displayList.filter(item =>
                !this.compareVersionAndFilterTime(item.latest_version, filter.timeUntil)
            );
        }
        if (filter.query) {
            displayList = displayList.filter(item => {
                return containsSearchTerm(item.name, filter.query)
                    || containsSearchTerm(item.display_name, filter.query);
            });
        }
        return displayList;
    },

    makeReportsDisplayList(reports: Report[], sortBy: ReportsSortingFields, filter: ReportsFilterFields) {
        let displayList = null;
        if (reports) {
            displayList = clone(reports);
            if (filter) {
                displayList = this.filterReportsList(displayList, filter);
            }
            if (sortBy) {
                displayList = this.sortReportsList(displayList, sortBy);
            }
        }
        return displayList;
    },

    createDisplayListSelector() {
        return createDeepEqualSelector(
            [this.getRawReportsListSelector, this.getSortingPropsSelector, this.getFilterPropsSelector],
            (reports: Report[], sortBy: ReportsSortingFields, filter: ReportsFilterFields) =>
                this.makeReportsDisplayList(reports, sortBy, filter)
        );
    }
}


