import {mockOnetimeTokenState} from "../../mocks/mockStates";
import {onetimeTokenReducer} from "../../../main/shared/reducers/oneTimeTokenReducer";
import {OnetimeTokenActionType} from "../../../main/shared/actionTypes/OnetimeTokenActions";
import {expect} from "chai"

describe('OnetimeToken reducer tests', () => {

    it('adds token to token lookup keyed by url', () => {

        const fakeOldToken = "faketoken";
        const state = mockOnetimeTokenState({tokens: {"url": fakeOldToken}});
        const fakeNewToken = "fakenewtoken";
        const result = onetimeTokenReducer(state, {
            type: OnetimeTokenActionType.TOKEN_FETCHED, data: {
                url: "some/url", token: fakeNewToken
            }
        });

        expect(result.tokens["url"]).to.eq(fakeOldToken);
        expect(result.tokens["some/url"]).to.eq(fakeNewToken);

    });
});