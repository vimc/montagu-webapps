import {expect} from "chai";

import {estimatesInitialState, estimatesReducer} from "../../../main/contrib/reducers/estimatesReducer";
import {BurdenOutcome, EstimateTypes} from "../../../main/contrib/actionTypes/EstimateTypes";

describe('Estimates reducer tests', () => {

    const fakeBurdens = {"2000": [{"x": 1, "y": 10000}]};
    const makeFakeData = (outcome: BurdenOutcome) => {
        return {
            setId: 2,
            burdens: fakeBurdens,
            type: outcome
        };
    };

    test('adds deaths to estimates lookup', () => {

        const fakeData = makeFakeData(BurdenOutcome.DEATHS);

        const result = estimatesReducer(estimatesInitialState, {
            type: EstimateTypes.BURDEN_ESTIMATES_FETCHED,
            data: fakeData
        });

        expect(Object.keys(result.deaths)).to.have.lengthOf(1);
        expect(result.deaths[2]).to.eq(fakeBurdens);
        expect(result.dalys).to.be.null;
        expect(result.cases).to.be.null;
    });

    test('adds cases to estimates lookup', () => {

        const fakeData = makeFakeData(BurdenOutcome.CASES);

        const result = estimatesReducer(estimatesInitialState, {
            type: EstimateTypes.BURDEN_ESTIMATES_FETCHED,
            data: fakeData
        });

        expect(Object.keys(result.cases)).to.have.lengthOf(1);
        expect(result.cases[2]).to.eq(fakeBurdens);
        expect(result.dalys).to.be.null;
        expect(result.deaths).to.be.null;
    });

    test('adds dalys to estimates lookup', () => {

        const fakeData = makeFakeData(BurdenOutcome.DALYS);

        const result = estimatesReducer(estimatesInitialState, {
            type: EstimateTypes.BURDEN_ESTIMATES_FETCHED,
            data: fakeData
        });

        expect(Object.keys(result.dalys)).to.have.lengthOf(1);
        expect(result.dalys[2]).to.eq(fakeBurdens);
        expect(result.deaths).to.be.null;
        expect(result.cases).to.be.null;
    });

    test('sets chart type', () => {

        const result = estimatesReducer(estimatesInitialState, {
            type: EstimateTypes.SET_CHART_TYPE,
            data: BurdenOutcome.CASES
        });

        expect(result.chartType).to.eq(BurdenOutcome.CASES);
    });

    test("records that estimate set populating in progress", () => {
        const result = estimatesReducer(estimatesInitialState, {
            type: EstimateTypes.POPULATING_ESTIMATES,
            data: true
        });

        expect(result.populatingInProgress).to.be.true;
    });

    test("sets populate state after set is populated with errors", () => {

        const mockErrors = [{code: "e", message: "e"}];
        const mockState = {...estimatesInitialState, populatingInProgress: true};
        const result = estimatesReducer(mockState, {
            type: EstimateTypes.ESTIMATE_SET_POPULATED,
            data: {setStatus: "invalid", errors: mockErrors}
        });

        expect(result.populateErrors).to.have.members(mockErrors);
        expect(result.hasPopulateSuccess).to.be.false;
        expect(result.populatingInProgress).to.be.false;
        expect(result.populatingSetId).to.be.null;
    });

    test("sets populate state after set is populated successfully", () => {

        const mockState = {
            ...estimatesInitialState,
            uploadToken: "TOKEN",
            populatingSetId: 1,
            populatingInProgress: true
        };

        const result = estimatesReducer(mockState, {
            type: EstimateTypes.ESTIMATE_SET_POPULATED,
            data: {setStatus: "complete", errors: []}
        });

        expect(result.populateErrors).to.have.lengthOf(0);
        expect(result.hasPopulateSuccess).to.be.true;
        expect(result.populatingInProgress).to.be.false;
        expect(result.populatingSetId).to.be.null;
        expect(result.uploadToken).to.be.null;
    });

    test("resets populate state", () => {

        const mockState = {
            ...estimatesInitialState,
            hasPopulateSuccess: true,
            populateErrors: [{code: "e", message: ""}],
            populatingSetId: 1,
            uploadToken: "TOKEN"
        };

        const result = estimatesReducer(mockState, {
            type: EstimateTypes.RESET_POPULATE_STATE,
            data: true
        });

        expect(result.hasPopulateSuccess).to.be.false;
        expect(result.populatingSetId).to.be.null;
        expect(result.populateErrors).to.have.lengthOf(0);
        expect(result.uploadToken).to.be.null;
    });

    test("sets upload token", () => {

        const result = estimatesReducer(estimatesInitialState, {
            type: EstimateTypes.UPLOAD_TOKEN_FETCHED,
            data: "TOKEN"
        });

        expect(result.uploadToken).to.eq("TOKEN");
    });

    test("sets populatingSetId", () => {

        const result = estimatesReducer(estimatesInitialState, {
            type: EstimateTypes.SET_CREATED,
            data: 1
        });

        expect(result.populatingSetId).to.eq(1);
    });

});