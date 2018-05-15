// Code generated by a tool.
// Run `npm run generate-models` to regenerate

export interface AssociateRole {
    action: string;
    name: string;
    scope_id: string | null;
    scope_prefix: string | null;
}

export interface AssociateUser {
    action: string;
    username: string;
}

export type ActivityType = "none" | "routine" | "campaign" | "campaign-reactive";

export type GAVISupportLevel = "no vaccine" | "no gavi" | "total" | "hold2010" | "bestminus";

export interface CoverageSet {
    activity_type: ActivityType;
    gavi_support: GAVISupportLevel;
    id: number;
    name: string;
    touchstone: string;
    vaccine: string;
}

export interface Disease {
    id: string;
    name: string;
}

export interface DemographicDataset {
    gender_is_applicable: boolean;
    id: string;
    name: string;
    source: string;
}

export interface ModellingGroup {
    description: string;
    id: string;
}

export interface ResearchModel {
    citation: string;
    description: string;
    id: string;
    modelling_group: string;
}

export interface ModellingGroupDetails {
    description: string;
    id: string;
    members: string[];
    models: ResearchModel[];
}

export interface ModelRunParameterSet {
    disease: string;
    id: number;
    model: string;
    uploaded_by: string;
    uploaded_on: string;
}

export interface Report {
    display_name: string | null;
    latest_version: string;
    name: string;
    published: boolean;
    author: string | null;
    requester: string | null;
    updated_on: string;
}

export type BurdenEstimateSetStatus = "empty" | "partial" | "complete";

export type BurdenEstimateSetTypeCode = "central-single-run" | "central-averaged" | "central-unknown" | "stochastic";

export interface BurdenEstimateSetType {
    details: string | null;
    type: BurdenEstimateSetTypeCode;
}

export interface BurdenEstimateSet {
    id: number;
    problems: string[];
    status: BurdenEstimateSetStatus;
    type: BurdenEstimateSetType;
    uploaded_by: string;
    uploaded_on: string;
}

export interface Scenario {
    description: string;
    disease: string;
    id: string;
    touchstones: string[];
}

export type ResponsibilityStatus = "empty" | "invalid" | "valid";

export interface Responsibility {
    current_estimate_set: BurdenEstimateSet | null;
    problems: string[];
    scenario: Scenario;
    status: ResponsibilityStatus;
}

export type ResponsibilitySetStatus = "not-applicable" | "incomplete" | "submitted" | "approved";

export interface Responsibilities {
    problems: string;
    responsibilities: Responsibility[];
    status: ResponsibilitySetStatus | null;
    touchstone: string;
}

export interface ErrorInfo {
    code: string;
    message: string;
}

export type ResultStatus = "success" | "failure";

export interface Result {
    data: any;
    errors: ErrorInfo[];
    status: ResultStatus;
}

export interface ScenarioAndCoverageSets {
    coverage_sets: CoverageSet[];
    scenario: Scenario;
}

export type TouchstoneStatus = "in-preparation" | "open" | "finished";

export interface Touchstone {
    description: string;
    id: string;
    name: string;
    status: TouchstoneStatus;
    version: number;
}

export interface ScenarioTouchstoneAndCoverageSets {
    coverage_sets: CoverageSet[];
    scenario: Scenario;
    touchstone: Touchstone;
}

export interface RoleAssignment {
    name: string;
    scope_id: string | null;
    scope_prefix: string | null;
}

export interface User {
    email: string;
    last_logged_in: string;
    name: string;
    roles: RoleAssignment[] | null;
    username: string;
}