import {expect} from "chai";
import {Breadcrumb} from "../../../main/shared/models/Breadcrumb";
import {PageWithHeader} from "../../../main/shared/components/PageWithHeader/PageWithHeader";
import {checkAsync} from "../../testHelpers";
import {expectNoActions, getActions} from "../../actionHelpers";
import {Sandbox} from "../../Sandbox";
import {navActions} from "../../../main/shared/actions/NavActions";

export interface PageNavigationExpectation {
    page: PageWithHeader<any>;
    urlShouldBeNull?: boolean;
    affectsBreadcrumbs?: boolean;
}

export abstract class NavigationTests {
    abstract pages(): PageNavigationExpectation[];

    checkCanNavigateTo(expectation: PageNavigationExpectation, done: DoneCallback, sandbox: Sandbox) {
        const spy = sandbox.dispatchSpy();
        const page = expectation.page;
        page.load();
        checkAsync(done, () => {
            if (expectation.affectsBreadcrumbs === false) {
                expectNoActions(spy);
            } else {
                const actions = getActions(spy);
                expect(actions).to.have.length.greaterThan(0, "There were no actions");
                const lastAction = actions[actions.length - 1];

                const crumb = lastAction.payload as Breadcrumb;
                if (expectation.urlShouldBeNull === true) {
                    expect(crumb.url).to.equal(null, "Expected URL to be null");
                } else {
                    expect(crumb.url).to.not.equal(null, "URL was null");
                }
                expect(crumb.name).to.not.be.equal(null, "Name was null");
            }
        });
    };

    addTestsToMocha() {
        const sandbox = new Sandbox();
        beforeEach(() => navActions.initialize(null));
        afterEach(() => sandbox.restore());

        this.pages().forEach(expectation => {
            it("can navigate to " + expectation.page.constructor.name, (done: DoneCallback) => {
                this.checkCanNavigateTo(expectation, done, sandbox);
            });
        })
    }
}