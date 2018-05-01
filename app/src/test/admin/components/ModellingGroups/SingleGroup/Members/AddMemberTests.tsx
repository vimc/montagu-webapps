import {shallow} from "enzyme";
import * as React from "react";
import {expect} from "chai";

import "../../../../../helper";
import {
    AddMember, AddMemberComponent,
    AddMemberState
} from "../../../../../../main/admin/components/ModellingGroups/SingleGroup/Members/AddMember";
import {mockUser} from "../../../../../mocks/mockModels";
import {mockEvent} from "../../../../../mocks/mocks";
import {Sandbox} from "../../../../../Sandbox";
import {createMockStore} from "../../../../../mocks/mockStore";
import {modellingGroupsActionCreators} from "../../../../../../main/admin/actions/modellingGroupsActionCreators";

describe("AddMember component tests", () => {

    describe("connected component", () => {
        const groupId = "group-1";
        const testUser1 = mockUser({username: "a"});
        const testUser2 = mockUser({username: "b"});

        const sandbox = new Sandbox();

        afterEach(() => sandbox.restore());

        it("render on connect level", () => {
            const store = createMockStore();
            const rendered = shallow(
                <AddMember members={[testUser1.username]} users={[testUser2]} groupId={groupId}/>,
                {context: {store}}
            );
            expect(rendered.find(AddMemberComponent).length).to.equal(1);
            expect(rendered.props().members).to.eql([testUser1.username]);
            expect(rendered.props().users).to.eql([testUser2]);
            expect(rendered.props().groupId).to.equal(groupId);
            expect(typeof rendered.props().addUserToGroup).to.equal("function");
        });

        it("when user clicks Add, emits correct actions", () => {
            const store = createMockStore();
            const addUserToGroupStub = sandbox.setStubReduxAction(modellingGroupsActionCreators, "addUserToGroup")
            const rendered = shallow(
                <AddMember members={[]} users={[testUser1, testUser2]} groupId={groupId}/>,
                {context: {store}}
            ).dive();
            rendered.find("button.btn-success").simulate("click", mockEvent());
            expect(addUserToGroupStub.called).to.be.true;
            expect(addUserToGroupStub.getCall(0).args[0]).to.equal("group-1");
            expect(addUserToGroupStub.getCall(0).args[1]).to.equal("a");
        });
    });

    describe("component", () => {
        const groupId = "group-1";

        const sandbox = new Sandbox();

        afterEach(() => sandbox.restore());

        it("empty add member has no selected user and renders helpful message", () => {

            const addSpy = sandbox.createSpy();
            const rendered = shallow(<AddMemberComponent members={[]} users={[]} groupId={groupId} addUserToGroup={addSpy}/>);

            const expectedState: AddMemberState = {
                selectedUser: "",
                options: []
            };
            expect(rendered.instance().state).to.eql(expectedState);
            expect(rendered.text()).to.contain("No more users available to add");
            expect(rendered.find("form")).to.have.length(0, "Expected there to be no form elements");
        });

        it("renders options alphabetically", () => {
            const addSpy = sandbox.createSpy();
            const a = mockUser({username: "apple"});
            const b = mockUser({username: "banana"});
            const c = mockUser({username: "clementine"});
            const rendered = shallow(<AddMemberComponent members={[]} users={[c, a, b]} groupId={groupId} addUserToGroup={addSpy}/>);
            const expectedState: AddMemberState = {
                selectedUser: "apple",
                options: [a, b, c]
            };
            expect(rendered.instance().state).to.eql(expectedState);
            expect(rendered.text()).to.not.contain("No more users available to add");
            expect(rendered.find("form")).to.have.length(1, "Expected there to be 1 form element");
            expect(rendered.find("option").getElements().map(e => e.props.value)).to.eql([
                "apple",
                "banana",
                "clementine"
            ]);
        });

        it("does not show options that are already members", () => {
            const addSpy = sandbox.createSpy();
            const a = mockUser({username: "a"});
            const b = mockUser({username: "b"});
            const c = mockUser({username: "c"});
            const rendered = shallow(<AddMemberComponent members={["a", "c"]} users={[a, b, c]} groupId={groupId} addUserToGroup={addSpy}/>);
            const expectedState: AddMemberState = {
                selectedUser: "b",
                options: [b]
            };
            expect(rendered.instance().state).to.eql(expectedState);
            expect(rendered.find("option")).to.have.length(1);
        });

        it("when user selects option, selectedUser changes state", () => {
            const addSpy = sandbox.createSpy();
            const a = mockUser({username: "a"});
            const b = mockUser({username: "b"});
            const rendered = shallow(<AddMemberComponent members={[]} users={[a, b]} groupId={groupId} addUserToGroup={addSpy}/>);
            expect(rendered.instance().state.selectedUser).to.equal("a");
            rendered.find("select").simulate("change", { target: { value: "b" } });
            expect(rendered.instance().state.selectedUser).to.equal("b");
        });

        it("when user clicks Add, emits correct actions", () => {
            // Mocks
            const addSpy = sandbox.createSpy();
            const a = mockUser({username: "a"});
            const b = mockUser({username: "b"});

            // Subject
            const rendered = shallow(<AddMemberComponent members={[]} users={[a, b]} groupId={groupId} addUserToGroup={addSpy}/>);
            rendered.find("button.btn-success").simulate("click", mockEvent());
            expect(addSpy.called).to.be.true;
            expect(addSpy.getCall(0).args[0]).to.equal("group-1");
            expect(addSpy.getCall(0).args[1]).to.equal("a");
        });
    });
});