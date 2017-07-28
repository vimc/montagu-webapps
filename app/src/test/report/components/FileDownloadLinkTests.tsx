import { shallow } from "enzyme";
import { expect } from "chai";
import { FileDownloadLink, FileDownloadLinkComponent } from "../../../main/report/components/FileDownloadLink";
import * as React from "react";
import { mockOneTimeToken } from "../../mocks/mocks";
import { settings } from "../../../main/shared/Settings";
import { alt } from "../../../main/shared/alt";
import { oneTimeTokenStore } from "../../../main/report/stores/OneTimeTokenStore";
import { ReportingFetcher } from "../../../main/report/sources/ReportingFetcher";
import { Sandbox } from "../../Sandbox";
import { bootstrapOneTimeTokenStore } from "../../StoreHelpers";
import { checkAsync } from "../../testHelpers";

describe("FileDownloadLink", () => {
    const sandbox = new Sandbox();

    beforeEach(() => alt.recycle());
    afterEach(() => sandbox.restore());

    it("renders disabled link when token does not exist in local cache", () => {
        const rendered = shallow(<FileDownloadLinkComponent href="/grapefruit" token={null}/>);
        const a = rendered.find("a");
        expect(a.prop('href')).to.equal(null);
        expect(a.prop('disabled')).to.be.true;
    });

    it("renders enabled link when token is present", () => {
        const token = mockOneTimeToken("/mango");
        const rendered = shallow(<FileDownloadLinkComponent href="/grapefruit" token={token}/>);
        const a = rendered.find("a");
        expect(a.prop('href')).to.equal(settings.reportingApiUrl() + "/mango?access_token=TOKEN");
        expect(a.prop('disabled')).to.be.false;
    });

    it("can get properties from empty store", () => {
        const props = FileDownloadLinkComponent.getPropsFromStores({ href: "/banana", token: null });
        expect(props).to.eql({
            href: "/banana",
            token: null
        });
    });

    it("can get properties from store with matching token", () => {
        const qualifiedUrl = ReportingFetcher.buildRelativeReportingURL("/banana");
        const token = mockOneTimeToken(qualifiedUrl);
        bootstrapOneTimeTokenStore([token]);

        const props = FileDownloadLinkComponent.getPropsFromStores({ href: "/banana", token: null });
        expect(props).to.eql({
            href: "/banana",
            token: token
        });
    });

    it("triggers fetchToken on mount", (done: DoneCallback) => {
        const fetchToken = sandbox.sinon.stub(oneTimeTokenStore, "_fetchToken").returns(Promise.resolve(true));
        bootstrapOneTimeTokenStore([]);
        sandbox.mount(<FileDownloadLink href="/panda" />);

        checkAsync(done, () => {
            expect(fetchToken.called).to.equal(true, "Expected _fetchToken to be called");
        });
    });

    it("it does not trigger fetchToken on mount if token is in cache", (done: DoneCallback) => {
        const fetchToken = sandbox.sinon.stub(oneTimeTokenStore, "_fetchToken").returns(Promise.resolve(true));
        const url = "/bamboo";
        const qualifiedUrl = ReportingFetcher.buildRelativeReportingURL(url);
        bootstrapOneTimeTokenStore([mockOneTimeToken(qualifiedUrl)]);
        sandbox.mount(<FileDownloadLink href={url} />);

        checkAsync(done, () => {
            expect(fetchToken.called).to.equal(false, "Expected _fetchToken to not be called");
        });
    });
});