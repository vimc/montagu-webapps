import { expect } from "chai";

import { Sandbox } from "../../Sandbox";
import { estimatesActionCreators } from "../../../main/contrib/actions/estimatesActionCreators";
import { EstimatesService } from "../../../main/contrib/services/EstimatesService";
import { ResponsibilitiesService } from "../../../main/contrib/services/ResponsibilitiesService";
import {EstimatesCreateBurdenData, EstimatesTypes} from "../../../main/contrib/actionTypes/EstimatesTypes";
import {createMockContribStore, createMockStore} from "../../mocks/mockStore";
import {mapStateToPropsHelper} from "../../../main/contrib/helpers/mapStateToPropsHelper";
import {mockModellingGroup, mockResponsibilities, mockTouchstone, mockTouchstoneVersion} from "../../mocks/mockModels";
import {ExtendedResponsibilitySet} from "../../../main/contrib/models/ResponsibilitySet";
import {ResponsibilitiesTypes} from "../../../main/contrib/actionTypes/ResponsibilitiesTypes";

describe("Estimates actions tests", () => {
    const sandbox = new Sandbox();

    const testTouchstone = mockTouchstone();
    const testTouchstoneVersion = testTouchstone.versions[0];
    const testGroup = mockModellingGroup();
    const testResponsibilitySet = mockResponsibilities();
    const testExtResponsibilitySet = new ExtendedResponsibilitySet(testResponsibilitySet, testTouchstoneVersion, testGroup);
    const testResponsibility = testExtResponsibilitySet.responsibilities[0];

    afterEach(() => {
        sandbox.restore();
    });

    it("gets one time token", (done) => {
        const store = createMockContribStore({
            estimates: {
                redirectPath: '/test/'
            }
        });
        sandbox.setStubFunc(EstimatesService.prototype, "getOneTimeToken", ()=>{
          return Promise.resolve('test-token');
        });
        sandbox.setStubFunc(mapStateToPropsHelper, "getResponsibilityIds", ()=>{
          return {groupId: "g-1", touchstoneId: "t-1", scenarioId: "s-1", estimateSetId: "e-1"};
        });
        store.dispatch(estimatesActionCreators.getOneTimeToken());
        setTimeout(() => {
            const actions = store.getActions();
            const expectedPayload = [
                { type: EstimatesTypes.ESTIMATES_ONE_TIME_TOKEN_CLEAR},
                { type: EstimatesTypes.ESTIMATES_ONE_TIME_TOKEN_FETCHED, data: 'test-token' }
            ];
            expect(actions).to.eql(expectedPayload);
            done();
        });
    });

    it("sets redirect path", (done) => {
        const store = createMockStore();
        store.dispatch(estimatesActionCreators.setRedirectPath("/test/path/"));
        setTimeout(() => {
            const actions = store.getActions()
            const expectedPayload = { type: EstimatesTypes.ESTIMATES_SET_REDIRECT_PATH, data: "/test/path/" }
            expect(actions).to.eql([expectedPayload])
            done();
        });
    });

    it("creates burden", (done) => {
        const store = createMockContribStore({
            groups: { currentUserGroup: testGroup },
            touchstones: { currentTouchstoneVersion: testTouchstoneVersion },
            responsibilities: {
                currentResponsibility: testResponsibility,
                responsibilitiesSet: testExtResponsibilitySet
            },
            estimates: {
                redirectPath: '/test/'
            }
        });
        sandbox.setStubFunc(EstimatesService.prototype, "createBurden", ()=>{
            return Promise.resolve();
        });
        sandbox.setStubFunc(ResponsibilitiesService.prototype, "clearCacheForResponsibilities", ()=>{
            return Promise.resolve();
        });
        sandbox.setStubFunc(ResponsibilitiesService.prototype, "getResponsibilities", ()=>{
            return Promise.resolve(testResponsibilitySet);
        });
        sandbox.setStubFunc(EstimatesService.prototype, "getOneTimeToken", ()=>{
            return Promise.resolve('test-token');
        });
        sandbox.setStubFunc(mapStateToPropsHelper, "getResponsibilityIds", ()=>{
            return {groupId: "g-1", touchstoneId: "t-1", scenarioId: "s-1", estimateSetId: "e-1"};
        });

        const data = {
            type: {
                type: "central-averaged",
                details: "test"
            }
        } as EstimatesCreateBurdenData;

        store.dispatch(estimatesActionCreators.createBurden(data));
        setTimeout(() => {
            const actions = store.getActions()
            const expectedPayload = [
                { type: ResponsibilitiesTypes.SET_RESPONSIBILITIES, data: testExtResponsibilitySet},
                { type: ResponsibilitiesTypes.SET_CURRENT_RESPONSIBILITY, data: testResponsibility},
                { type: EstimatesTypes.ESTIMATES_ONE_TIME_TOKEN_CLEAR},
                { type: EstimatesTypes.ESTIMATES_ONE_TIME_TOKEN_FETCHED, data: 'test-token' }
            ];
            expect(actions).to.eql(expectedPayload);
            done();
        });
    });

});