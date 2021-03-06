import * as React from "react";

import {mockUser} from "../../../../mocks/mockModels";
import {shallow} from "enzyme";

import {UsersList} from "../../../../../main/admin/components/Users/List/UsersList";
import {UserListItem} from "../../../../../main/admin/components/Users/List/UserListItem";
import {createMockStore} from "../../../../mocks/mockStore";
import {Sandbox} from "../../../../Sandbox";
import {Store} from "redux";
import {AdminAppState} from "../../../../../main/admin/reducers/adminAppReducers";
import {mockAdminState, mockAdminUsersState} from "../../../../mocks/mockStates";

describe("UsersListComponent", () => {

    let store: Store<AdminAppState>;

    const sandbox = new Sandbox();

    const users = [
        mockUser({username: "z"}),
        mockUser({username: "a"}),
        mockUser({username: "m"})
    ];

    beforeEach(() => {
        store = createMockStore(mockAdminState({users: mockAdminUsersState({users: users})}));
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("renders items alphabetically", () => {

        const rendered = shallow(<UsersList/>, {context: {store}}).dive();

        const items = rendered.find(UserListItem);
        expect(items).toHaveLength(3);
        expect(items.at(0).prop("username")).toEqual("a");
        expect(items.at(1).prop("username")).toEqual("m");
        expect(items.at(2).prop("username")).toEqual("z");
    });
});