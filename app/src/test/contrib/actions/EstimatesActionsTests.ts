import {expect} from "chai";

import {Sandbox} from "../../Sandbox";
import {estimatesActionCreators} from "../../../main/contrib/actions/estimatesActionCreators";
import {EstimatesService} from "../../../main/contrib/services/EstimatesService";
import {ResponsibilitiesService} from "../../../main/contrib/services/ResponsibilitiesService";
import {createMockContribStore} from "../../mocks/mockStore";
import {mapStateToPropsHelper} from "../../../main/contrib/helpers/mapStateToPropsHelper";
import {mockModellingGroup, mockResponsibilitySetWithExpectations, mockTouchstone} from "../../mocks/mockModels";
import {ExtendedResponsibilitySet} from "../../../main/contrib/models/ResponsibilitySet";
import {ResponsibilitiesTypes} from "../../../main/contrib/actionTypes/ResponsibilitiesTypes";
import {CreateBurdenEstimateSet, ErrorInfo, Result, ResultStatus} from "../../../main/shared/models/Generated";
import {BurdenOutcome, EstimateTypes} from "../../../main/contrib/actionTypes/EstimateTypes";
import {responsibilitiesActionCreators} from "../../../main/contrib/actions/responsibilitiesActionCreators";

describe("Estimates actions tests", () => {
    const sandbox = new Sandbox();

    const testTouchstone = mockTouchstone();
    const testTouchstoneVersion = testTouchstone.versions[0];
    const testGroup = mockModellingGroup();
    const testResponsibilitySet = mockResponsibilitySetWithExpectations();
    const testExtResponsibilitySet = new ExtendedResponsibilitySet(testResponsibilitySet, testTouchstoneVersion, testGroup);
    const testResponsibility = testExtResponsibilitySet.responsibilities[0];

    const createStore = () => {
        return createMockContribStore({
            groups: {currentUserGroup: testGroup},
            touchstones: {currentTouchstoneVersion: testTouchstoneVersion},
            responsibilities: {
                currentResponsibility: testResponsibility,
                responsibilitiesSet: testExtResponsibilitySet
            }
        });
    };

    afterEach(() => {
        sandbox.restore();
    });

    it("creates set chart type action", async () => {
        const store = createStore();

        await store.dispatch(estimatesActionCreators.setChartType(BurdenOutcome.CASES));

        const actions = store.getActions();
        const expectedPayload = [
            {
                type: EstimateTypes.SET_CHART_TYPE,
                data: BurdenOutcome.CASES
            }
        ];
        expect(actions).to.eql(expectedPayload);
    });

    it("gets burden estimates and dispatches action containing data, type and set id", async () => {

        const store = createStore();
        const getEstimatesEndpoint = sandbox.setStubFunc(EstimatesService.prototype, "getEstimates", () => {
            return Promise.resolve("TEST");
        });

        const setId = 11;
        const outcome = BurdenOutcome.DEATHS;

        await store.dispatch(estimatesActionCreators.getEstimates(outcome, "YF-routine", setId));

        const actions = store.getActions();
        const expectedPayload = [
            {
                type: EstimateTypes.BURDEN_ESTIMATES_FETCHED,
                data: {burdens: "TEST", type: outcome, setId: setId}
            }
        ];
        expect(actions).to.eql(expectedPayload);
        expect(getEstimatesEndpoint.calledOnce).to.be.true;

    });

    it("creates burden", (done: DoneCallback) => {
        const store = createStore();
        const createBurdenEndpoint = sandbox.setStubFunc(EstimatesService.prototype, "createBurden", () => {
            return Promise.resolve();
        });
        sandbox.setStubFunc(ResponsibilitiesService.prototype, "clearCacheForResponsibilities", () => {
            return Promise.resolve();
        });
        sandbox.setStubFunc(ResponsibilitiesService.prototype, "getResponsibilities", () => {
            return Promise.resolve(testResponsibilitySet);
        });
        sandbox.setStubFunc(mapStateToPropsHelper, "getResponsibilityIds", () => {
            return {groupId: "g-1", touchstoneId: "t-1", scenarioId: "s-1", estimateSetId: "e-1"};
        });

        const data: CreateBurdenEstimateSet = {
            type: {
                type: "central-averaged",
                details: "test"
            },
            model_run_parameter_set: null
        };

        store.dispatch(estimatesActionCreators.createBurden(data));

        setTimeout(() => {
            const actions = store.getActions();
            const expectedPayload = [
                {type: ResponsibilitiesTypes.SET_RESPONSIBILITIES, data: testExtResponsibilitySet},
                {type: ResponsibilitiesTypes.SET_CURRENT_RESPONSIBILITY, data: testResponsibility}
            ];
            expect(actions).to.eql(expectedPayload);
            expect(createBurdenEndpoint.calledOnce).to.be.true;
            done();
        })

    });

    describe("populating estimate sets", () => {

        it("setStatus is complete if estimates populated without error", async () => {
            const store = createStore();

            sandbox.setStubFunc(mapStateToPropsHelper, "getResponsibilityIds", () => {
                return {groupId: "g-1", touchstoneId: "t-1", scenarioId: "s-1", estimateSetId: "e-1"};
            });

            sandbox.setStubFunc(EstimatesService.prototype, "populateEstimatesFromFile", () => {
                return Promise.resolve("OK");
            });

            sandbox.setStubReduxAction(responsibilitiesActionCreators, "refreshResponsibilities");

            await store.dispatch(estimatesActionCreators.populateEstimateSet("token"));

            const actions = store.getActions();
            const expectedPayload = [
                {
                    type: EstimateTypes.POPULATING_ESTIMATES,
                    data: true
                },
                {
                    type: EstimateTypes.ESTIMATE_SET_POPULATED,
                    data: {setStatus: "complete", errors: [] as ErrorInfo[]}
                },
                {
                    type: "test"
                }
            ];
            expect(actions).to.eql(expectedPayload);
        });

        it("setStatus is invalid if there is a missing rows error", async () => {
            const store = createStore();

            sandbox.setStubFunc(mapStateToPropsHelper, "getResponsibilityIds", () => {
                return {groupId: "g-1", touchstoneId: "t-1", scenarioId: "s-1", estimateSetId: "e-1"};
            });
            sandbox.setStubFunc(EstimatesService.prototype, "populateEstimatesFromFile", () => {
                return Promise.resolve({ status: "failure", errors: [{code: "missing-rows", message: "TEST"}]});
            });

            sandbox.setStubReduxAction(responsibilitiesActionCreators, "refreshResponsibilities");

            await store.dispatch(estimatesActionCreators.populateEstimateSet("token"));

            const actions = store.getActions();
            const expectedPayload = [
                {
                    type: EstimateTypes.POPULATING_ESTIMATES,
                    data: true
                },
                {
                    type: EstimateTypes.ESTIMATE_SET_POPULATED,
                    data: {setStatus: "invalid", errors: [{code: "missing-rows", message: "TEST"}]}
                },
                {
                    type: "test"
                }
            ];
            expect(actions).to.eql(expectedPayload);
        });

        it("setStatus is empty if there is an unexpected error", async () => {
            const store = createStore();

            sandbox.setStubFunc(mapStateToPropsHelper, "getResponsibilityIds", () => {
                return {groupId: "g-1", touchstoneId: "t-1", scenarioId: "s-1", estimateSetId: "e-1"};
            });
            sandbox.setStubFunc(EstimatesService.prototype, "populateEstimatesFromFile", () => {
                return Promise.resolve({ status: "failure", errors: [{code: "e-code", message: "TEST"}]});
            });

            sandbox.setStubReduxAction(responsibilitiesActionCreators, "refreshResponsibilities");

            await store.dispatch(estimatesActionCreators.populateEstimateSet("token"));

            const actions = store.getActions();
            const expectedPayload = [
                {
                    type: EstimateTypes.POPULATING_ESTIMATES,
                    data: true
                },
                {
                    type: EstimateTypes.ESTIMATE_SET_POPULATED,
                    data: {setStatus: "empty", errors: [{code: "e-code", message: "TEST"}]}
                },
                {
                    type: "test"
                }
            ];
            expect(actions).to.eql(expectedPayload);
        });

        it("refreshes responsibilities after set population", async () => {
            const store = createStore();

            sandbox.setStubFunc(mapStateToPropsHelper, "getResponsibilityIds", () => {
                return {groupId: "g-1", touchstoneId: "t-1", scenarioId: "s-1", estimateSetId: "e-1"};
            });
            sandbox.setStubFunc(EstimatesService.prototype, "populateEstimatesFromFile", () => {
                return Promise.resolve({ status: "failure", errors: [{code: "e-code", message: "TEST"}]});
            });

            const refreshResponsibilitiesStub = sandbox.setStubReduxAction(responsibilitiesActionCreators, "refreshResponsibilities");

            await store.dispatch(estimatesActionCreators.populateEstimateSet("token"));

            expect(refreshResponsibilitiesStub.called).to.be.true;
        });

        it("can reset PopulateState", () => {
            const result = estimatesActionCreators.resetPopulateState();
            expect(result.type).to.eq(EstimateTypes.RESET_POPULATE_STATE);
            expect(result.data).to.be.true;
        });

        it("can get upload token", async () => {
            const store = createStore();

            sandbox.setStubFunc(mapStateToPropsHelper, "getResponsibilityIds", () => {
                return {groupId: "g-1", touchstoneId: "t-1", scenarioId: "s-1", estimateSetId: "e-1"};
            });
            sandbox.setStubFunc(EstimatesService.prototype, "getUploadToken", () => {
                return Promise.resolve("TOKEN");
            });

            await store.dispatch(estimatesActionCreators.getUploadToken());

            const actions = store.getActions();
            const expectedPayload = [
                {
                    type: EstimateTypes.UPLOAD_TOKEN_FETCHED,
                    data: "TOKEN"
                }
            ];
            expect(actions).to.eql(expectedPayload);
        })

    });

});