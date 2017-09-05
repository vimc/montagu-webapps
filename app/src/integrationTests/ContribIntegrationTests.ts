import { mainStore } from "../main/contrib/stores/MainStore";
import { expect } from "chai";
import { checkPromise } from "../test/testHelpers";
import { Client, QueryResult } from "pg";
import { responsibilityStore } from "../main/contrib/stores/ResponsibilityStore";
import {
    DemographicStatisticType,
    Disease,
    ModellingGroup,
    Responsibilities,
    ScenarioTouchstoneAndCoverageSets,
    Touchstone
} from "../main/shared/models/Generated";
import { touchstoneActions } from "../main/contrib/actions/TouchstoneActions";
import { modellingGroupActions } from "../main/shared/actions/ModellingGroupActions";
import { responsibilityActions } from "../main/contrib/actions/ResponsibilityActions";
import * as QueryString from 'querystring';
import { demographicStore } from "../main/contrib/stores/DemographicStore";
import { expectIsEqual, IntegrationTestSuite } from "./IntegrationTest";
import { contribAuthStore } from "../main/contrib/stores/ContribAuthStore";
import { ContribFetcher } from "../main/contrib/sources/ContribFetcher";
import { demographicActions } from "../main/contrib/actions/DemographicActions";

const jwt_decode = require('jwt-decode');

// This group (IC-Garske) must match the one the logged in user belongs to
const groupId = "IC-Garske";
const touchstoneId = "test-1";
const scenarioId = "yf-1";

class ContributionPortalIntegrationTests extends IntegrationTestSuite {
    description() { return "Contribution portal"; }
    authStore() { return contribAuthStore; }
    makeFetcher() { return new ContribFetcher(); }

    addTestsToMocha() {
        it("fetches diseases", (done: DoneCallback) => {
            const promise = this.db.query(`
                INSERT INTO disease (id, name) VALUES ('d1', 'Disease 1');
                INSERT INTO disease (id, name) VALUES ('d2', 'Disease 2');
            `).then(() => mainStore.fetchDiseases());

            checkPromise(done, promise, (diseases) => {
                expectIsEqual<Disease[]>(diseases, [
                    { id: "d1", name: "Disease 1" },
                    { id: "d2", name: "Disease 2" }
                ]);
            });
        });

        it("fetches modelling groups", (done: DoneCallback) => {
            const promise = addGroups(this.db).then(() => mainStore.fetchModellingGroups());

            checkPromise(done, promise, (groups) => {
                expectIsEqual<ModellingGroup[]>(groups, [
                    { id: groupId, description: "Group 1" },
                    { id: "Fake", description: "Group 2" }
                ]);
            });
        });

        it("fetches touchstones", (done: DoneCallback) => {
            const promise = addTouchstone(this.db).then(() => responsibilityStore.fetchTouchstones());

            const expected: Touchstone = {
                id: touchstoneId,
                name: "test",
                version: 1,
                description: "Testing version 1",
                status: "open"
            };

            checkPromise(done, promise, (touchstones) => expectIsEqual<Touchstone[]>(touchstones, [expected]));
        });

        it("fetches responsibilities", (done: DoneCallback) => {
            const promise = addResponsibilities(this.db)
                .then(() => {
                    setTouchstoneAndGroup(touchstoneId, groupId);
                    return responsibilityStore.fetchResponsibilities();
                });
            checkPromise(done, promise, (responsibilities) => {
                expectIsEqual<Responsibilities>(responsibilities, expectedResponsibilitiesResponse());
            });
        });

        it("fetches coverage sets", (done: DoneCallback) => {
            let coverageSetId: number;
            const promise = addCoverageSets(this.db)
                .then(id => coverageSetId = id)
                .then(() => {
                    setTouchstoneAndGroup(touchstoneId, groupId);
                    responsibilityActions.update(expectedResponsibilitiesResponse());
                    responsibilityActions.setCurrentResponsibility(scenarioId);
                    return responsibilityStore.fetchCoverageSets()
                });
            checkPromise(done, promise, data => {
                expectIsEqual<ScenarioTouchstoneAndCoverageSets>(data, {
                    scenario: {
                        id: scenarioId,
                        description: "Yellow Fever scenario",
                        disease: "yf",
                        touchstones: [touchstoneId]
                    },
                    touchstone: {
                        id: touchstoneId,
                        name: "test",
                        version: 1,
                        description: "Testing version 1",
                        status: "open"
                    },
                    coverage_sets: [
                        {
                            id: coverageSetId,
                            name: "Test set",
                            touchstone: touchstoneId,
                            activity_type: "none",
                            vaccine: "yf",
                            gavi_support: "no vaccine"
                        }
                    ]
                });
            })
        });

        it("fetches coverage one time token", (done: DoneCallback) => {
            const promise = addCoverageSets(this.db)
                .then(() => {
                    setTouchstoneAndGroup(touchstoneId, groupId);
                    responsibilityActions.update(expectedResponsibilitiesResponse());
                    responsibilityActions.setCurrentResponsibility(scenarioId);
                    return responsibilityStore.fetchOneTimeCoverageToken()
                });
            checkPromise(done, promise, token => {
                const decoded = jwt_decode(token);
                expect(decoded.action).to.equal("coverage");
                const payload = QueryString.parse(decoded.payload);
                expect(payload).to.eql(JSON.parse(`{
                    ":group-id": "${groupId}",
                    ":touchstone-id": "${touchstoneId}",
                    ":scenario-id": "${scenarioId}"
                }`));
            });
        });

        it("fetches demographic data sets", (done: DoneCallback) => {
            const promise = addDemographicDataSets(this.db)
                .then(() => {
                    touchstoneActions.setCurrentTouchstone(touchstoneId);
                    return demographicStore.fetchDataSets();
                });
            checkPromise(done, promise, (dataSets: DemographicStatisticType[]) => {
                expectIsEqual<DemographicStatisticType[]>(dataSets, [
                    {
                        id: "statistic",
                        name: "Some statistic",
                        countries: ["ATL"],
                        gender_is_applicable: false,
                        sources: ["source"]
                    }
                ]);
            });
        });

        it("fetches one time demographic token", (done: DoneCallback) => {
            const promise = addDemographicDataSets(this.db)
                .then(() => {
                    touchstoneActions.setCurrentTouchstone(touchstoneId);
                    return demographicStore.fetchDataSets();
                })
                .then(() => {
                    demographicActions.selectDataSet("statistic");
                    return demographicStore.fetchOneTimeToken();
                });
            checkPromise(done, promise, (token: string) => {
                const decoded = jwt_decode(token);
                expect(decoded.action).to.equal("demography");
                const payload = QueryString.parse(decoded.payload);
                expect(payload).to.eql(JSON.parse(`{
                    ":touchstone-id": "${touchstoneId}",
                    ":source-code": "source",
                    ":type-code": "statistic"
                }`));
            });
        });
    }
}

new ContributionPortalIntegrationTests();

function addTouchstone(db: Client): Promise<QueryResult> {
    return db.query(`
        INSERT INTO touchstone_name (id,     description, comment) 
        VALUES ('test', 'Testing',   '');
        INSERT INTO touchstone_status (id, name) VALUES ('open', 'Open');
        INSERT INTO touchstone (id,       touchstone_name, version, description,         status, comment) 
        VALUES ('${touchstoneId}', 'test',          1,       'Testing version 1', 'open',      '');
    `);
}

function addGroups(db: Client): Promise<QueryResult> {
    return db.query(`
        INSERT INTO modelling_group (id, description, institution, pi) VALUES ('${groupId}', 'Group 1', '', '');
        INSERT INTO modelling_group (id, description, institution, pi) VALUES ('Fake', 'Group 2', '', '');
    `);
}

function addResponsibilities(db: Client): Promise<QueryResult> {
    return addTouchstone(db)
        .then(() => addGroups(db))
        .then(() => db.query(`
            DO $$
                DECLARE scenario_id integer;
                DECLARE set_id integer;
            BEGIN
                INSERT INTO disease (id, name) VALUES ('yf', 'Yellow Fever');
                INSERT INTO scenario_description (id, description, disease)
                VALUES ('${scenarioId}', 'Yellow Fever scenario', 'yf');
                INSERT INTO scenario (touchstone, scenario_description)
                VALUES ('${touchstoneId}', '${scenarioId}')
                RETURNING id INTO scenario_id;
                        
                INSERT INTO responsibility_set_status (id, name) VALUES ('incomplete', 'Incomplete');
        
                INSERT INTO responsibility_set (modelling_group, touchstone, status)
                VALUES ('${groupId}', '${touchstoneId}', 'incomplete')
                RETURNING id INTO set_id;
                
                INSERT INTO responsibility (responsibility_set, scenario)
                VALUES (set_id, scenario_id);
            END $$;
    `));
}

function addCoverageSets(db: Client): Promise<number> {
    return addResponsibilities(db)
        .then(() => db.query(`
            DO $$
                DECLARE coverage_set_id integer;
                DECLARE scenario_id integer;
            BEGIN
                INSERT INTO vaccine            (id, name) VALUES ('yf', 'Yellow Fever vaccine');
                INSERT INTO gavi_support_level (id, name) VALUES ('none', 'None');
                INSERT INTO activity_type      (id, name) VALUES ('none', 'None');
            
                INSERT INTO coverage_set (      name,        touchstone, vaccine, gavi_support_level, activity_type)
                                  VALUES ('Test set', '${touchstoneId}',    'yf',             'none',        'none')
                                  RETURNING id INTO coverage_set_id;
                                  
                SELECT id FROM scenario INTO scenario_id;
                
                INSERT INTO scenario_coverage_set (   scenario,    coverage_set, "order") 
                                           VALUES (scenario_id, coverage_set_id,       0);
            END $$;
        `))
        .then(() => db.query(`SELECT id FROM coverage_set`))
        .then(result => result.rows[0].id);
}

function addDemographicDataSets(db: Client): Promise<QueryResult> {
    return addTouchstone(db)
        .then(() => db.query(`
            DO $$
                DECLARE gender_id integer;
                DECLARE source_id integer;
                DECLARE variant_id integer;
                DECLARE unit_id integer;
                DECLARE type_id integer;
            BEGIN
                INSERT INTO country (id, name) VALUES ('ATL', 'Atlantis');
                INSERT INTO disease (id, name) VALUES ('yf', 'Yellow Fever');
                INSERT INTO gender (code, name) VALUES ('both', 'Both')
                    RETURNING id INTO gender_id;
                
                INSERT INTO demographic_source (code, name) VALUES ('source', 'A great source')
                    RETURNING id INTO source_id;
                INSERT INTO demographic_variant (code, name) VALUES ('variant', 'A so-so variant')
                    RETURNING id INTO variant_id;
                INSERT INTO demographic_value_unit (name) VALUES ('people')
                    RETURNING id INTO unit_id;                    
                
                INSERT INTO demographic_statistic_type 
                       (      code,              name, default_variant, demographic_value_unit, gender_is_applicable, age_interpretation, year_step_size, reference_date) 
                VALUES ('statistic', 'Some statistic',     variant_id,                unit_id,                false,            'people',            5,   '2017-01-01')
                RETURNING id INTO type_id;
                
                INSERT INTO touchstone_demographic_source (touchstone, demographic_source)
                VALUES ('${touchstoneId}', source_id);
                
                INSERT INTO touchstone_country (touchstone, country, disease)
                VALUES ('${touchstoneId}', 'ATL', 'yf');
                
                INSERT INTO demographic_statistic 
                (demographic_source, country, year, age_from, age_to, demographic_statistic_type, demographic_variant,    gender, value)
                VALUES
                (         source_id,   'ATL', 2017,       20,     25,                    type_id,          variant_id, gender_id,  8765);                
            END $$;
        `));
}

function setTouchstoneAndGroup(touchstoneId: string, groupId: string) {
    touchstoneActions.update([
        { id: touchstoneId, description: "Touchstone", status: "open", version: 1, name: "test" }
    ]);
    touchstoneActions.setCurrentTouchstone(touchstoneId);
    modellingGroupActions.updateGroups([
        { id: groupId, description: "Group 1" }
    ]);
    modellingGroupActions.setCurrentGroup(groupId);
}

function expectedResponsibilitiesResponse(): Responsibilities {
    return {
        status: "incomplete",
        touchstone: touchstoneId,
        problems: "",
        responsibilities: [
            {
                problems: [],
                status: "empty",
                current_estimate: null,
                scenario: {
                    id: scenarioId,
                    description: "Yellow Fever scenario",
                    disease: "yf",
                    touchstones: [touchstoneId]
                }
            }
        ]
    };
}