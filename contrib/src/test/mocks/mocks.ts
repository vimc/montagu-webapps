import { Location } from "simple-react-router";
import * as models from "../../main/models/Generated";
import { alt } from "../../main/alt";
import { makeLookup } from "../../main/stores/MainStore";

export function mockLocation<T>(params?: T): Location<T> {
    return {
        hash: "hash",
        params: params || null,
        pathName: "/some/path",
        query: null
    };
}

export function setupMainStore(diseases: models.Disease[]) {
    alt.bootstrap(JSON.stringify({
        MainStore: {
            diseases: makeLookup(diseases)
        }
    }));
}

export function mockEvent() {
    return {
        preventDefault: () => {
        }
    };
}