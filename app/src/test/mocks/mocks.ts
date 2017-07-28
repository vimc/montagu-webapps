import { Location } from "simple-react-router";
import * as models from "../../main/shared/models/Generated";
import { alt } from "../../main/shared/alt";
import { makeLoadable } from "../../main/contrib/stores/Loadable";
import { ILookup } from "../../main/shared/models/Lookup";

export function mockLocation<T>(params?: T): Location<T> {
    return {
        hash: "hash",
        params: params || null,
        pathName: "/some/path",
        query: null
    };
}

export function setupMainStore(config: {
    diseases?: models.Disease[],
    groups?: models.ModellingGroup[]
})
{
    alt.bootstrap(JSON.stringify({
        MainStore: {
            diseases: makeLoadable<models.Disease>(config.diseases),
            modellingGroups: makeLoadable<models.ModellingGroup>(config.groups),
        }
    }));
}

export function mockEvent() {
    return {
        preventDefault: () => {
        }
    };
}

export function withMockLocalStorage(contents: ILookup<string>, test: () => void) {
    const mutableGlobal = global as any;
    mutableGlobal.Storage = true;
    mutableGlobal.localStorage = {
        getItem: function (key: string) {
            return contents[key];
        },
        setItem: function (key: string, value: any) {
            contents[key] = value;
        },
        removeItem: function (key: string) {
            delete contents[key];
        },
        clear: function() {
            contents = {};
        }
    };
    try {
        test()
    } finally {
        delete mutableGlobal.Storage;
        delete mutableGlobal.localStorage;
    }
}