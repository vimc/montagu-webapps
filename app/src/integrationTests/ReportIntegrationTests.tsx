import { expect } from "chai";
import * as React from "react";
import { shallow, ShallowWrapper } from "enzyme";
import { expectIsEqual, expectSameElements, IntegrationTestSuite } from "./IntegrationTest";
import { ReportingFetcher } from "../main/report/sources/ReportingFetcher";
import { checkPromise } from "../test/testHelpers";
import { oneTimeTokenStore } from "../main/report/stores/OneTimeTokenStore";
import { Version } from "../main/shared/models/reports/Report";
import { Sandbox } from "../test/Sandbox";
import { ArtefactItem } from "../main/report/components/Artefacts/ArtefactItem";
import { FileDownloadLink } from "../main/report/components/FileDownloadLink";
import { ResourceLinks } from "../main/report/components/Resources/ResourceLinks";
import { DataLinks } from "../main/report/components/Data/DataLinks";
import {ArtefactsSection} from "../main/report/components/Artefacts/ArtefactsSection";

import { createReportStore } from "../main/report/stores/createReportStore";
import {ReportsService} from "../main/report/services/ReportsService";
import {Report} from "../main/shared/models/Generated";

const jwt_decode = require('jwt-decode');

class ReportIntegrationTests extends IntegrationTestSuite {
    description() {
        return "Reporting portal";
    }

    createStore() {
        return createReportStore();
    }


    makeFetcher() {
        return new ReportingFetcher();
    }

    addTestsToMocha() {

        const sandbox = new Sandbox();
        const fetcher = new ReportingFetcher();

        afterEach(() => sandbox.restore());

        it("fetches reports", async () => {
            const expectedNames: string[] = ["minimal", "multi-artefact", "multifile-artefact", "other", "use_resource", "html"];
            const reports = await (new ReportsService(this.store.dispatch, this.store.getState)).getAllReports();
            const names = reports.map((item: Report) => item.name);
            const versions = reports.filter((item: Report) => item.latest_version.length > 0);
            const otherReport = reports.filter((item: Report) => item.name == "other");

            expectSameElements<string>(names, expectedNames);

            expect(otherReport[0].display_name).to.equal("another report");
            expect(versions.length).to.equal(reports.length);
        });

        it("fetches report versions",  async () => {
            const versions = await (new ReportsService(this.store.dispatch, this.store.getState)).getReportVersions("other");
            expect(versions.length).to.be.greaterThan(0);
        });

        it("fetches report version details", async () => {
            const versions = await (new ReportsService(this.store.dispatch, this.store.getState)).getReportVersions("minimal");
            const versionDetails = await (new ReportsService(this.store.dispatch, this.store.getState)).getVersionDetails("minimal", versions[0]);
            expect(versionDetails.name).is.equal("minimal");
        });

        it("fetches report one time token", async () => {
            const versions = await (new ReportsService(this.store.dispatch, this.store.getState)).getReportVersions("minimal");
            const token = await oneTimeTokenStore.fetchToken(`/reports/minimal/${versions[0]}/artefacts/`);
            const decoded = jwt_decode(token);
            expect(decoded.url).to.equal(`/v1/reports/minimal/${versions[0]}/artefacts/`);
        });

        it("downloads artefact", async () => {
            const versions = await (new ReportsService(this.store.dispatch, this.store.getState)).getReportVersions("multi-artefact");
            const rendered = shallow(<ArtefactItem report={"multi-artefact"} version={versions[0]}
                                                                   filenames={["all.csv", "all.png"]}
                                                                   description="all things"/>);
            const response = await firstDownloadPromise(rendered);
            expect(response.status).to.equal(200)
        });

        it("downloads resource", async () => {
            const versions = await (new ReportsService(this.store.dispatch, this.store.getState)).getReportVersions("use_resource");
            const rendered = shallow(<ResourceLinks report="use_resource" version={versions[0]}
                                                                     resources={["meta/data.csv"]}/>);
            const response = await firstDownloadPromise(rendered);
            expect(response.status).to.equal(200)
        });

        it("downloads data", async () => {
            const versions = await (new ReportsService(this.store.dispatch, this.store.getState)).getReportVersions("minimal");
            const versionDetails = await (new ReportsService(this.store.dispatch, this.store.getState)).getVersionDetails("minimal", versions[0]);
            const rendered = shallow(<DataLinks {...versionDetails.hash_data}/>);
            const response = await firstDownloadPromise(rendered);
            expect(response.status).to.equal(200)
        });

        it("downloads zipped report", async () => {
            const versions = await (new ReportsService(this.store.dispatch, this.store.getState)).getReportVersions("minimal");
            const versionDetails = await (new ReportsService(this.store.dispatch, this.store.getState)).getVersionDetails("minimal", versions[0]);
            const rendered = shallow(<ArtefactsSection report="minimal" versionDetails={versionDetails} />);
            const response = await firstDownloadPromise(rendered);
            expect(response.status).to.equal(200)
        });

        function firstDownloadPromise(rendered: ShallowWrapper<any, any>) {
            const link = rendered.find(FileDownloadLink).first();

            const url = link.prop("href");
            return fetcher.fetchFromReportingApi(url)
        }

    }
}

new ReportIntegrationTests();