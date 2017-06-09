export interface ILoadable<T> {
    content: { [index: string]: T };
    loaded: boolean;
}

export function emptyLookup<T>(): ILoadable<T> {
    return {
        content: null,
        loaded: false
    };
}

export function makeLookup<T extends HasId>(items: T[]) {
    const content: { [index: string]: T } = {};
    if (items) {
        items.forEach(x => {
            content[x.id] = x;
        });
    }
    return {
        content,
        loaded: true
    };
}

export function getFromLookup<T>(lookup: ILoadable<T>, index: string) {
    if (lookup.loaded) {
        if (lookup.content.hasOwnProperty(index)) {
            return lookup.content[index];
        } else {
            return null;
        }
    } else {
        console.warn(`Attempted to retrieve '${index}' from unloaded lookup`);
        return null;
    }
}