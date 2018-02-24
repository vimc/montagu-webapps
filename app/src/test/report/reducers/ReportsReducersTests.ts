import { expect } from "chai";

import {reportsReducer, ReportsState} from "../../../main/report/reducers/reportsReducer";
import {ReportsSortingFields, ReportTypeKeys} from "../../../main/report/actionTypes/ReportsActionsTypes";
import {mockReport, mockVersion} from "../../mocks/mockModels";

describe('Reports reducer tests', () => {
    it('sets fetched reports list', () => {
        const reportMock = mockReport();
        const newState = reportsReducer(undefined, { type: ReportTypeKeys.REPORTS_FETCHED, data: [reportMock] });
        expect(newState.reports).to.eql([reportMock]);
    });

    it('sets fetched reports list', () => {
        const newState = reportsReducer(undefined, { type: ReportTypeKeys.SET_CURRENT_REPORT, data: 'test' });
        expect(newState.currentReport).to.eql('test');
    });

    it('sets fetched report versions list', () => {
        const versionMock = mockVersion();
        const newState = reportsReducer(undefined, { type: ReportTypeKeys.REPORT_VERSIONS_FETCHED, data: [versionMock] });
        expect(newState.versions).to.eql([versionMock]);
    });

    it('sets fetched report version details list', () => {
        const versionMock = mockVersion();
        const newState = reportsReducer(undefined, { type: ReportTypeKeys.REPORT_VERSION_DETAILS_FETCHED, data: versionMock });
        expect(newState.versionDetails).to.eql(versionMock);
    });

    it('sorts reports list by name', () => {
        const reportsMock = [mockReport({name: "b"}), mockReport({name: "c"}), mockReport({name: "a"})];
        const newState = reportsReducer(
            {reports: reportsMock, versions: ["test1"], currentReport: "test1", versionDetails: mockVersion()},
            { type: ReportTypeKeys.SORT_REPORTS, data: ReportsSortingFields.name }
        );
        expect(newState.reports[0].name).to.eql("a");
        expect(newState.reports[1].name).to.eql("b");
        expect(newState.reports[2].name).to.eql("c");
    });

    it('sorts reports list by latest version', () => {
        const reportsMock = [
            mockReport({name: "b", latest_version: "20170327-002851-dd944766"}),
            mockReport({name: "c", latest_version: "20170326-002851-dd944766"}),
            mockReport({name: "a", latest_version: "20170328-002851-dd944766"})
        ];
        const newState = reportsReducer(
            {reports: reportsMock, versions: ["test1"], currentReport: "test1", versionDetails: mockVersion()},
            { type: ReportTypeKeys.SORT_REPORTS, data: ReportsSortingFields.latest_version }
        );
        expect(newState.reports[0].name).to.eql("c");
        expect(newState.reports[1].name).to.eql("b");
        expect(newState.reports[2].name).to.eql("a");
    });



})