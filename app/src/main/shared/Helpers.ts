import {jwtDecoder} from "./sources/JwtDecoder";
import {Result} from "./models/Generated";
import * as url from "url";
import * as querystring from "querystring";
import * as moment from "moment";
import {settings} from "./Settings";

export function doNothing() {

}

// This allows us to make sure the dispatch doesn't get added to the props
// which makes the tests easier to reason about
export function discardDispatch<T>(dispatch: any, props: T): T {
    return props;
}

export function titleCase(str: string) {
    if (!str) {
        return str;
    }

    return str.toLowerCase().split(' ').map(function(word) {
        return (word.charAt(0).toUpperCase() + word.slice(1));
    }).join(' ');
}

export function encodeFilename(filename: string) {
    const forwardSlashRegex = new RegExp("/", "g");
    return filename.replace(forwardSlashRegex, ":");
}

export function shortTimestamp(date: Date) {
    const hours = padZero(date.getHours());
    const minutes = padZero(date.getMinutes());
    return `${moment(date).format("MMM DD YYYY")}, ${hours}:${minutes}`;
}

export function longTimestamp(date: Date) {
    const hours = padZero(date.getHours());
    const minutes = padZero(date.getMinutes());
    return `${longDate(date)}, ${hours}:${minutes}`;
}

export function longestTimestamp(date: Date) {
    const hours = padZero(date.getHours());
    const minutes = padZero(date.getMinutes());
    const seconds = padZero(date.getSeconds());
    return `${longDate(date)}, ${hours}:${minutes}:${seconds}`;
}

// We use this format as it is unambiguous between USA and UK
export function longDate(date: Date) {
    return date.toDateString();
}

export function padZero(number: number) {
    // This always sticks a zero on the front and then takes the last two digits
    return ('0' + number).slice(-2);
}

export function roundToOneDecimalPlace(number: number) {
    return Math.round(number * 10) / 10
}

export const helpers = {
    queryStringAsObject(): any {
        const obj = {} as any;
        location.search.substr(1).split("&").forEach(item => {
            const parts = item.split("=");
            const key = parts[0];
            let value = parts[1];
            // decodeURIComponent(undefined) returns string "undefined".
            // `value &&` ensures that decodeURIComponent() is not called on undefined values
            value = value && decodeURIComponent(value);
            obj[key] = value;
        });
        return obj;
    },
    removeQueryString() {
        history.replaceState({}, document.title, helpers.urlWithoutQueryString(location.href));
    },
    urlWithoutQueryString(uri: string): string {
        const parsed = url.parse(uri, true);
        parsed.query = null;
        // we need to rebuild `search` now as it gets used by `format` under the hood
        parsed.search = querystring.stringify(parsed.query);
        return url.format(parsed);
    },
    getCurrentLocation(): string {
        return window.location.href;
    },
    redirectToMontaguLogin() {
        window.location.href = settings.montaguUrl() + `?redirectTo=${window.location.href}`;
    }
};