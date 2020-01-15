import {RecursivePartial} from "../../mocks/mockStates";
import {CommonState} from "../../../main/shared/reducers/CommonState";
import {AppProps, mapStateToAppProps} from "../../../main/shared/components/App";
import {initialAuthState} from "../../../main/shared/reducers/authReducer";
import {expect} from "chai";
import {mockHistory} from "../../mocks/mocks";

describe('App', () => {
    test("loggedIn is false initially", () => {
        const state: RecursivePartial<CommonState> = {
            auth: initialAuthState
        };
        const history = mockHistory();
        const expected: AppProps = {
            loggedIn: false,
            history
        };
        expect(mapStateToAppProps(state as CommonState, {history})).to.eql(expected);
    });

    test("gets loggedIn from auth state", () => {
        const state: RecursivePartial<CommonState> = {
            auth: {...initialAuthState, loggedIn: true}
        };
        const history = mockHistory();
        const expected: AppProps = {
            loggedIn: true,
            history
        };
        expect(mapStateToAppProps(state as CommonState, {history})).to.eql(expected);
    });
});