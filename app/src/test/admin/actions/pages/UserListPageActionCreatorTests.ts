import {Sandbox} from "../../../Sandbox";
import {createMockStore} from "../../../mocks/mockStore";
import {mockBreadcrumbs, mockUser} from "../../../mocks/mockModels";
import {usersListPageActionCreators} from "../../../../main/admin/actions/pages/UsersListPageActionCreators";
import {UsersTypes} from "../../../../main/admin/actionTypes/UsersTypes";
import {UsersService} from "../../../../main/admin/services/UsersService";
import DoneCallback = jest.DoneCallback;

describe("User List Page actions tests", () => {
    const sandbox = new Sandbox();

    const testUser = mockUser();


    afterEach(() => {
        sandbox.restore();
    });

    it("fetches all users on load", (done: DoneCallback) => {
        const store = createMockStore({});

        sandbox.setStubFunc(UsersService.prototype, "getAllUsers", () => {
            return Promise.resolve([testUser]);
        });

        store.dispatch(usersListPageActionCreators.loadData());
        setTimeout(() => {
            const actions = store.getActions();
            const expectedPayload = [
                {type: UsersTypes.ALL_USERS_FETCHED, data: [testUser]}
            ];
            expect(actions).toEqual(expectedPayload);
            done();
        });
    });

});