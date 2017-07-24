import * as React from "react";
import { expect } from "chai";
import { shallow } from "enzyme";

import {ReportListComponent} from "../../../main/report/components/Reports/ReportList";
import {ReportListItem} from "../../../main/report/components/Reports/ReportListItem";
import {alt} from "../../../main/shared/alt";

describe("ReportListComponent", () => {
    it("can get props from stores", () => {
        const reports = [ "report1", "report2" ];
        alt.bootstrap(JSON.stringify({
            ReportStore: {
                ready: true,
                reports: reports
            }
        }));

        expect(ReportListComponent.getPropsFromStores()).to.eql({
            ready: true,
            reports: reports
        });
    });

    it("renders items alphabetically", () => {
        const reports = [ "b", "c", "a" ];
        const rendered = shallow(<ReportListComponent ready={ true } reports={ reports } />);
        const items = rendered.find(ReportListItem);
        expect(items).to.have.length(3);
        expect(items.at(0).prop("name")).to.equal("a");
        expect(items.at(1).prop("name")).to.equal("b");
        expect(items.at(2).prop("name")).to.equal("c");
    });
});