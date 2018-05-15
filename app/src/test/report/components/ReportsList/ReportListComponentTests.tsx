import * as React from "react";
import {expect} from "chai";
import {shallow} from "enzyme";

import {mockReport} from "../../../mocks/mockModels";
import {
    latestVersionAccessorFunction,
    LatestVersionCell,
    NameCell, PublishStatusCell, PublishStatusFilter, publishStatusFilterMethod,
    ReportsListComponent, versionFilterMethod
} from "../../../../main/report/components/ReportsList/ReportsListComponent";
import {InternalLink} from "../../../../main/shared/components/InternalLink";
import {
    ReportLatestVersionFilter,
    ReportListDateFilter
} from "../../../../main/report/components/ReportsList/ReportListDateFilter";
import {Sandbox} from "../../../Sandbox";
import {DatePicker} from "../../../../main/shared/components/DatePicker/DatePicker";
import ReactTable from "react-table";

describe("ReportListComponent", () => {

    const sandbox = new Sandbox();

    beforeEach(function () {
        sandbox.restore();
    });

    describe("NameColumn", () => {

        it("renders name if no display name", function () {
            const result = shallow(<NameCell original={mockReport({display_name: null})} value={"name"}/>);
            expect(result.find(InternalLink).childAt(0).text()).to.eq("name");
        });

        it("renders display name if it exists, with name in brackets", function () {
            const result = shallow(<NameCell original={mockReport({display_name: "display name"})} value={"name"}/>);
            expect(result.find(InternalLink).childAt(0).text()).to.eq("display name (name)");
        });

        it("renders link to report", function () {
            const result = shallow(<NameCell original={mockReport({name: "report_name", latest_version: "1234"})}
                                             value={"name"}/>);
            expect(result.find(InternalLink).prop("href")).to.eq("/report_name/1234/");
        });
    });

    describe("LatestVersionColumn", () => {

        it("creates data object with id and last updated date", function () {

            const now = new Date("2018-05-14T23:00:00.000Z");
            const result = latestVersionAccessorFunction(mockReport({
                latest_version: "1234",
                updated_on: now.toDateString()
            }));

            expect(result).to.eql({version: "1234", date: new Date("2018-05-14T23:00:00.000Z")});
        });

        it("renders version id and date", function () {
            const result = shallow(<LatestVersionCell original={mockReport({display_name: null})}
                                                      value={{
                                                          version: "46324",
                                                          date: new Date("2018-05-14T23:00:00.000Z")
                                                      }}/>);

            expect(result.find(".small").childAt(0).text()).to.eq("46324");
            expect(result.find(".small").childAt(1).text()).to.eq("(Tue May 15 2018)");
        });

        it("renders date pickers", function () {

            const onChange = sandbox.sinon.stub();
            const filter = {
                id: "version", value: {
                    start: new Date("2017-05-14T23:00:00.000Z"),
                    end: new Date("2018-05-14T23:00:00.000Z"), versionId: "1234"
                }
            };

            const result = shallow(<ReportLatestVersionFilter onChange={onChange} filter={filter}/>);

            expect(result.find(ReportListDateFilter).dive().find(DatePicker).first().prop("value"))
                .to.eql(new Date("2017-05-14T23:00:00.000Z"));

            expect(result.find(ReportListDateFilter).dive().find(DatePicker).last().prop("value"))
                .to.eql(new Date("2018-05-14T23:00:00.000Z"));
        });


        it("passes through new start date to filter", function () {

            const onChange = sandbox.sinon.stub();
            const filter = {
                id: "version", value: {
                    start: new Date("2017-05-14T23:00:00.000Z"),
                    end: new Date("2018-05-14T23:00:00.000Z"), versionId: "1234"
                }
            };

            const result = shallow(<ReportLatestVersionFilter onChange={onChange} filter={filter}/>);
            result.find(ReportListDateFilter).dive().find(DatePicker).first().simulate("change",
                new Date("2017-06-14T23:00:00.000Z"));

            expect(onChange.calledWith({
                start: new Date("2017-06-14T23:00:00.000Z"),
                end: new Date("2018-05-14T23:00:00.000Z"),
                versionId: "1234"
            }))

        });

        it("passes through new end date to filter", function () {

            const onChange = sandbox.sinon.stub();
            const filter = {
                id: "version", value: {
                    start: new Date("2017-05-14T23:00:00.000Z"),
                    end: new Date("2018-05-14T23:00:00.000Z"), versionId: "1234"
                }
            };

            const result = shallow(<ReportLatestVersionFilter onChange={onChange} filter={filter}/>);
            result.find(ReportListDateFilter).dive().find(DatePicker).last().simulate("change",
                new Date("2017-06-14T23:00:00.000Z"));

            expect(onChange.calledWith({
                start: new Date("2017-06-14T23:00:00.000Z"),
                end: new Date("2017-06-14T23:00:00.000Z"),
                versionId: "1234"
            }))

        });

        it("passes through new id to filter", function () {

            const onChange = sandbox.sinon.stub();
            const filter = {
                id: "version", value: {
                    start: new Date("2017-05-14T23:00:00.000Z"),
                    end: new Date("2018-05-14T23:00:00.000Z"), versionId: "1234"
                }
            };

            const result = shallow(<ReportLatestVersionFilter onChange={onChange} filter={filter}/>);
            result.find("input").simulate("change", {target: {value: "newid"}});

            expect(onChange.calledWith({
                start: new Date("2017-06-14T23:00:00.000Z"),
                end: new Date("2018-05-14T23:00:00.000Z"),
                versionId: "newid"
            }))
        });

        it("filters reports by start date inclusive", function () {

            const row = {
                latest_version: {date: new Date("2017-05-14T23:00:00.000Z"), version: "1234"}
            };

            let filter = {
                id: "version", value: {
                    start: new Date("2017-05-14T23:00:00.000Z"),
                    end: new Date("2018-05-14T23:00:00.000Z"),
                    versionId: ""
                }
            };

            let result = versionFilterMethod(filter, row as any);
            expect(result).to.be.true;

            filter = {
                id: "version", value: {
                    start: new Date("2017-06-14T23:00:00.000Z"),
                    end: new Date("2018-05-14T23:00:00.000Z"),
                    versionId: ""
                }
            };

            result = versionFilterMethod(filter, row as any);
            expect(result).to.be.false;

        });

        it("filters reports by end date inclusive", function () {

            const row = {
                latest_version: {date: new Date("2018-05-14T23:00:00.000Z"), version: "1234"}
            };

            let filter = {
                id: "version", value: {
                    start: new Date("2017-05-14T23:00:00.000Z"),
                    end: new Date("2018-05-14T23:00:00.000Z"),
                    versionId: ""
                }
            };

            let result = versionFilterMethod(filter, row as any);
            expect(result).to.be.true;

            filter = {
                id: "version", value: {
                    start: new Date("2017-05-14T23:00:00.000Z"),
                    end: new Date("2018-04-14T23:00:00.000Z"),
                    versionId: ""
                }
            };

            result = versionFilterMethod(filter, row as any);
            expect(result).to.be.false;

        });

        it("filters reports by id", function () {

            const row = {
                latest_version: {date: new Date("2018-05-14T23:00:00.000Z"), version: "1234"}
            };

            const filter = {
                id: "version", value: {
                    start: new Date("2017-05-14T23:00:00.000Z"),
                    end: new Date("2018-06-14T23:00:00.000Z"),
                    versionId: "5678"
                }
            };

            const result = versionFilterMethod(filter, row as any);
            expect(result).to.be.false;
        });

    });

    describe("PublishStatusColumn", () => {

        it("is not included if isReviewer is false", function () {
            const result = shallow(<ReportsListComponent isReviewer={false} reports={[]}/>);
            expect(result.find(ReactTable).prop("columns").some(c => c.Header == "Status")).to.be.false;
        });

        it("is included if isReviewer is true", function () {
            const result = shallow(<ReportsListComponent isReviewer={true} reports={[]}/>);
            expect(result.find(ReactTable).prop("columns").some(c => c.Header == "Status")).to.be.true;
        });

        it("renders published badge", function () {
            const result = shallow(<PublishStatusCell original={mockReport()} value={true}/>);
            expect(result.find(".badge-published")).to.have.lengthOf(1);
        });

        it("renders internal badge", function () {
            const result = shallow(<PublishStatusCell original={mockReport()} value={false}/>);
            expect(result.find(".badge-internal")).to.have.lengthOf(1);
        });

        it("renders options to filter by status", function () {
            const onChange = sandbox.sinon.stub();
            const result = shallow(<PublishStatusFilter onChange={onChange}/>);
            expect(result.find("option").map(o => o.prop("value"))).to.have.members(["all", "published", "internal"])
        });

        it("filters reports by status", function () {
            let row = {
                published: true
            };

            let filter = {value: "published"};

            expect(publishStatusFilterMethod(filter as any, row as any),
                "published reports should show if filter is set to 'published'").to.be.true;

            filter = {value: "all"};

            expect(publishStatusFilterMethod(filter as any, row as any),
                "published reports should show if filter is set to 'all'").to.be.true;

            filter = {value: "internal"};

            expect(publishStatusFilterMethod(filter as any, row as any),
                "published reports should not show if filter is set to 'internal'").to.be.false;

            row = {
                published: false
            };

            filter = {value: "internal"};

            expect(publishStatusFilterMethod(filter as any, row as any),
                "internal reports should show if filter is set to 'internal'").to.be.true;

            filter = {value: "all"};

            expect(publishStatusFilterMethod(filter as any, row as any),
                "internal reports should show if filter is set to 'all'").to.be.true;

            filter = {value: "published"};

            expect(publishStatusFilterMethod(filter as any, row as any),
                "internal reports should not show if filter is set to 'published'").to.be.false;
        });
    });

});