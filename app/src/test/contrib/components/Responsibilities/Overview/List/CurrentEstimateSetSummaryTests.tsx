import * as React from "react";
import {shallow, ShallowWrapper} from "enzyme";


import "../../../../../helper";
import {
    CurrentEstimateSetSummary,
    ReviewedAndApprovedMessage
} from "../../../../../../main/contrib/components/Responsibilities/Overview/List/CurrentEstimateSetSummary";
import {BurdenEstimateSet} from "../../../../../../main/shared/models/Generated";
import {mockBurdenEstimateSet} from "../../../../../mocks/mockModels";
import {FileDownloadButton} from "../../../../../../main/shared/components/FileDownloadLink";

describe("CurrentEstimateSetSummary Component Tests", () => {
    const render = function (set: BurdenEstimateSet, canUpload: boolean, groupId: string = "g1"): ShallowWrapper<any, any> {
        return shallow(<CurrentEstimateSetSummary groupId={groupId} touchstoneId={"t1"} scenarioId={"s1"}
                                                  estimateSet={set} canUpload={canUpload}/>);
    };

    it("displays no estimates message if current estimate is null", () => {
        const rendered = render(null, true);
        expect(rendered.text()).toContain("No central burden estimate sets have been uploaded");
    });

    it("does not display download button if current estimate is null", () => {
        const rendered = render(null, true);
        expect(rendered.find(FileDownloadButton)).toHaveLength(0);
    });

    it(
        "does not display download button if current estimate set is empty",
        () => {
            const rendered = render(mockBurdenEstimateSet({
                status: "empty",
                uploaded_on: "2017-07-13 13:55:29 +0100"
            }), true);
            expect(rendered.find(FileDownloadButton)).toHaveLength(0);
        }
    );

    it("displays download button if current estimate set is invalid", () => {
        const rendered = render(mockBurdenEstimateSet({
            id: 1,
            status: "invalid",
            uploaded_on: "2017-07-13 13:55:29 +0100"
        }), true);
        expect(rendered.find(FileDownloadButton).props().href).toEqual("/modelling-groups/g1/responsibilities/t1/s1/estimate-sets/1/estimates/")
    });

    it("displays download button if current estimate set is complete", () => {
        const rendered = render(mockBurdenEstimateSet({
            id: 1,
            status: "complete",
            uploaded_on: "2017-07-13 13:55:29 +0100"
        }), true);
        expect(rendered.find(FileDownloadButton).props().href).toEqual("/modelling-groups/g1/responsibilities/t1/s1/estimate-sets/1/estimates/")
    });

    it("displays empty set message if current estimate is empty", () => {
        const rendered = render(mockBurdenEstimateSet({
            status: "empty",
            uploaded_on: "2017-07-13 13:55:29 +0100"
        }), true);
        expect(rendered.text()).toContain("You registered how you calculated your central estimates on Thu Jul 13");
    });

    it("displays complete set message if current estimate is complete", () => {
        const rendered = render(mockBurdenEstimateSet({
            status: "complete",
            uploaded_on: "2017-07-13 13:55:29 +0100",
            original_filename: "file.csv"
        }), true);
        expect(rendered.text()).toContain("A complete set of central estimates was uploaded on Thu Jul 13");
        expect(rendered.text()).toContain("with filename \"file.csv\"");
        const div = rendered.find("div").first();
        expect(div.hasClass("alert-warning")).toEqual(true);
    });

    it("does not display filename for complete set if it doesn't exist", () => {
        const rendered = render(mockBurdenEstimateSet({
            status: "complete",
            uploaded_on: "2017-07-13 13:55:29 +0100",
            original_filename: null
        }), true);
        expect(rendered.text()).toContain("A complete set of central estimates was uploaded on Thu Jul 13");
        expect(rendered.text()).not.toContain("with filename \"file.csv\"");
    });

    it("displays fallback message for unknown status", () => {
        const rendered = render(mockBurdenEstimateSet({
            status: "foo" as any,
            uploaded_on: "2017-07-13 13:55:29 +0100"
        }), true);
        expect(rendered.text()).toContain("You have a central estimate set in status 'foo'");
        expect(rendered.text()).toContain("Thu Jul 13");
    });

    it(
        "displays standard reviewed and approved message when uploads are not allowed",
        () => {
            const rendered = render(mockBurdenEstimateSet(), false);
            expect(rendered.find(ReviewedAndApprovedMessage)).toHaveLength(1);
        }
    );

    it("displays error alert when set is invalid", () => {
        const rendered = render(mockBurdenEstimateSet({
            status: "invalid",
            uploaded_on: "2017-07-13 13:55:29 +0100",
            original_filename: "file.csv"
        }), true);
        expect(rendered.text()).toContain("You uploaded an incomplete set of central estimates");
        expect(rendered.text()).toContain("Thu Jul 13");
        expect(rendered.text()).toContain("with filename \"file.csv\"");

        const div = rendered.find("div").first();
        expect(div.hasClass("alert-danger")).toEqual(true);
    });

    it("does not display filename for invalid set if it doesn't exist", () => {
        const rendered = render(mockBurdenEstimateSet({
            status: "invalid",
            uploaded_on: "2017-07-13 13:55:29 +0100",
            original_filename: null
        }), true);
        expect(rendered.text()).toContain("You uploaded an incomplete set of central estimates");
        expect(rendered.text()).not.toContain("with filename \"file.csv\"");
    });


});