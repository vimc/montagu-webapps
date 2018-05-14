import * as React from "react";
import {expect} from "chai";
import {shallow} from "enzyme";
import {Report} from "../../../../main/shared/models/Generated";
import {InternalLink} from "../../../../main/shared/components/InternalLink";
import {ReportListItem} from "../../../../main/report/components/ReportsList/ReportListItem";

interface LinkProps {
    url: string;
    text: string;
}

describe("ReportListItem", () => {
    const render = function (props: Partial<Report>): LinkProps {
        const defaultReportProps: Report = {
            name: "name",
            display_name: "display name",
            latest_version: null,
            published: true,
            author: "author",
            requester: "requester",
            updated_on: (new Date()).toDateString()
        };
        const combined: Report = Object.assign({}, defaultReportProps, props);
        const rendered = shallow(<ReportListItem report={combined} isReviewer={false}/>);
        const link = rendered.find(InternalLink);
        return {
            url: link.prop("href"),
            text: link.children().text()
        };
    };


    it("renders display name if possible", () => {
        expect(render({name: "name", display_name: "display name"}).text)
            .to.equal("display name (name)");
    });

    it("renders short name if display name is empty", () => {
        expect(render({name: "name", display_name: ""}).text)
            .to.equal("name");
    });

    it("renders short name if display name is null", () => {
        expect(render({name: "name", display_name: null}).text)
            .to.equal("name");
    });

    it("links to latest report version", () => {
        expect(render({name: "name", latest_version: "some_version"}).url)
            .to.equal("/name/some_version/");
    });
});