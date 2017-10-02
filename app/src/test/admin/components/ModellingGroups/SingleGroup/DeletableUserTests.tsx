import * as React from "react";
import { expect } from "chai";
import { mockUser } from "../../../../mocks/mockModels";
import { Sandbox } from "../../../../Sandbox";
import { RemoveLink } from "../../../../../main/shared/components/RemoveLink";
import { InternalLink } from "../../../../../main/shared/components/InternalLink";
import { checkAsync } from "../../../../testHelpers";
import { User } from "../../../../../main/shared/models/Generated";
import fetcher from "../../../../../main/shared/sources/Fetcher";
import { mockResponse } from "../../../../mocks/mockRemote";
import { expectOneAction } from "../../../../actionHelpers";
import { DeletableUser } from "../../../../../main/admin/components/ModellingGroups/DeletableUser";


describe("DeletableUser", () => {
    const sandbox = new Sandbox();

    afterEach(() => sandbox.restore());

    it("renders link to user page", () => {

        const rendered = sandbox.mount(<DeletableUser groupId="group1" user={mockUser({
            "username": "w.a.m",
            "name": "Wolfgang Amadeus Mozart"
        })}/>);
        expect(rendered.find(InternalLink).prop("href")).to.eq("/users/w.a.m/")
    });

    it("renders delete link", () => {

        const rendered = sandbox.mount(<DeletableUser groupId="group1"
                                                      user={mockUser({ "name": "Wolfgang Amadeus Mozart" })}/>);
        expect(rendered.find(RemoveLink).prop("text")).to.eq("Remove member")
    });

    it("removes member", (done: DoneCallback) => {

        const fetch = sandbox.sinon.stub(fetcher.fetcher, "fetch")
            .withArgs("/modelling-groups/group1/actions/associate_member/",
                {
                    method: "post",
                    body: JSON.stringify({ username: "user1", action: "remove" })
                }
            )
            .returns(mockResponse({ status: "success", data: "OK", errors: [] }));

        const dispatchSpy = sandbox.dispatchSpy();

        const user: User = mockUser({ "name": "Wolfgang Amadeus Mozart", "username": "user1" });

        const deletableUser = new DeletableUser({ groupId: "group1", user: user });
        deletableUser.clickHandler();

        checkAsync(done, afterWait => {
            afterWait(done, () => {
                expect(fetch.called).to.equal(true);
                expectOneAction(dispatchSpy, { action: "ModellingGroupActions.removeMember", payload: "user1" });
            })
        })
    });

    it("notifies on error", (done: DoneCallback) => {

        const fakeError = { code: "e1", message: "some error" };
        const fetch = sandbox.sinon.stub(fetcher.fetcher, "fetch")
            .withArgs("/modelling-groups/group1/actions/associate_member/",
                {
                    method: "post",
                    body: JSON.stringify({ username: "user1", action: "remove" })
                }
            )
            .returns(mockResponse({ status: "failure", data: null, errors: [fakeError] }));

        const dispatchSpy = sandbox.dispatchSpy();

        const user: User = mockUser({ "name": "Wolfgang Amadeus Mozart", "username": "user1" });

        const deletableUser = new DeletableUser({ groupId: "group1", user: user });
        deletableUser.clickHandler();

        checkAsync(done, afterWait => {
            afterWait(done, () => {
                expect(fetch.called).to.equal(true);
                expectOneAction(dispatchSpy, {
                    action: "NotificationActions.notify",
                    payload: { type: "error", message: fakeError.message }
                });
            })
        })
    })
});