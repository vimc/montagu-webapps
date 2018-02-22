import * as React from "react";
import {mount, shallow, ShallowRendererProps, ShallowWrapper} from "enzyme";
import {expect} from "chai";
import {PublishSwitch} from "../../../../main/report/components/Reports/PublishSwitch";
import {Sandbox} from "../../../Sandbox";
import {
    mapStateToProps, ReportTabEnum, SidebarComponent,
    SidebarProps, TabProps
} from "../../../../main/report/components/Reports/Sidebar";
import {mockAuthState, mockReportAppState, mockReportsState} from "../../../mocks/mockStates";
import {mockVersion} from "../../../mocks/mockModels";
import NavLink from "reactstrap/lib/NavLink";
import {NavBarComponent} from "../../../../main/shared/components/NavBar/NavBar";
import {NavbarCollapsedOnMobile} from "../../../../main/shared/components/NavCollapsedOnMobile";
import NavItem from "reactstrap/lib/NavItem";

describe("Sidebar", () => {

    const sandbox = new Sandbox();

    afterEach(() => {
        sandbox.restore();
    });

    const defaultTabProps: TabProps = {
        active: ReportTabEnum.REPORT
    };

    const defaultSidebarProps: SidebarProps = {
        published: true,
        isReviewer: true,
        ready: true,
        name: "name",
        version: "v1",
        active: ReportTabEnum.REPORT
    };

    it("renders publish switch if user is reviewer", () => {

        const props = defaultSidebarProps;
        props.isReviewer = true;

        const rendered = shallow(<SidebarComponent {...props} />);
        expect(rendered.find(PublishSwitch)).to.have.lengthOf(1);
    });


    it("does not render publish switch if user is not reviewer", () => {

        const props = defaultSidebarProps;
        props.isReviewer = false;

        const rendered = shallow(<SidebarComponent {...props} />);
        expect(rendered.find(PublishSwitch)).to.have.lengthOf(0);
    });

    it("does not render publish switch if details are not ready", () => {

        const props = defaultSidebarProps;
        props.isReviewer = true;
        props.ready = false;

        const rendered = shallow(<SidebarComponent {...props} />);
        expect(rendered.find(PublishSwitch)).to.have.lengthOf(0);
    });

    const reportLink = (rendered: ShallowWrapper<any, any>): ShallowWrapper<any, any> => {
        const navItems = rendered.find("ul")
            .children();

        return navItems.find("#report");
    };

    const downloadsLink = (rendered: ShallowWrapper<any, any>): ShallowWrapper<any, any> => {
        const navItems = rendered.find("ul")
            .children();

        return navItems.find("#downloads");
    };

    const changelogLink = (rendered: ShallowWrapper<any, any>): ShallowWrapper<any, any> => {
        const navItems = rendered.find("ul")
            .children();

        return navItems.find("#changelog");
    };

    it("report link is active if report tab is active", () => {

        const props = defaultSidebarProps;
        props.active = ReportTabEnum.REPORT;

        const rendered = shallow(<SidebarComponent {...props} />);
        const link = reportLink(rendered);

        expect(link).to.have.lengthOf(1);
        expect(link.prop("active")).to.be.true;

    });

    it("downloads link is active if downloads tab is active", () => {

        const props = defaultSidebarProps;
        props.active = ReportTabEnum.DOWNLOAD;

        const rendered = shallow(<SidebarComponent {...props} />);
        const link = downloadsLink(rendered);

        expect(link).to.have.lengthOf(1);
        expect(link.prop("active")).to.be.true;

    });

    it("report link changes tab to #reports", () => {

        const rendered = shallow(<SidebarComponent {...defaultSidebarProps} />);

        expect(reportLink(rendered).prop("href")).to.eq("#report");

    });

    it("downloads link changes tab to #downloads on click", () => {

        const rendered = shallow(<SidebarComponent {...defaultSidebarProps} />);

        expect(downloadsLink(rendered).prop("href")).to.eq("#downloads");

    });

    it("changelog link is disabled", () => {

        const rendered = shallow(<SidebarComponent {...defaultSidebarProps} />);

        expect(changelogLink(rendered).prop("disabled")).to.be.true;

    });

    it("gets reviewer status from app state", () => {

        let state = mockReportAppState({
            auth: mockAuthState({permissions: ["*/reports.review"]}),
            reports: mockReportsState({versionDetails: mockVersion()})
        });

        let result = mapStateToProps(state, defaultTabProps);

        expect(result.isReviewer).to.be.true;

        state = mockReportAppState({
            auth: mockAuthState({permissions: []})
        });

        result = mapStateToProps(state, defaultTabProps);

        expect(result.isReviewer).to.be.false;

    });

    it("gets publish status from app state", () => {

        let state = mockReportAppState({
            reports: mockReportsState({versionDetails: {published: false}})
        });

        let result = mapStateToProps(state, defaultTabProps);

        expect(result.published).to.be.false;

        state = mockReportAppState({
            reports: mockReportsState({versionDetails: {published: true}})
        });

        result = mapStateToProps(state, defaultTabProps);

        expect(result.published).to.be.true;

    });

    it("is not ready when version details are null", () => {

        let state = mockReportAppState();
        let result = mapStateToProps(state, defaultTabProps);

        expect(result.ready).to.be.false;
    });

    it("is ready when version details are non null", () => {

        let state = mockReportAppState({
            reports:
                mockReportsState({versionDetails: {published: false}})
        });
        let result = mapStateToProps(state, defaultTabProps);

        expect(result.ready).to.be.true;
    });

});