import * as React from "react";
import {shallow} from "enzyme";
import {expect} from "chai";
import {Sandbox} from "../../../Sandbox";
import {ReportVersionSwitcher} from "../../../../main/report/components/Reports/ReportVersionSwitcher";
import {SidebarAdminComponent, SidebarAdminProps} from "../../../../main/report/components/Sidebar/SidebarAdminComponent";
import {PublishSwitch} from "../../../../main/report/components/Sidebar/PublishSwitch";
import {ReportReadersList} from "../../../../main/report/components/Sidebar/ReportReadersList";
import {RunReport} from "../../../../main/report/components/Sidebar/RunReport";


describe("SidebarAdminComponent", () => {

    const sandbox = new Sandbox();

    afterEach(() => {
        sandbox.restore();
    });

    const defaultSidebarProps: SidebarAdminProps = {
        published: true,
        isReviewer: true,
        isAdmin: true,
        isReportRunner: true,
        ready: true,
        report: "name",
        version: "v1",
        onChangeVersion: () => {
        },
        allVersions: ["v1", "v2"],
        reportReaders: [],
        getReportReaders: sandbox.sinon.stub(),
        removeReportReader: sandbox.sinon.stub(),
        addReportReader: sandbox.sinon.stub()
    };

    it("renders report version switcher", () => {

        const handler = sandbox.sinon.stub();
        const props = defaultSidebarProps;
        props.onChangeVersion = handler;

        const rendered = shallow(<SidebarAdminComponent {...props} />);
        expect(rendered.find(ReportVersionSwitcher).props()).to.eql({
            currentVersion: "v1",
            versions: ["v1", "v2"],
            onChangeVersion: handler
        });
    });

    it("emits onChangeVersion when switcher triggers it", () => {
        const handler = sandbox.sinon.stub();
        const props = defaultSidebarProps;
        props.onChangeVersion = handler;

        const rendered = shallow(<SidebarAdminComponent {...props} />);
        rendered.find(ReportVersionSwitcher).simulate("changeVersion", "v3");
        expect(handler.calledWith("v3"));
    });


    it("renders publish switch if user is reviewer", () => {

        const props = defaultSidebarProps;
        props.isReviewer = true;

        const rendered = shallow(<SidebarAdminComponent {...props} />);
        expect(rendered.find(PublishSwitch)).to.have.lengthOf(1);
    });


    it("does not render publish switch if user is not reviewer", () => {

        const props = defaultSidebarProps;
        props.isReviewer = false;

        const rendered = shallow(<SidebarAdminComponent {...props} />);
        expect(rendered.find(PublishSwitch)).to.have.lengthOf(0);
    });

    it("renders report readers if user is admin", () => {

        const props = defaultSidebarProps;
        props.isAdmin = true;
        props.ready = true;

        const rendered = shallow(<SidebarAdminComponent {...props} />);
        expect(rendered.find(ReportReadersList)).to.have.lengthOf(1);
    });

    it("does not render report readers if user is not admin", () => {

        const props = defaultSidebarProps;
        props.isAdmin = false;
        props.ready = true;

        const rendered = shallow(<SidebarAdminComponent {...props} />);
        expect(rendered.find(ReportReadersList)).to.have.lengthOf(0);
    });

    it("passes down addReportReader with report name populated", () => {

        const stub = sandbox.sinon.stub();
        const props = defaultSidebarProps;
        props.isAdmin = true;
        props.ready = true;
        props.addReportReader = stub;
        props.report = "reportname";

        const rendered = shallow(<SidebarAdminComponent {...props} />);
        const addReportReader = rendered.find(ReportReadersList).prop("addReportReader");
        addReportReader("test.user");
        expect(stub.calledWith("reportname", "test.user")).to.be.true;
    });

    it("passes down removeReportReader with report name populated", () => {

        const stub = sandbox.sinon.stub();
        const props = defaultSidebarProps;
        props.isAdmin = true;
        props.ready = true;
        props.removeReportReader = stub;
        props.report = "reportname";

        const rendered = shallow(<SidebarAdminComponent {...props} />);
        const removeReportReader = rendered.find(ReportReadersList).prop("removeReportReader");
        removeReportReader("test.user");
        expect(stub.calledWith("reportname", "test.user")).to.be.true;
    });

    it("does not render RunReport component if user is not a report runner", () => {

        const props = defaultSidebarProps;
        props.isReportRunner = false;

        const rendered = shallow(<SidebarAdminComponent {...props} />);
        const runReportComponent = rendered.find(RunReport);
        expect(runReportComponent).to.have.lengthOf(0);
    });

    it("renders RunReport component if user is a report runner", () => {

        const props = defaultSidebarProps;
        props.isReportRunner = true;
        props.report = "test-report";

        const rendered = shallow(<SidebarAdminComponent {...props} />);
        const runReportComponent = rendered.find(RunReport);
        expect(runReportComponent).to.have.lengthOf(1);
        expect(runReportComponent.prop("name")).to.eq("test-report");
    });
});