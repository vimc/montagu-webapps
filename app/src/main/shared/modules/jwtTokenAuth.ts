import {parseRole, Role} from "../models/Roles";
import {AuthState} from "../reducers/authReducer";
import * as pako from "pako";

const jwt_decode = require('jwt-decode');

export interface AuthTokenData {
    permissions: string;
    roles: string;
    sub: string;
    exp: number;
}

export const jwtTokenAuth = {

    isExpired(expireTime: number) {
        const now = new Date();
        // If the token has already expired
        const futureDate = new Date(now.getTime() + (5 * 60 * 1000));
        if (!expireTime || futureDate > new Date(expireTime * 1000)) {
            return true;
        }
        return false;
    },

    decodeToken(token: string): AuthTokenData {
        try {
            return jwt_decode(token);
        } catch (e) {
            console.log("Token decoding failed, token is malformed: " + token);
            return this.emptyTokenData();
        }
    },

    inflateToken(token: string): string {
        // https://stackoverflow.com/a/44528376/777939
        const decoded = atob(token.replace(/_/g, '/').replace(/-/g, '+'));
        return pako.inflate(decoded, {to: 'string'});
    },

    emptyTokenData(): AuthTokenData {
        return {
            permissions: "",
            roles: "",
            sub: null,
            exp: null
        };
    },

    parseModellingGroups(roles: string): string[] {
        return roles
            .split(",")
            .map((x: string) => parseRole(x))
            .filter((x: Role) => x.name == "member" && x.scope.prefix == "modelling-group")
            .map((x: Role) => x.scope.id);
    },

    getDataFromCompressedToken(token: string): AuthState {
        const inflated = this.inflateToken(token);
        return this.getDataFromToken(inflated);
    },

    getDataFromToken(token: string): AuthState {
        const decoded = this.decodeToken(token);
        const permissions = decoded.permissions.split(",").filter((x: string) => x.length > 0);
        const modellingGroups = this.parseModellingGroups(decoded.roles);
        return {
            loggedIn: true,
            bearerToken: token,
            isAccountActive: permissions.some((x: string) => x == "*/can-login"),
            isModeller: modellingGroups.length > 0,
            username: decoded.sub,
            permissions,
            modellingGroups,
            isReportReviewer: permissions.indexOf("*/reports.review") > -1
        }
    }
}