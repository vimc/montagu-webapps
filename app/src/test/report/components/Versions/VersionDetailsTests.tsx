import * as React from "react";
import {shallow} from "enzyme";
import {expect} from "chai";
import {alt} from "../../../../main/shared/alt";
import {VersionDetailsComponent, VersionProps} from "../../../../main/report/components/Versions/VersionDetails";
import {mockVersion} from "../../../mocks/mockModels";
import { FileDownloadLink } from "../../../../main/report/components/FileDownloadLink";

describe("VersionDetails", () => {

    it("can get props from stores", () => {
        alt.bootstrap(JSON.stringify({
            ReportStore: {
                versionDetails: {"v1": mockVersion()},
                currentReport: "reportname",
                currentVersion: "v1",
                ready: true
            },
            ReportingAuthStore: {loggedIn: true}
        }));

        const expected: VersionProps = {

            report: "reportname",
            versionDetails: mockVersion(),
            ready: true
        };

        expect(VersionDetailsComponent.getPropsFromStores()).to.eql(expected);
    });


    it("renders date", () => {
        const rendered = shallow(<VersionDetailsComponent versionDetails={mockVersion({ date: "2015-03-25" })} report="reportname" ready={true}/>);
        expect(rendered.find('td').at(1).text()).to.eq("2015-03-25");
    });

    it("renders zip download link", () => {
        const rendered = shallow(<VersionDetailsComponent versionDetails={mockVersion({id: "v1"})} report="reportname" ready={true}/>);
        expect(rendered.find('td').at(0).find(FileDownloadLink).at(0).prop("href")).to.eq("/reports/reportname/v1/all/");
    });

});