import { expect } from "chai";

import {
    modellingGroupInitialState,
    modellingGroupsReducer
} from "../../../main/contrib/reducers/modellingGroupsReducer";
import { ModellingGroupTypes } from "../../../main/contrib/actionTypes/ModellingGroupsTypes";

describe('Modelling groups reducer tests', () => {

    const testModellingGroup = {id: "test1", description: "Test 1"};

    test('sets fetched user groups', () => {
        expect(modellingGroupsReducer(undefined, {
            type: ModellingGroupTypes.USER_GROUPS_FETCHED,
            data: [testModellingGroup]
        })).to.eql({...modellingGroupInitialState, userGroups: [testModellingGroup]});
    });

    test('sets empty user groups', () => {
        expect(modellingGroupsReducer({
            userGroups: [testModellingGroup],
            currentUserGroup: null
        }, {
            type: ModellingGroupTypes.USER_GROUPS_FETCHED,
            data: []
        })).to.eql(modellingGroupInitialState);
    });

    test('sets current user group', () => {
        expect(modellingGroupsReducer(undefined, {
            type: ModellingGroupTypes.SET_CURRENT_USER_GROUP,
            data: testModellingGroup
        })).to.eql({...modellingGroupInitialState, currentUserGroup: testModellingGroup});
    });

    test('sets current empty user group', () => {
        expect(modellingGroupsReducer(undefined, {
            type: ModellingGroupTypes.SET_CURRENT_USER_GROUP,
            data: null
        })).to.eql(modellingGroupInitialState);
    });
});