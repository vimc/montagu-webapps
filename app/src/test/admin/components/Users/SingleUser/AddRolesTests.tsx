import * as React from "react";
import {expect} from "chai";
import * as Sinon from "sinon";
import {AddRoles, AddRolesComponent} from "../../../../../main/admin/components/Users/SingleUser/AddRoles";
import {Sandbox} from "../../../../Sandbox";
import {shallow} from "enzyme";
import {createMockStore} from "../../../../mocks/mockStore";
import {AdminAppState} from "../../../../../main/admin/reducers/adminAppReducers";
import {mockUser} from "../../../../mocks/mockModels";
import {mockAdminState, mockAdminUsersState} from "../../../../mocks/mockStates";
import {MockStore} from "redux-mock-store";
import {usersActionCreators} from "../../../../../main/admin/actions/usersActionCreators";

describe("AddRoles", () => {

    const sandbox: Sandbox = new Sandbox();

    const mockRoles = ["role1", "role2"];

    const mockUsersState = mockAdminUsersState({
        globalRoles: mockRoles,
        currentUser: mockUser({username: "fake.name", name: "Fake Name"})
    });
    const mockAdminAppState = mockAdminState({users: mockUsersState});

    let store: MockStore<AdminAppState>, addRoleStub: Sinon.SinonStub;

    beforeEach(() => {
        addRoleStub = sandbox.setStubFunc(usersActionCreators, "addGlobalRoleToUser",
            () => async () => Promise.resolve({}));

        store = createMockStore(mockAdminAppState);
    });

    afterEach(() => {
        sandbox.restore();
    });

    test("populates role options from store state", () => {

        const rendered = shallow(<AddRoles username={"testuser"} userRoles={[]}/>, {context: {store}})
            .dive().dive();

        expect(rendered.find("option")).to.have.lengthOf(2)
    });

    test("only shows roles the user does not have", () => {

        const rendered = shallow(<AddRolesComponent username={"testuser"}
                                                    userRoles={["role1"]}
                                                    allRoles={["role1", "role2"]}
                                                    addRoleToUser={null}/>);

        expect(rendered.find("option")).to.have.lengthOf(1);

    });

    test("dispatches addGlobalRoleToUser when role is added", () => {

        const addRoles = shallow(<AddRoles username={"testuser"} userRoles={["role1"]}/>, {context: {store}})
            .dive()
            .dive();

        addRoles.setState({selectedRole: "rolename", availableRoles: ["rolename"]});

        const onClick = addRoles.find("button").prop("onClick");
        onClick.call(onClick, {
            preventDefault: () => {
            }
        });

        expect(addRoleStub.calledWith("testuser", "rolename")).to.be.true;

    })
});