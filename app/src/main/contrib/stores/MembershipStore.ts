import { AbstractStore, makeStore } from "../../shared/stores/AbstractStore";
import { alt } from "../../shared/alt";

export interface MembershipState {

}

interface Interface extends AltJS.AltStore<MembershipState> {

}

class MembershipStore extends AbstractStore<MembershipState, Interface> {
    constructor() {
        super();

    }

    initialState(): MembershipState {
        return {};
    }
}

export const membershipStore = makeStore(alt, MembershipStore);