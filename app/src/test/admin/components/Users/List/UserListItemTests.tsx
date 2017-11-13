import * as React from "react";
import { shallow } from "enzyme";
import { expect } from "chai";
import {UserListItem} from "../../../../../main/admin/components/Users/List/UserListItem";
import {mockUser} from "../../../../mocks/mockModels";
import {User} from "../../../../../main/shared/models/Generated";
import {InternalLink} from "../../../../../main/shared/components/InternalLink";

describe("UserListItem", () => {
    it("can render", () => {
        shallow(<UserListItem { ...mockUser() } />);
    });

    it("shows 'never' if user has not logged in", () => {

        const user: User = mockUser();
        user.last_logged_in = null;
        const rendered = shallow(<UserListItem { ...user } />);
        const cells = rendered.find('td');

        const lastLoggedIn = cells.at(3).text();
        expect(lastLoggedIn).to.eq("never")
    });

    it("makes link", () => {

        const user: User = mockUser();
        user.last_logged_in = null;
        user.username = "some.user";
        const rendered = shallow(<UserListItem { ...user } />);
        const link = rendered.find(InternalLink);

        const href = link.prop("href");
        expect(href).to.eq("/users/some-user/")
    })

});