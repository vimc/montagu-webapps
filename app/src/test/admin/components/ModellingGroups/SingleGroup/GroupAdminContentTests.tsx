import * as React from "react";
import { expect } from "chai";
import { shallow } from "enzyme";
import { GroupAdminContentComponent } from "../../../../../main/admin/components/ModellingGroups/SingleGroup/Admin/GroupAdminContent";
import { mockModellingGroupDetails, mockUser } from "../../../../mocks/mockModels";
import { alt } from "../../../../../main/shared/alt";
import { User } from "../../../../../main/shared/models/Generated";
import { ListOfUsers } from "../../../../../main/admin/components/ModellingGroups/ListOfUsers";

describe("GroupAdminContent", () => {
    it("can get props from stores", () => {
        const group = mockModellingGroupDetails({id: "group1", members: ["a", "b"] });
        const a = mockUser({ username: "a" });
        const b = mockUser({ username: "b" });
        const c = mockUser({ username: "c" });
        alt.bootstrap(JSON.stringify({
            UserStore: {
                users: [a, b, c],
                ready: true
            },
            GroupStore: {
                currentGroupId: "group1",
                groupDetails: {
                    "group1": group,
                    "group2": mockModellingGroupDetails()
                },
                membersLookup: {"group1": ["a", "b"], "group2": []}
            }
        }));
        const props = GroupAdminContentComponent.getPropsFromStores();
        expect(props).to.eql({
            groupId: "group1",
            ready: true,
            users: [a, b, c],
            members: [a, b]
        });
    });

    it("renders no members if group has no members", () => {
        const rendered = shallow(<GroupAdminContentComponent ready={ true } groupId="group1" users={ [] } members={ [] } />);
        expect(rendered.text()).to.contain("This group does not have any members.");
    });

    it("renders members if group has members", () => {
        const members = [
            mockUser({ name: "Test A" }),
            mockUser({ name: "Test B" })
        ];
        const rendered = shallow(<GroupAdminContentComponent ready={ true } groupId="group1" users={ [] } members={ members } />);
        expect(rendered.find(ListOfUsers).prop("users")).to.eql(members);
    });
});