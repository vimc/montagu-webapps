import {
    BurdenEstimateSet,
    CoverageSet, ExpectationMapping,
    ModellingGroup,
    Responsibility,
    ResponsibilitySetStatus,
    ResponsibilitySetWithExpectations,
    ResponsibilityStatus,
    Scenario,
    TouchstoneVersion
} from "../../shared/models/Generated";

export class ExtendedResponsibility {
    current_estimate_set: BurdenEstimateSet | null;
    problems: string[];
    scenario: Scenario;
    status: ResponsibilityStatus;
    coverageSets: CoverageSet[];

    constructor(x: Responsibility) {
        this.current_estimate_set = x.current_estimate_set;
        this.problems = x.problems;
        this.scenario = x.scenario;
        this.status = x.status;
        this.coverageSets = null;
    }
}

export interface IExtendedResponsibilitySet {
    responsibilities: ExtendedResponsibility[];
    status: ResponsibilitySetStatus | null;
    touchstone: TouchstoneVersion;
    expectations: ExpectationMapping[];
}

export class ExtendedResponsibilitySet implements IExtendedResponsibilitySet {
    responsibilities: ExtendedResponsibility[];
    status: ResponsibilitySetStatus | null;
    touchstone: TouchstoneVersion;
    modellingGroup: ModellingGroup;
    expectations: ExpectationMapping[];

    constructor(x: ResponsibilitySetWithExpectations, touchstone: TouchstoneVersion, modellingGroup: ModellingGroup) {
        this.responsibilities = x.responsibilities.map(r => new ExtendedResponsibility(r));
        this.status = x.status;
        this.touchstone = touchstone;
        this.modellingGroup = modellingGroup;
        this.expectations = x.expectations;
    }

    getResponsibilityByScenario(scenarioId: string): ExtendedResponsibility {
        return this.responsibilities.find(x => x.scenario.id == scenarioId);
    }

    addCoverageSets(scenarioId: string, coverageSets: CoverageSet[]) {
        const responsibility = this.getResponsibilityByScenario(scenarioId);
        responsibility.coverageSets = coverageSets;
    }

    getCoverageSets(scenarioId: string): CoverageSet[] {
        const responsibility = this.getResponsibilityByScenario(scenarioId);
        return responsibility.coverageSets;
    }
}
