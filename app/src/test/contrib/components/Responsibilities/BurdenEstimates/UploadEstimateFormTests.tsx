import * as React from "react";
import "../../../../helper";
import {
    mapDispatchToProps,
    mapStateToProps
} from "../../../../../main/contrib/components/Responsibilities/BurdenEstimates/UploadBurdenEstimatesForm";
import {mockContribState} from "../../../../mocks/mockStates";
import {Sandbox} from "../../../../Sandbox";
import {estimatesActionCreators} from "../../../../../main/contrib/actions/estimatesActionCreators";


describe("Upload Burden Estimates Form tests", () => {

    const sandbox = new Sandbox();

    afterEach(() => {
        sandbox.restore()
    });

    describe("mapStateToProps", () => {

        it("sets url if token and populatingSetId exists", () => {

            const mockState = mockContribState({estimates: {uploadToken: "TOKEN", populatingSetId: 1}});
            const result = mapStateToProps(mockState, {touchstoneId: "t1", scenarioId: "s1", groupId: "g1"});
            expect(result.url).toEqual("http://localhost:8080/v1/modelling-groups/g1/responsibilities/t1/s1/estimate-sets/1/actions/upload/TOKEN/");
        });

        it("url is null while token is null", () => {

            const mockState = mockContribState({estimates: {populatingSetId: 1}});
            const result = mapStateToProps(mockState, {touchstoneId: "t1", scenarioId: "s1", groupId: "g1"});
            expect(result.url).toBe(null);
        });

        it("url is null while populating setId is null", () => {

            const mockState = mockContribState({estimates: {uploadToken: "TOKEN"}});
            const result = mapStateToProps(mockState, {touchstoneId: "t1", scenarioId: "s1", groupId: "g1"});
            expect(result.url).toBe(null);
        });

        it("properties are set from state", () => {

            const mockState = mockContribState({
                estimates: {
                    populatingInProgress: true,
                    populateErrors: ["error" as any],
                    hasPopulateSuccess: true
                }
            });
            const result = mapStateToProps(mockState, {touchstoneId: "t1", scenarioId: "s1", groupId: "g1"});
            expect(result.populateErrors).toEqual(["error"]);
            expect(result.populatingInProgress).toBe(true);
            expect(result.hasPopulateSuccess).toBe(true);
        });

    });

    describe("mapDispatchToProps", () => {

        it("can dispatch createBurdenEstimateSet", () => {
            const dispatchStub = sandbox.createSpy();
            sandbox.setStubFunc(estimatesActionCreators, "createBurden", () => "TEST");

            const result = mapDispatchToProps(dispatchStub, {});
            result.createBurdenEstimateSet({type: "central-averaged", details: ""});

            expect(dispatchStub.mock.calls[0][0]).toBe("TEST");
        });

        it("can dispatch populateEstimateSet", () => {
            const dispatchStub = sandbox.createSpy();
            sandbox.setStubFunc(estimatesActionCreators, "populateEstimateSet", (token: String) => token);

            const result = mapDispatchToProps(dispatchStub, {});
            result.populateEstimateSet("TOKEN");

            expect(dispatchStub.mock.calls[0][0]).toBe("TOKEN");
        });

        it("can dispatch resetPopulateState", () => {
            const dispatchStub = sandbox.createSpy();
            sandbox.setStubFunc(estimatesActionCreators, "resetPopulateState", () => "TEST");

            const result = mapDispatchToProps(dispatchStub, {});
            result.resetPopulateState();

            expect(dispatchStub.mock.calls[0][0]).toBe("TEST");
        })

    });

});