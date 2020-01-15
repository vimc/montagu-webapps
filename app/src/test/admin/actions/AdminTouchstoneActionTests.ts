import {adminTouchstoneActionCreators} from "../../../main/admin/actions/adminTouchstoneActionCreators";
import {Sandbox} from "../../Sandbox";
import {TouchstonesService} from "../../../main/shared/services/TouchstonesService";
import {TouchstoneTypes} from "../../../main/shared/actionTypes/TouchstonesTypes";
import {
    verifyActionThatCallsService,
    verifyActionThatCallsServiceAndReturnsResult
} from "../../ActionCreatorTestHelpers";
import {touchstonesActionCreators} from "../../../main/shared/actions/touchstoneActionCreators";
import {mockTouchstone} from "../../mocks/mockModels";
import {createMockAdminStore} from "../../mocks/mockStore";
import {expect} from "chai";

describe("Admin touchstone action tests", () => {
    const sandbox = new Sandbox();
    afterEach(() => sandbox.restore());

    test("gets all touchstones", (done: DoneCallback) => {
        verifyActionThatCallsServiceAndReturnsResult(done, {
            mockServices: () => sandbox.stubService(TouchstonesService.prototype, "getAllTouchstones"),
            callActionCreator: () => adminTouchstoneActionCreators.getAllTouchstones(),
            expectTheseActionTypes: [TouchstoneTypes.ALL_TOUCHSTONES_FETCHED]
        })
    });

    test("gets responsibilities for touchstone version", (done: DoneCallback) => {
        verifyActionThatCallsServiceAndReturnsResult(done, {
            mockServices: () => sandbox.stubService(TouchstonesService.prototype, "getResponsibilitiesForTouchstoneVersion"),
            callActionCreator: () => adminTouchstoneActionCreators.getResponsibilitiesForTouchstoneVersion("t1"),
            expectTheseActionTypes: [TouchstoneTypes.RESPONSIBILITIES_FOR_TOUCHSTONE_VERSION_FETCHED]
        })
    });

    test("creates a new touchstone", (done: DoneCallback) => {

        const touchstone = mockTouchstone({id: "tId"});
        verifyActionThatCallsService(done, {
            store: createMockAdminStore({touchstones: {touchstones: []}}),
            mockServices: () => {}, // right now this isn't wired up to a service
            callActionCreator: () => adminTouchstoneActionCreators.createTouchstone(touchstone),
            expectTheseActions: [{type: TouchstoneTypes.NEW_TOUCHSTONE_CREATED, data: {...touchstone, versions: []}}]
        })
    });

    test(
        "returns error if duplicate touchstone id is added",
        (done: DoneCallback) => {

            const touchstone = mockTouchstone({id: "tId"});
            const store = createMockAdminStore({touchstones: {touchstones: [touchstone]}});

            store.dispatch(adminTouchstoneActionCreators.createTouchstone(touchstone));

            setTimeout(() => {
                const actions = store.getActions();
                expect(actions).to.deep.eq([{type: TouchstoneTypes.SET_CREATE_TOUCHSTONE_ERROR,
                    data: [{code: "error", message: "Touchstone with id tId already exists. Please choose a unique id."}]}]);
                done();
            });
        }
    );

    test("sets current touchstone if exists", async () => {
        const touchstone = mockTouchstone({id: "tId"});
        const options = [touchstone, mockTouchstone()];
        expect(touchstonesActionCreators.setCurrentTouchstone("tId", options)).to.eql({
            type: TouchstoneTypes.SET_CURRENT_TOUCHSTONE,
            data: touchstone
        });
    });

    test(
        "setCurrentTouchstone throws exception if touchstone does not exist",
        async () => {
            const options = [mockTouchstone(), mockTouchstone()];
            expect(() => touchstonesActionCreators.setCurrentTouchstone("tId", options)).to.throw;
        }
    );
});