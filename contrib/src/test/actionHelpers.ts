import * as sinon from "sinon";
import { expect } from "chai";
import { alt } from "../main/alt";

export interface ActionExpectation {
    action: string;
    // Leave payload off to not make an assertion about it
    payload?: any;
}

export interface Action {
    action: string;
    payload: any;
}

export function getActions(spy: sinon.SinonSpy): Action[] {
    return spy.args.map(action => {
        if (typeof(action[0]) == "string") {
            return { action: action[0], payload: action[1] };
        } else {
            return { action: action[0].type, payload: action[0].payload };
        }
    });
}

export function expectOrderedActions(spy: sinon.SinonSpy, expectations: Array<ActionExpectation>, startIndex: number = 0) {
    const actual = getActions(spy);
    //actual.forEach((e, i) => console.log(`${i}: ${JSON.stringify(e)}`));

    expectations.forEach((value, index) => {
        const realIndex = startIndex + index;
        const event = actual[realIndex];
        expect(event).is.not.equal(undefined, `Expected this ${realIndex}th event: ${value.action}`);
        expect(event.action).to.equal(value.action);
        if (value.hasOwnProperty("payload")) {
            expect(event.payload).to.eql(value.payload,
                `Expected payload for event ${realIndex}, which was ${JSON.stringify(event.payload)}, to match ${JSON.stringify(value.payload)}`);
        }
    });
}

export function expectOneAction(spy: sinon.SinonSpy, expectation: ActionExpectation, startIndex: number = 0) {
    expectOrderedActions(spy, [ expectation ], startIndex);
}

export function dispatchSpy(): sinon.SinonSpy {
    return sinon.spy(alt, "dispatch");
}

export function restoreDispatch() {
    const dispatch = alt.dispatch;
    if (isSpy(dispatch)) {
        dispatch.restore();
    }
}

function isSpy(x: any): x is sinon.SinonSpy {
    return x.hasOwnProperty("restore");
}