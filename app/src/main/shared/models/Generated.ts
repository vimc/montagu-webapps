// Code generated by a tool.
// Run `npm run generate-models` to regenerate

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
    countries: string[]; //deprecated
    gender_is_applicable: boolean;
    id: string;
    name: string;
    source: string;
    sources: string[]; //deprecated
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

export interface TemporalAccessor {
}

export interface Temporal extends TemporalAccessor {
}

export interface TemporalAdjuster {
}

export interface Instant extends Temporal, TemporalAdjuster {
}

export interface BurdenEstimateSet {
    id: number;
    problems: string[];
    uploaded_on: Instant;
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

export type ResponsibilitySetStatus = "incomplete" | "submitted" | "approved";

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
    last_logged_in: Instant | null;
    name: string;
    roles: RoleAssignment[] | null;
    username: string;
}

export interface AssociateUser {
    action: string;
    username: string;
}

export interface AssociateRole {
    action: string;
    name: string;
    scope_id: string | null;
    scope_prefix: string | null;
}