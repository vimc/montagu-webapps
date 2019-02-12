import {expect} from "chai";

import {Sandbox} from "../../Sandbox";
import {reportActionCreators} from "../../../main/report/actionCreators/reportActionCreators";
import {ReportsService} from "../../../main/report/services/ReportsService";
import {ReportTypeKeys} from "../../../main/report/actionTypes/ReportsActionsTypes";
import {createMockStore} from "../../mocks/mockStore";

describe("Report actions tests", () => {
    const sandbox = new Sandbox();
    let store: any = null;

    beforeEach(() => {
        store = createMockStore();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("dispatches reports fetched action if get report action is dispatched", (done) => {
        sandbox.setStubFunc(ReportsService.prototype, "getAllReports", () => {
            return Promise.resolve([]);
        });
        store.dispatch(reportActionCreators.getReports());
        setTimeout(() => {
            const actions = store.getActions();
            expect(actions[0].type).to.eql(ReportTypeKeys.REPORTS_FETCHED);
            expect(actions[0].data).to.eql([]);
            done();
        });
    });

    it("dispatches set current report", (done) => {
        store.dispatch(reportActionCreators.setCurrentReport('test'));
        setTimeout(() => {
            const actions = store.getActions();
            expect(actions[0].type).to.eql(ReportTypeKeys.SET_CURRENT_REPORT);
            expect(actions[0].data).to.eql('test');
            done();
        });
    });

    it("dispatches reports versions fetched action if get report versions action is dispatched", (done) => {
        sandbox.setStubFunc(ReportsService.prototype, "getReportVersions", () => {
            return Promise.resolve([]);
        });
        store.dispatch(reportActionCreators.getReportVersions('test'));
        setTimeout(() => {
            const actions = store.getActions();
            expect(actions[0].type).to.eql(ReportTypeKeys.REPORT_VERSIONS_FETCHED);
            expect(actions[0].data).to.eql([]);
            done();
        });
    });

    it("dispatches reports version details fetched action if get report version details action is dispatched", (done) => {
        sandbox.setStubFunc(ReportsService.prototype, "getVersionDetails", () => {
            return Promise.resolve({});
        });
        store.dispatch(reportActionCreators.getVersionDetails('test', 'v1'));
        setTimeout(() => {
            const actions = store.getActions();
            expect(actions[0].type).to.eql(ReportTypeKeys.REPORT_VERSION_DETAILS_FETCHED);
            expect(actions[0].data).to.eql({});
            done();
        });
    });

    it("dispatches publish action if report version is published", (done) => {
        sandbox.setStubFunc(ReportsService.prototype, "publishReport", () => {
            return Promise.resolve({});
        });
        store.dispatch(reportActionCreators.publishReport('test', 'v1'));
        setTimeout(() => {
            const actions = store.getActions();
            expect(actions[0].type).to.eql(ReportTypeKeys.REPORT_PUBLISHED);
            expect(actions[0].data).to.eql({"name": "test", "version": "v1"});
            done();
        });
    });

    it("dispatches unpublish action if report version is unpublished", (done) => {
        sandbox.setStubFunc(ReportsService.prototype, "unPublishReport", () => {
            return Promise.resolve({});
        });
        store.dispatch(reportActionCreators.unPublishReport('test', 'v1'));
        setTimeout(() => {
            const actions = store.getActions();
            expect(actions[0].type).to.eql(ReportTypeKeys.REPORT_UNPUBLISHED);
            expect(actions[0].data).to.eql({"name": "test", "version": "v1"});
            done();
        });
    });

    it("dispatches run report action", (done) => {
        sandbox.setStubFunc(ReportsService.prototype, "runReport", () => {
            return Promise.resolve({key: "desperate_pangolin"});
        });
        store.dispatch(reportActionCreators.runReport('test'));
        setTimeout(() => {
            const actions = store.getActions();
            expect(actions[0].type).to.eql(ReportTypeKeys.REPORT_RUN_STARTED);
            expect(actions[0].data).to.eql({key: "desperate_pangolin"});
            done();
        });
    });

    it("dispatches report run status fetched action", (done) => {
        sandbox.setStubFunc(ReportsService.prototype, "getReportRunStatus", () => {
            return Promise.resolve({key: "desperate_pangolin", status: "running"});
        });
        store.dispatch(reportActionCreators.pollRunStatus('desperate_pangolin'));
        setTimeout(() => {
            const actions = store.getActions();
            expect(actions[0].type).to.eql(ReportTypeKeys.REPORT_RUN_STATUS_FETCHED);
            expect(actions[0].data).to.eql({key: "desperate_pangolin", status: "running"});
            done();
        });
    });

    it("dispatches report run status fetched action when no server response", (done) => {
        sandbox.setStubFunc(ReportsService.prototype, "getReportRunStatus", () => {
            return Promise.resolve(undefined);
        });
        store.dispatch(reportActionCreators.pollRunStatus('desperate_pangolin'));
        setTimeout(() => {
            const actions = store.getActions();
            expect(actions[0].type).to.eql(ReportTypeKeys.REPORT_RUN_STATUS_FETCHED);
            expect(actions[0].data).to.eql({key: "desperate_pangolin", status: "error contacting server", version: null, output: null});
            done();
        });
    });

    it("dispatches report run status removed action", (done) => {
        store.dispatch(reportActionCreators.reportRunStatusRemoved('test'));
        setTimeout(() => {
            const actions = store.getActions();
            expect(actions[0].type).to.eql(ReportTypeKeys.REPORT_RUN_STATUS_REMOVED);
            expect(actions[0].data).to.eql("test");
            done();
        });
    });
});
