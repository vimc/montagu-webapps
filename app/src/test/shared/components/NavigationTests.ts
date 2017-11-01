import {expect} from "chai";
import {Breadcrumb} from "../../../main/shared/models/Breadcrumb";
import {PageWithHeader} from "../../../main/shared/components/PageWithHeader/PageWithHeader";
import {checkAsync} from "../../testHelpers";
import {Action, expectNoActions, getActions} from "../../actionHelpers";
import {Sandbox} from "../../Sandbox";
import {navActions} from "../../../main/shared/actions/NavActions";

export interface PageNavigationExpectation {
    page: PageWithHeader<any>;
    urlShouldBeNull?: boolean;
    affectsBreadcrumbs?: boolean;
}

export abstract class NavigationTests {
    abstract pages(): PageNavigationExpectation[];

    checkCanNavigateTo(
        expectation: PageNavigationExpectation,
        done: DoneCallback,
        sandbox: Sandbox,
        getCrumbFromAction: (action: Action) => Breadcrumb
    ) {
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

                const crumb = getCrumbFromAction(lastAction.payload);
                if (expectation.urlShouldBeNull === true) {
                    expect(crumb.url).to.equal(null, "Expected URL to be null");
                } else {
                    expect(crumb.url).to.not.equal(null, "URL was null");
                    expect(crumb.url).to.not.equal(undefined, "URL was undefined");
                }
                expect(crumb.name).to.not.be.equal(null, "Name was null");
                expect(crumb.name).to.not.equal(undefined, "Name was undefined");
            }
        });
    };

    addTestsToMocha() {
        const sandbox = new Sandbox();
        afterEach(() => sandbox.restore());

        this.pages().forEach(expectation => {
            const name = expectation.page.constructor.name;
            it("can navigate to " + name, (done: DoneCallback) => {
                navActions.initialize(null);
                this.checkCanNavigateTo(expectation, done, sandbox, a => {
                    expect(a.action).to.equal("NavActions.navigate");
                    return a.payload as Breadcrumb;
                });
            });
            it("can initialize at " + name, (done: DoneCallback) => {
                this.checkCanNavigateTo(expectation, done, sandbox, a => {
                    expect(a.action).to.equal("NavActions.initialize");
                    const crumbs = a.payload as Breadcrumb[];
                    return crumbs[crumbs.length - 1];
                });
            });
        })
    }
}