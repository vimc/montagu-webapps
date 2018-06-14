import {expect} from "chai";

import {Sandbox} from "../../Sandbox";
import {contribTouchstonesActionCreators} from "../../../main/contrib/actions/contribTouchstonesActionCreators";
import {TouchstonesService} from "../../../main/shared/services/TouchstonesService";
import {TouchstoneTypes} from "../../../main/shared/actionTypes/TouchstonesTypes";
import {createMockContribStore} from "../../mocks/mockStore";
import {mockTouchstone, mockTouchstoneVersion} from "../../mocks/mockModels";
import {TouchstonesState} from "../../../main/contrib/reducers/touchstonesReducer";

describe("Touchstone actions tests", () => {
    const sandbox = new Sandbox();

    const testTouchstone = mockTouchstone();

    afterEach(() => {
        sandbox.restore();
    });

    it("touchstones fetched", (done) => {
        const store = createMockContribStore({});
        sandbox.setStubFunc(TouchstonesService.prototype, "getTouchstonesByGroupId", () => {
            return Promise.resolve([testTouchstone]);
        });
        store.dispatch(contribTouchstonesActionCreators.getTouchstonesByGroupId('group-1'))
        setTimeout(() => {
            const actions = store.getActions();
            const expectedPayload = {type: TouchstoneTypes.TOUCHSTONES_FETCHED_FOR_GROUP, data: [testTouchstone]}
            expect(actions).to.eql([expectedPayload]);
            done();
        });
    });

    it("set current touchstone by id using previously loaded touchstones", (done) => {
        const testTouchstoneVersion = mockTouchstoneVersion({"id": "touchstone-1"});
        const touchstonesState: Partial<TouchstonesState> = {
            touchstones: [mockTouchstone({}, [testTouchstoneVersion])]
        };
        const store = createMockContribStore({touchstones: touchstonesState});
        store.dispatch(contribTouchstonesActionCreators.setCurrentTouchstoneVersion("touchstone-1"))
        setTimeout(() => {
            const actions = store.getActions();
            // console.log(actions);
            const expectedPayload = {type: TouchstoneTypes.SET_CURRENT_TOUCHSTONE_VERSION, data: testTouchstoneVersion};
            expect(actions).to.eql([expectedPayload]);
            done();
        });
    });

});