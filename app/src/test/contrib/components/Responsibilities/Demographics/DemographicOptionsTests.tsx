import * as React from "react";
import { expect } from "chai";
import { shallow, ShallowWrapper } from "enzyme";
import { DemographicOptions } from "../../../../../main/contrib/components/Responsibilities/Demographics/DemographicOptions";
import { mockDemographicDataset } from "../../../../mocks/mockModels";
import { Sandbox } from "../../../../Sandbox";
import { expectOneAction } from "../../../../actionHelpers";
import { GenderControl } from "../../../../../main/contrib/components/Responsibilities/Demographics/GenderControl";
import { demographicStore } from "../../../../../main/contrib/stores/DemographicStore";
import { FormatControl } from "../../../../../main/contrib/components/Responsibilities/FormatControl";

describe("DemographicOptions", () => {
    const sandbox = new Sandbox();
    afterEach(() => sandbox.restore());

    function findRowByLabel(rendered: ShallowWrapper<any, any>, label: string) {
        return rendered.find("table").find(`label[children="${label}"]`).closest("tr");
    }

    function getStatisticType(rendered: ShallowWrapper<any, any>) {
        return findRowByLabel(rendered, "Statistic type").find("select");
    }

    function getGender(rendered: ShallowWrapper<any, any>) {
        return findRowByLabel(rendered, "Gender").find(GenderControl);
    }

    function getFormat(rendered: ShallowWrapper<any, any>) {
        return findRowByLabel(rendered, "Format").find(FormatControl);
    }

    it("renders statistic type options", () => {
        const sets = [
            mockDemographicDataset({ id: "a", name: "AA" }),
            mockDemographicDataset({ id: "b", name: "BB" })
        ];
        const rendered = shallow(<DemographicOptions
            dataSets={sets} selectedDataSet={null} selectedGender="" selectedFormat=""/>);
        const options = getStatisticType(rendered).find("option");
        expect(options.map(x => {
            return {
                value: x.prop("value"),
                text: x.children().text()
            };
        })).to.eql([
            { value: "", text: "- Select -" },
            { value: "a", text: "AA" },
            { value: "b", text: "BB" },
        ]);
    });

    it("selected statistic type is selected", () => {
        const setA = mockDemographicDataset({ id: "a" });
        const setB = mockDemographicDataset({ id: "b" });
        const rendered = shallow(<DemographicOptions
            dataSets={[setA, setB]} selectedDataSet={setB} selectedGender="" selectedFormat=""/>);
        expect(getStatisticType(rendered).prop("value")).to.equal("b");
    });

    it("renders gender control", () => {
        const setA = mockDemographicDataset({ id: "a"});
        const setB = mockDemographicDataset({ id: "b" });
        const rendered = shallow(<DemographicOptions
            dataSets={[setA, setB]} selectedDataSet={setA} selectedGender="x" selectedFormat=""/>);
        const control = getGender(rendered);
        expect(control.prop("dataSet")).to.equal(setA);
        expect(control.prop("value")).to.equal("x");
    });

    it("renders format control", () => {
        const setA = mockDemographicDataset({ id: "a"});
        const setB = mockDemographicDataset({ id: "b" });
        const rendered = shallow(<DemographicOptions
            dataSets={[setA, setB]} selectedDataSet={setA} selectedGender="" selectedFormat="x"/>);
        const control = getFormat(rendered);
        expect(control.prop("value")).to.equal("x");
    });

    it("emits action when statistic type is selected", () => {
        const spy = sandbox.dispatchSpy();
            const fetchOneTimeToken = sandbox.stubFetch(demographicStore, "fetchOneTimeToken");
        const rendered = shallow(<DemographicOptions
            dataSets={[]} selectedDataSet={null} selectedGender="" selectedFormat="" />);
        getStatisticType(rendered).simulate("change", { target: { value: "a" } });
        expectOneAction(spy, { action: "DemographicActions.selectDataSet", payload: "a" });
        expect(fetchOneTimeToken.called).to.be.true;
    });

    it("emits action when gender is selected", () => {
        const spy = sandbox.dispatchSpy();
        const fetchOneTimeToken = sandbox.stubFetch(demographicStore, "fetchOneTimeToken");
        const rendered = shallow(<DemographicOptions
            dataSets={[]} selectedDataSet={null} selectedGender="" selectedFormat=""/>);
        getGender(rendered).simulate("selectGender", "x");
        expectOneAction(spy, { action: "DemographicActions.selectGender", payload: "x" });
        expect(fetchOneTimeToken.called).to.be.true;
    });

    it("emits action when format is selected", () => {
        const spy = sandbox.dispatchSpy();
        const fetchOneTimeToken = sandbox.stubFetch(demographicStore, "fetchOneTimeToken");
        const rendered = shallow(<DemographicOptions
            dataSets={[]} selectedDataSet={null} selectedGender="" selectedFormat=""/>);
        getFormat(rendered).simulate("selectFormat", "x");
        expectOneAction(spy, { action: "DemographicActions.selectFormat", payload: "x" });
        expect(fetchOneTimeToken.called).to.be.true;
    });
});
