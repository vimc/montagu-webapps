import {expect} from "chai";
import { createMemoryHistory } from 'history';

import {Sandbox} from "../../Sandbox";
import {PageBreadcrumb} from "../../../main/shared/components/PageWithHeader/PageProperties";
import {breadcrumbsActionCreators} from "../../../main/shared/actions/breadcrumbsActionsCreators";
import {createMockStore} from "../../mocks/mockStore";
import {breadcrumbsModule} from "../../../main/shared/modules/breadcrumbs";
import {mockBreadcrumbs, mockPageBreadcrumb} from "../../mocks/mockModels";
import {BreadcrumbsTypes} from "../../../main/shared/actionTypes/BreadrumbsTypes";
import {createContribStore} from "../../../main/contrib/createStore";
import {ContribAppState} from "../../../main/contrib/reducers/contribAppReducers";

class A {
    static breadcrumb() : PageBreadcrumb {
        return {
            name: "A",
            urlFragment: "/",
            parent: null
        }
    }
}

class B {
    static breadcrumb() : PageBreadcrumb {
        return {
            name: "B",
            urlFragment: "b/",
            parent: A.breadcrumb()
        }
    }
}

describe("Breadcrumbs actions integration tests with store", () => {

    const sandbox = new Sandbox();

    afterEach(() => sandbox.restore());

    test("initializes breadcrumbs for page A", () => {
        const history = createMemoryHistory();
        let store = createContribStore(history);
        store.dispatch(breadcrumbsActionCreators.createBreadcrumbs(A.breadcrumb()));
        const state = store.getState() as ContribAppState;
        const breadcrumbs = state.breadcrumbs.breadcrumbs;
        expect(breadcrumbs.length).to.equal(1);
        expect(breadcrumbs[0].name).to.equal("A");
        expect(breadcrumbs[0].url).to.equal("/");
    });

    test("initializes breadcrumbs for page B", () => {
        const history = createMemoryHistory();
        let store = createContribStore(history);
        store.dispatch(breadcrumbsActionCreators.createBreadcrumbs(B.breadcrumb()));
        const state = store.getState() as ContribAppState;
        const breadcrumbs = state.breadcrumbs.breadcrumbs;
        expect(breadcrumbs.length).to.equal(2);
        expect(breadcrumbs[0].name).to.equal("A");
        expect(breadcrumbs[0].url).to.equal("/");
        expect(breadcrumbs[1].name).to.equal("B");
        expect(breadcrumbs[1].url).to.equal("/b/");
    });
});

describe("Breadcrumbs actions tests with mock store", () => {

    const sandbox = new Sandbox();

    afterEach(() => sandbox.restore());

    test("sets breadcrumb", (done) => {
        const store = createMockStore({});
        const testBreadcrumbs = mockBreadcrumbs();
        const testPageBreadCrumb = mockPageBreadcrumb();

        sandbox.setStubFunc(breadcrumbsModule, "initialize", ()=>{
            return testBreadcrumbs;
        });
        store.dispatch(breadcrumbsActionCreators.createBreadcrumbs(testPageBreadCrumb));
        setTimeout(() => {
            const actions = store.getActions();
            const expectedPayload = { type: BreadcrumbsTypes.BREADCRUMBS_RECEIVED, data: testBreadcrumbs };
            expect(actions).to.eql([expectedPayload]);
            done();
        });
    });

});
