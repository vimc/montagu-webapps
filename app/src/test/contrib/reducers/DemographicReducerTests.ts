import { expect } from "chai";

import {mockDemographicDataset} from "../../mocks/mockModels";
import {Demographic, DemographicTypes} from "../../../main/shared/actionTypes/DemographicTypes";
import {demographicsInitialState, demographicsReducer} from "../../../main/shared/reducers/demographicsReducer";

describe('Demographic reducer tests', () => {

    const testDemographicDataSet = mockDemographicDataset({id: 'type-1'});

    test('sets fetched data sets', () => {
        expect(demographicsReducer(undefined, {
            type: DemographicTypes.DEMOGRAPHIC_DATA_SETS_FETCHED,
            data: [testDemographicDataSet]
        })).to.eql({...demographicsInitialState, dataSets: [testDemographicDataSet]});
    });

    test('sets fetched empty data sets', () => {
        expect(demographicsReducer(undefined, {
            type: DemographicTypes.DEMOGRAPHIC_DATA_SETS_FETCHED,
            data: null
        })).to.eql(demographicsInitialState);
    });

    test('sets selected data sets', () => {
        expect(demographicsReducer(undefined, {
            type: DemographicTypes.DEMOGRAPHIC_SET_DATA_SET,
            data: testDemographicDataSet
        })).to.eql({...demographicsInitialState, selectedDataSet: testDemographicDataSet});
    });

    test('sets empty selected data sets', () => {
        expect(demographicsReducer(undefined, {
            type: DemographicTypes.DEMOGRAPHIC_SET_DATA_SET,
            data: null
        })).to.eql(demographicsInitialState);
    });

    test('sets selected format', () => {
        expect(demographicsReducer(undefined, {
            type: DemographicTypes.DEMOGRAPHIC_SET_FORMAT,
            data: Demographic.SelectedFormat.wide
        })).to.eql({...demographicsInitialState, selectedFormat: 'wide'});
    });

    test('sets selected empty format', () => {
        expect(demographicsReducer(undefined, {
            type: DemographicTypes.DEMOGRAPHIC_SET_FORMAT,
            data: null
        })).to.eql(demographicsInitialState);
    });

    test('sets selected gender', () => {
        expect(demographicsReducer(undefined, {
            type: DemographicTypes.DEMOGRAPHIC_SET_GENDER,
            data: Demographic.SelectedGender.female
        })).to.eql({...demographicsInitialState, selectedGender: 'female'});
    });

    test('sets selected empty gender', () => {
        expect(demographicsReducer(undefined, {
            type: DemographicTypes.DEMOGRAPHIC_SET_GENDER,
            data: null
        })).to.eql(demographicsInitialState);
    });
});