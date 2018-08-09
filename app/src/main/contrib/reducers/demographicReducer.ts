import {DemographicDataset} from "../../shared/models/Generated";
import {Demographic, DemographicAction, DemographicTypes} from "../actionTypes/DemographicTypes";

export interface DemographicState {
    dataSets: DemographicDataset[];
    selectedDataSet: DemographicDataset;
    selectedGender: string;
    selectedFormat: string;
}

export const demographicInitialState: DemographicState = {
    dataSets: [],
    selectedDataSet: null,
    selectedGender: Demographic.SelectedGender.both,
    selectedFormat: Demographic.SelectedFormat.long
};

export const demographicReducer = (state = demographicInitialState, action: DemographicAction) => {
    switch (action.type) {
        case DemographicTypes.DEMOGRAPHIC_DATA_SETS_FETCHED:
            return {...state, dataSets: action.data ? action.data : [] };
        case DemographicTypes.DEMOGRAPHIC_SET_DATA_SET:
            return {...state, selectedDataSet: action.data };
        case DemographicTypes.DEMOGRAPHIC_SET_GENDER:
            return {...state, selectedGender: action.data ? action.data : Demographic.SelectedGender.both};
        case DemographicTypes.DEMOGRAPHIC_SET_FORMAT:
            return {...state, selectedFormat: action.data ? action.data : Demographic.SelectedFormat.long };
        default:
            return state;
    }
};

