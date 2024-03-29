import {
    ErrorInfo,
    ResponsibilitySetWithComments,
    ResponsibilitySetWithExpectations,
    Touchstone,
    TouchstoneVersion
} from "../models/Generated";
import {AnnotatedResponsibility, AnnotatedResponsibilitySet} from "../../admin/models/AnnotatedResponsibility";

export enum TouchstoneTypes {
    ALL_TOUCHSTONES_FETCHED = "ALL_TOUCHSTONES_FETCHED",
    RESPONSIBILITIES_FOR_TOUCHSTONE_VERSION_FETCHED = "RESPONSIBILITIES_FOR_TOUCHSTONE_VERSION_FETCHED",
    RESPONSIBILITY_COMMENTS_FOR_TOUCHSTONE_VERSION_FETCHED = "RESPONSIBILITY_COMMENTS_FOR_TOUCHSTONE_VERSION_FETCHED",
    SET_CURRENT_TOUCHSTONE_RESPONSIBILITY = "SET_CURRENT_TOUCHSTONE_RESPONSIBILITY",
    SET_CURRENT_TOUCHSTONE_RESPONSIBILITY_SET = "SET_CURRENT_TOUCHSTONE_RESPONSIBILITY_SET",
    TOUCHSTONES_FETCHED_FOR_GROUP = "TOUCHSTONES_FETCHED_FOR_GROUP",
    SET_CURRENT_TOUCHSTONE_VERSION = "SET_CURRENT_TOUCHSTONE_VERSION",
    NEW_TOUCHSTONE_CREATED = "NEW_TOUCHSTONE_CREATED",
    SET_CREATE_TOUCHSTONE_ERROR = "SET_CREATE_TOUCHSTONE_ERROR",
    SET_CURRENT_TOUCHSTONE = "SET_CURRENT_TOUCHSTONE",
}

export interface AllTouchstonesFetched {
    type: TouchstoneTypes.ALL_TOUCHSTONES_FETCHED;
    data: Touchstone[];
}

export interface TouchstonesFetchedForGroup {
    type: TouchstoneTypes.TOUCHSTONES_FETCHED_FOR_GROUP;
    data: Touchstone[];
}

export interface SetCurrentTouchstone {
    type: TouchstoneTypes.SET_CURRENT_TOUCHSTONE;
    data: Touchstone;
}

export interface SetCurrentTouchstoneVersion {
    type: TouchstoneTypes.SET_CURRENT_TOUCHSTONE_VERSION;
    data: TouchstoneVersion;
}

export interface ResponsibilitiesForTouchstoneVersionFetched {
    type: TouchstoneTypes.RESPONSIBILITIES_FOR_TOUCHSTONE_VERSION_FETCHED;
    data: ResponsibilitySetWithExpectations[];
}

export interface ResponsibilityCommentsForTouchstoneVersionFetched {
    type: TouchstoneTypes.RESPONSIBILITY_COMMENTS_FOR_TOUCHSTONE_VERSION_FETCHED;
    data: ResponsibilitySetWithComments[];
}

export interface SetCurrentTouchstoneResponsibility {
    type: TouchstoneTypes.SET_CURRENT_TOUCHSTONE_RESPONSIBILITY;
    data: AnnotatedResponsibility;
}

export interface SetCurrentTouchstoneResponsibilitySet {
    type: TouchstoneTypes.SET_CURRENT_TOUCHSTONE_RESPONSIBILITY_SET;
    data: AnnotatedResponsibilitySet;
}

export interface NewTouchstoneCreated {
    type: TouchstoneTypes.NEW_TOUCHSTONE_CREATED;
    data: Touchstone;
}

export interface SetCreateTouchstoneError {
    type: TouchstoneTypes.SET_CREATE_TOUCHSTONE_ERROR;
    data: ErrorInfo[];
}

export type TouchstonesAction =
    | AllTouchstonesFetched
    | TouchstonesFetchedForGroup
    | SetCurrentTouchstone
    | SetCurrentTouchstoneVersion
    | ResponsibilitiesForTouchstoneVersionFetched
    | ResponsibilityCommentsForTouchstoneVersionFetched
    | SetCurrentTouchstoneResponsibility
    | SetCurrentTouchstoneResponsibilitySet
    | NewTouchstoneCreated
    | SetCreateTouchstoneError
