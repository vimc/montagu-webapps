// Code generated by a tool.
// Run `npm run generate-models` to regenerate

export interface Scenario {
    description: string;
    disease: string;
    id: string;
    touchstones: string[];
}

export type TouchstoneStatus = "in-preparation" | "open" | "finished";

export interface YearRange {
    end: number;
    start: number;
}

export interface Touchstone {
    description: string;
    id: string;
    name: string;
    status: TouchstoneStatus;
    version: number;
    years: YearRange;
}

export interface ModellingGroup {
    description: string;
    id: string;
}

export interface BurdenEstimate {
}

export type ResponsibilityStatus = "empty" | "invalid" | "valid";

export interface Responsibility {
    current_estimate: BurdenEstimate | null;
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

export interface Disease {
    id: string;
    name: string;
}

export type ActivityType = "none" | "routine" | "campaign";

export type GAVISupportLevel = "none" | "without" | "with";

export interface CoverageSet {
    activity_type: ActivityType;
    gavi_support_level: GAVISupportLevel;
    id: number;
    name: string;
    touchstone: string;
    vaccine: string;
}

export interface ScenarioAndCoverageSets {
    coverage_sets: CoverageSet[];
    scenario: Scenario;
}

export interface ScenarioTouchstoneAndCoverageSets {
    coverage_sets: CoverageSet[];
    scenario: Scenario;
    touchstone: Touchstone;
}