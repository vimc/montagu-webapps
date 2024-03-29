import {Client, QueryResult} from "pg";
import {Sandbox} from "../test/Sandbox";

import {authActionCreators} from "../main/shared/actions/authActionCreators";

import {singletonVariableCache} from "../main/shared/modules/cache/singletonVariableCache";
import {AbstractLocalService} from "../main/shared/services/AbstractLocalService";
import {AuthService} from "../main/shared/services/AuthService";
import {initialAuthState} from "../main/shared/reducers/authReducer";
import DoneCallback = jest.DoneCallback;

const dbName = process.env.PGDATABASE;
const dbTemplateName = process.env.PGTEMPLATE;

export class TestService extends AbstractLocalService {

    getAnyUrl(url: string) {
        return this.doFetch(this.makeUrl(url), this.makeRequestOptions("GET", null));
    }
}

export abstract class IntegrationTestSuite {

    private user: string = "test.user@example.com";

    abstract description(): string;

    abstract createStore(): any;

    store: any;

    abstract runTests(): void;

    db: Client;

    constructor() {
        describe(this.description(), () => {

            const sandbox = new Sandbox();

            beforeEach(async (done: DoneCallback) => {
                queryAgainstRootDb(`CREATE DATABASE ${dbName} TEMPLATE ${dbTemplateName};`)
                    .then(() => {
                        this.db = new Client({});
                        this.db.connect();
                        done();
                    })
                    .catch(e => done(e));
            });
            afterEach((done: DoneCallback) => {
                sandbox.restore();
                this.db.end();
                queryAgainstRootDb(`DROP DATABASE ${dbName};`)
                    .then(() => done())
                    .catch(e => done(e));
            });

            beforeEach(async () => {
                (global as any).fetch = require('node-fetch');
                singletonVariableCache.clearAll();

                this.store = this.createStore();
                const response = await (new AuthService(this.store.dispatch, this.store.getState))
                    .logIn(this.user, "password");

                initialAuthState.bearerToken = response.access_token;
                await this.store.dispatch(authActionCreators.loadAuthenticatedUser());
            });

            this.runTests();
        });
    }
}

function queryAgainstRootDb(query: string): Promise<void> {
    const db = new Client({database: "postgres"});
    db.connect();
    return db.query(query)
        .then(() => {
            db.end();
        });
}


export interface ResponsibilityIds {
    responsibility: number;
    responsibilitySet: number;
}

export function addTouchstone(db: Client, touchstoneVersionId: String): Promise<QueryResult> {
    return db.query(`
        INSERT INTO touchstone_name (id,     description, comment) 
        VALUES ('test', 'Testing',   'comment');
        INSERT INTO touchstone (id,       touchstone_name, version, description,         status, comment) 
        VALUES ('${touchstoneVersionId}', 'test',          1,       'Testing version 1', 'open',      'comment for v1');
    `);
}

export function addGroups(db: Client, groupId: String): Promise<QueryResult> {
    return db.query(`
        INSERT INTO modelling_group (id, description, institution, pi) VALUES ('${groupId}', 'Group 1', '', '');
        INSERT INTO modelling_group (id, description, institution, pi) VALUES ('Fake', 'Group 2', '', '');
    `);
}

export function addScenario(db:Client, scenarioId: String, touchstoneVersionId: String) : Promise<QueryResult>{
    return db.query(`
            DO $$
            BEGIN
                INSERT INTO disease (id, name) VALUES ('yf', 'Yellow Fever');
                INSERT INTO scenario_type (id, name) VALUES ('default', 'default');
                INSERT INTO scenario_description (id, description, disease, scenario_type)
                VALUES ('${scenarioId}', 'Yellow Fever scenario', 'yf', 'default');
                INSERT INTO scenario (touchstone, scenario_description)
                VALUES ('${touchstoneVersionId}', '${scenarioId}');       
            END $$;
        `);
}


export function addResponsibilities(db: Client, scenarioId: String, touchstoneVersionId: String, groupId: String): Promise<ResponsibilityIds> {
    return addTouchstone(db, touchstoneVersionId)
        .then(() => addGroups(db, groupId))
        .then(() => addScenario(db, scenarioId, touchstoneVersionId))
        .then(() => db.query(`
            DO $$
                DECLARE scenario_id integer;
                DECLARE set_id integer;
                DECLARE expectation_id integer;
            BEGIN
                INSERT INTO responsibility_set (modelling_group, touchstone, status)
                VALUES ('${groupId}', '${touchstoneVersionId}', 'incomplete')
                RETURNING id INTO set_id;
                
                SELECT id INTO scenario_id FROM scenario WHERE scenario_description='${scenarioId}';
                
                INSERT INTO responsibility (responsibility_set, scenario, is_open)
                VALUES (set_id, scenario_id, true);
               
            END $$;
        `))
        .then(() => db.query(`SELECT responsibility.id as responsibility, responsibility_set.id as responsibility_set 
                              FROM responsibility JOIN responsibility_set ON true`))
        .then(result => {
            const row = result.rows[0];
            return {responsibility: row.responsibility, responsibilitySet: row.responsibility_set}
        });
}

export function addCoverageSetsForGroup(db: Client, scenarioId: String, touchstoneVersionId: String, groupId: String)
    : Promise<number> {
    return addResponsibilities(db, scenarioId, touchstoneVersionId, groupId)
        .then(() => addCoverageSets(db, scenarioId, touchstoneVersionId));
}

export function addCoverageSetsForScenario(db: Client, scenarioId: String, touchstoneVersionId: String)
    : Promise<number> {
    return addTouchstone(db, touchstoneVersionId)
        .then(() => addScenario(db, scenarioId, touchstoneVersionId))
        .then(() => addCoverageSets(db, scenarioId, touchstoneVersionId));
}

export function addCoverageSets(db: Client, scenarioId: String, touchstoneVersionId: String)
    : Promise<number> {
    return (db.query(`
            DO $$
                DECLARE coverage_set_id integer;
                DECLARE scenario_id integer;
            BEGIN
                INSERT INTO vaccine            (id, name) VALUES ('yf', 'Yellow Fever vaccine');
            
                INSERT INTO coverage_set (      name,        touchstone, vaccine, gavi_support_level, activity_type)
                                  VALUES ('Test set', '${touchstoneVersionId}',    'yf',             'none',        'none')
                                  RETURNING id INTO coverage_set_id;
                                  
                SELECT id FROM scenario INTO scenario_id;
                
                INSERT INTO scenario_coverage_set (   scenario,    coverage_set, "order") 
                                           VALUES (scenario_id, coverage_set_id,       0);
            END $$;
        `))
        .then(() => db.query(`SELECT id FROM coverage_set`))
        .then(result => result.rows[0].id);
}

export function addCoverageData(db: Client, coverageSetId: number): Promise<QueryResult> {
    return db.query(`
                INSERT INTO country (id, name) VALUES ('ATL', 'Atlantis');
                INSERT INTO coverage (coverage_set, country, year, age_from, age_to, age_range_verbatim, target, coverage, proportion_risk)
                VALUES (${coverageSetId}, 'ATL', 1970, 1, 2, '1-2', 1000, 1000, 0.5);
        `)
}