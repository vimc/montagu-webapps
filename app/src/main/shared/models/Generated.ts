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

export interface CohortRestriction {
    maximum_birth_year: number | null;
    minimum_birth_year: number | null;
}

export type ActivityType = "none" | "routine" | "campaign" | "campaign-reactive";

export type GAVISupportLevel = "no vaccine" | "no gavi" | "total" | "high" | "low" | "bestcase" | "hold2010" | "bestminus";

export interface CoverageSet {
    activity_type: ActivityType;
    gavi_support: GAVISupportLevel;
    id: number;
    name: string;
    touchstone_version: string;
    vaccine: string;
}

export interface Country {
    id: string;
    name: string;
}

export type BurdenEstimateSetTypeCode = "central-single-run" | "central-averaged" | "central-unknown" | "stochastic";

export interface BurdenEstimateSetType {
    details: string | null;
    type: BurdenEstimateSetTypeCode;
}

export interface CreateBurdenEstimateSet {
    model_run_parameter_set: number | null;
    type: BurdenEstimateSetType;
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

export interface NumberRange {
    maximum_inclusive: number;
    minimum_inclusive: number;
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

export interface ModellingGroupCreation {
    description: string;
    id: string;
    institution: string;
    pi: string;
}

export interface ModelRunParameterSet {
    disease: string;
    id: number;
    model: string;
    uploaded_by: string;
    uploaded_on: string;
}

export interface ReportVersion {
    author: string;
    date: string;
    display_name: string | null;
    id: string;
    latest_version: string;
    name: string;
    published: boolean;
    requester: string;
}

export interface ReportVersionDetails {
    author: string;
    comment: string;
    date: string;
    description: string;
    display_name: string | null;
    hash_script: string | null;
    id: string;
    name: string;
    published: boolean;
    requester: string;
    script: string | null;
}

export interface Expectations {
    ages: NumberRange;
    cohorts: CohortRestriction;
    countries: Country[];
    description: string;
    id: number;
    outcomes: string[];
    years: NumberRange;
}

export interface ExpectationMapping {
    applicable_scenarios: string[];
    disease: string;
    expectation: Expectations;
}

export type BurdenEstimateSetStatus = "empty" | "partial" | "complete" | "invalid";

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

export interface ResponsibilitySetWithExpectations {
    expectations: ExpectationMapping[];
    modelling_group_id: string;
    responsibilities: Responsibility[];
    status: ResponsibilitySetStatus | null;
    touchstone_version: string;
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
    coverage_sets: CoverageSet[] | null;
    scenario: Scenario;
}

export type TouchstoneStatus = "in-preparation" | "open" | "finished";

export interface TouchstoneVersion {
    description: string;
    id: string;
    name: string;
    status: TouchstoneStatus;
    version: number;
}

export interface ScenarioTouchstoneAndCoverageSets {
    coverage_sets: CoverageSet[] | null;
    scenario: Scenario;
    touchstone_version: TouchstoneVersion;
}

export interface Touchstone {
    comment: string;
    description: string;
    id: string;
    versions: TouchstoneVersion[];
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