import * as React from "react";
import { Sandbox } from "../../../../Sandbox";
import { expect } from "chai";
import { expectOrderedActions } from "../../../../actionHelpers";
import { mockLocation, setupMainStore } from "../../../../mocks/mocks";

import { responsibilityStore } from "../../../../../main/contrib/stores/ResponsibilityStore";
import { mockModellingGroup } from "../../../../mocks/mockModels";
import { checkAsync } from "../../../../testHelpers";
import { UploadBurdenEstimatesPage } from "../../../../../main/contrib/components/Responsibilities/BurdenEstimates/UploadBurdenEstimatesPage";
import {jwtDecoder} from "../../../../../main/shared/sources/JwtDecoder";
import {mockResult} from "../../../../mocks/mockRemote";
import {helpers} from "../../../../../main/shared/Helpers";
import {Notification} from "../../../../../main/shared/actions/NotificationActions";

describe('UploadEstimatesPage', () => {
    const sandbox = new Sandbox();

    afterEach(() => {
        sandbox.restore();
    });

    it("triggers actions when it mounts", (done: DoneCallback) => {
        const spy = sandbox.dispatchSpy();
        const fetchTouchstones = sandbox.sinon.stub(responsibilityStore, "fetchTouchstones").returns(Promise.resolve(true));
        const fetchResponsibilities = sandbox.sinon.stub(responsibilityStore, "fetchResponsibilities").returns(Promise.resolve(true));
        const fetchOneTimeEstimatesToken = sandbox.sinon.stub(responsibilityStore, "fetchOneTimeEstimatesToken").returns(Promise.resolve(true));
        const location = mockLocation({
            touchstoneId: "touchstone-1",
            scenarioId: "scenario-1",
            groupId: "group-1",
        });
        const group = mockModellingGroup({ id: "group-1" });
        sandbox.sinon.stub(jwtDecoder, "jwtDecode").returns({result: JSON.stringify(mockResult("OK"))});
        sandbox.sinon.stub(helpers, "queryStringAsObject").returns({result: "blahblahblah"});

        setupMainStore({ groups: [group] });

        (new UploadBurdenEstimatesPage({location: location, router: null})).componentDidMount();

        checkAsync(done, (afterWait) => {
            afterWait(done, () => {
                const successNotification: Notification = {message:"Success! You have uploaded a new set of burden estimates.", type: "info"};
                expectOrderedActions(spy, [{ action: "NotificationActions.notify", payload: successNotification},
                    { action: "EstimateTokenActions.clearUsedToken", payload: true },
                    { action: "ModellingGroupActions.setCurrentGroup", payload: "group-1" },
                    { action: "TouchstoneActions.setCurrentTouchstone", payload: "touchstone-1" },
                    { action: "ResponsibilityActions.setCurrentResponsibility", payload: "scenario-1" }
                ], 0);
                expect(fetchTouchstones.called).to.equal(true, "Expected fetchTouchstones to be called");
                expect(fetchResponsibilities.called).to.equal(true, "Expected fetchResponsibilities to be called");
                expect(fetchOneTimeEstimatesToken.called).to.be.equal(true, "fetchOneTimeEstimatesToken");
            });
        });
    });
});