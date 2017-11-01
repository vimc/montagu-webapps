import {expect} from "chai";
import {DummyPage} from "./PageWithHeaderTests";
import {Sandbox} from "../../Sandbox";
import {navStore} from "../../../main/shared/stores/NavStore";
import {checkAsync} from "../../testHelpers";
import {navActions} from "../../../main/shared/actions/NavActions";

describe("Breadcrumbs", () => {
    const sandbox = new Sandbox();
    afterEach(() => sandbox.restore());

    it("initial page load builds full crumbs from parents", (done: DoneCallback) => {
        new C().componentDidMount();
        checkAsync(done, () => {
            const nav = navStore.getState();
            expect(nav.crumbs).to.eql([
                {url: "/", name: "A"},
                {url: "/b/", name: "B"},
                {url: "/b/c/", name: "C"}
            ]);
        });
    });

    it("navigation after page load respects link order", (done: DoneCallback) => {
        new A().componentDidMount();    // Page load
        new C().componentDidMount();    // First user navigation

        checkAsync(done, () => {
            const nav = navStore.getState();
            expect(nav.crumbs).to.eql([
                {url: "/", name: "A"},
                {url: "/b/c/", name: "C"},
            ]);
        });
    });
});

class A extends DummyPage {
    name() { return "A"; }
    urlFragment() { return "/"; }
}

class B extends DummyPage {
    name() { return "B" }
    urlFragment() { return "b/"; }
    parent() { return new A(); }
}

class C extends DummyPage {
    name() { return "C"; }
    urlFragment() { return "c/"; }
    parent() { return new B(); }
}