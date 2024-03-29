import * as React from "react";
import {createMemoryHistory} from 'history';

import {addCoverageData, addCoverageSetsForScenario, IntegrationTestSuite, TestService} from "./IntegrationTest";

import {shallow} from "enzyme";
import {Client, QueryResult} from "pg";
import {
    ModellingGroup,
    ResponsibilitySetWithExpectations,
    Result,
    RoleAssignment,
    Scenario,
    User
} from "../main/shared/models/Generated";
import {createAdminStore} from "../main/admin/stores/createAdminStore";
import {AuthService} from "../main/shared/services/AuthService";
import {ModellingGroupsService} from "../main/shared/services/ModellingGroupsService";
import {UsersService} from "../main/admin/services/UsersService";
import {mockModellingGroupCreation, mockTouchstoneVersion} from "../test/mocks/mockModels";
import {TouchstonesService} from "../main/shared/services/TouchstonesService";
import {ScenarioGroupComponent} from "../main/admin/components/Touchstones/Scenarios/ScenarioGroup"
import {FileDownloadButton, FileDownloadLink} from "../main/shared/components/FileDownloadLink";
import {ExpectationsService} from "../main/shared/services/ExpectationsService";
import {CoverageService} from "../main/admin/services/CoverageService";
import {CoveragePage} from "../main/admin/components/Touchstones/Coverage/CoveragePage";
import {createMockAdminStore} from "../test/mocks/mockStore";
import {mockMatch} from "../test/mocks/mocks";
import {TouchstoneVersionPageLocationProps} from "../main/admin/components/Touchstones/SingleTouchstoneVersion/TouchstoneVersionPage";
import {coveragePageActionCreators} from "../main/admin/actions/pages/CoveragePageActionCreators";
import {Sandbox} from "../test/Sandbox";
import FormData = require("form-data");

const touchstoneVersionId = "test-1";
const scenarioId = "yf-1";

class AdminIntegrationTests extends IntegrationTestSuite {
    description() {
        return "Admin portal";
    }

    createStore() {
        return createAdminStore(createMemoryHistory());
    }

    runTests() {

        it("can log out", async () => {
            const result = await (new AuthService(this.store.dispatch, this.store.getState)).logOutOfAPI();
            expect(result).toBe("OK");
        });

        it("forgot password", async () => {
            const result = await (new AuthService(this.store.dispatch, this.store.getState)).forgotPassword("test@test.com");
            expect(result).toBe("OK");
        });

        it("can get current user details", async () => {
            const result = await (new AuthService(this.store.dispatch, this.store.getState)).getCurrentUser();
            expect(result.username).toBe("test.user");
            expect(result.permissions).toContain("*/can-login");
        });

        it("can fetch groups", async () => {
            await addGroups(this.db);
            const result = await (new ModellingGroupsService(this.store.dispatch, this.store.getState)).getAllGroups();
            expect(result).toEqual([
                {id: "g1", description: "Group 1"},
                {id: "g2", description: "Group 2"}
            ]);
        });

        it("can fetch models", async () => {
            await addGroups(this.db);
            const result = await (new ModellingGroupsService(this.store.dispatch, this.store.getState)).getAllModels();
            expect(result).toEqual([
                {
                    citation: "Citation",
                    description: "A model",
                    id: "model",
                    modelling_group: "g1",
                    gender: null,
                    gender_specific: false,
                    current_version: null,
                    disease: {
                        id: "yf",
                        name: "yellow fever"
                    }
                },
                {
                    citation: "Citation",
                    description: "Another model",
                    id: "model2",
                    modelling_group: "g2",
                    gender: null,
                    gender_specific: false,
                    current_version: null,
                    disease: {
                        id: "yf",
                        name: "yellow fever"
                    }
                }
            ]);
        });

        it("can fetch expectations", async () => {
            await addResponsibilities(this.db);
            const result = await (new ExpectationsService(this.store.dispatch, this.store.getState)).getAllExpectations();
            expect(result).toEqual([{
                touchstone_version: touchstoneVersionId,
                modelling_group: "g1",
                disease: "yf",
                expectation: {
                    id: 1,
                    description: "bee desc",
                    years: {
                        minimum_inclusive: 1950,
                        maximum_inclusive: 2100
                    },
                    ages: {
                        minimum_inclusive: 0,
                        maximum_inclusive: 99
                    },
                    cohorts: {
                        minimum_birth_year: 1900,
                        maximum_birth_year: 2100
                    },
                    outcomes: [{code: "cases", name: "cases"}, {code: "deaths", name: "deaths"}]
                },
                applicable_scenarios: [scenarioId]
            }]);
        });

        it("can fetch group details", async () => {
            await addGroups(this.db);
            const result = await (new ModellingGroupsService(this.store.dispatch, this.store.getState)).getGroupDetails('g1');
            expect(result).toEqual({
                id: "g1",
                description: "Group 1",
                members: ['bob'],
                models: [
                    {
                        id: "model",
                        modelling_group: "g1",
                        description: "A model",
                        citation: "Citation"
                    }
                ]
            });
        });

        it("can add member to a group", async () => {
            await addGroups(this.db);
            const result = await (new ModellingGroupsService(this.store.dispatch, this.store.getState))
                .addMember("g1", "test.user");
            expect(result).toEqual("OK");
            const groupDetails = await (new ModellingGroupsService(this.store.dispatch, this.store.getState))
                .getGroupDetails('g1');
            expect(groupDetails.members.indexOf("test.user") > -1).toBe(true);
        });

        it("can remove member from a group", async () => {
            await addGroups(this.db);
            const result = await (new ModellingGroupsService(this.store.dispatch, this.store.getState))
                .removeMember("g1", "bob");
            expect(result).toEqual("OK");
            const groupDetails = await (new ModellingGroupsService(this.store.dispatch, this.store.getState))
                .getGroupDetails('g1');
            expect(groupDetails.members.indexOf("bob") === -1).toBe(true);
        });

        it("can add a global role to a user", async () => {
            await addUsers(this.db);
            const result = await (new UsersService(this.store.dispatch, this.store.getState))
                .addGlobalRoleToUser("bob", "touchstone-reviewer");
            expect(result).toEqual("OK");

            const users = await (new UsersService(this.store.dispatch, this.store.getState))
                .getAllUsers();

            const user = users.find((u: User) => u.username == "bob");
            expect(user.roles.map((r: RoleAssignment) => r.name))
                .toEqual(['touchstone-reviewer', 'member', 'user-manager'])
        });

        it("can remove role from a user", async () => {
            await addUsers(this.db);
            const result = await (new UsersService(this.store.dispatch, this.store.getState))
                .removeRoleFromUser("bob", "user-manager", null, null);
            expect(result).toEqual("OK");

            const users = await (new UsersService(this.store.dispatch, this.store.getState))
                .getAllUsers();
            const user = users.find((u: User) => u.username == "bob");

            expect(user.roles.map((r: RoleAssignment) => r.name))
                .toEqual(['member'])
        });

        it("can fetch users", async () => {
            await addUsers(this.db);
            const users: User[] = await (new UsersService(this.store.dispatch, this.store.getState)).getAllUsers();
            const bob: User = users.find(x => x.username == 'bob');
            expect(bob).toEqual({
                username: "bob",
                name: "Bob Jones",
                email: "bob@example.com",
                roles: [
                    {name: "member", scope_prefix: "modelling-group", scope_id: "some-group"},
                    {name: "user-manager", scope_prefix: null, scope_id: null}
                ],
                last_logged_in: "2017-01-01T08:36:23Z"
            });
        });

        it("can fetch global roles", async () => {
            const roles: string[] = await (new UsersService(this.store.dispatch, this.store.getState))
                .getGlobalRoles();

            expect(roles).toHaveLength(10)
        });

        it("can create a user", async () => {

            const usersService = new UsersService(this.store.dispatch, this.store.getState);
            const result = await usersService
                .createUser("new user", "user@example.com", "new.user");

            expect(result).toMatch(new RegExp("/v1/users/new.user/$"));
            const allUsers = await usersService.getAllUsers();
            expect(allUsers.map((u: User) => u.username).indexOf("new.user") > -1).toBe(true);
        });


        it("can create a group", async () => {

            const groupService = new ModellingGroupsService(this.store.dispatch, this.store.getState);
            const result = await groupService
                .createGroup(mockModellingGroupCreation({id: "test-group"}));

            expect(result).toMatch(new RegExp("/v1/modelling-group/test-group/$"));
            const allGroups = await groupService.getAllGroups();
            expect(allGroups.map((g: ModellingGroup) => g.id).indexOf("test-group") > -1).toBe(true);
        });

        it("can get responsibilities for touchstone", async () => {

            await addResponsibilities(this.db);
            const touchstoneService = new TouchstonesService(this.store.dispatch, this.store.getState);
            const result = await touchstoneService
                .getResponsibilitiesForTouchstoneVersion(touchstoneVersionId);

            expect(result).toEqual(expectedResponsibilitySets)
        });

        it("can get scenarios for touchstone", async () => {
            await addResponsibilities(this.db);
            const touchstoneService = new TouchstonesService(this.store.dispatch, this.store.getState);
            const result = await touchstoneService.getScenariosForTouchstoneVersion(touchstoneVersionId);
            expect(result).toEqual([
                {
                    "coverage_sets": [],
                    "scenario": {
                        "description": "Yellow Fever scenario",
                        "disease": "yf",
                        "id": "yf-1",
                        "touchstones": [
                            "test-1"
                        ]
                    }
                }
            ]);
        });

        it("can download coverage data in long format", async () => {
            const coverageSetId = await addCoverageSetsForScenario(this.db, scenarioId, touchstoneVersionId);
            await addCoverageData(this.db, coverageSetId);

            const scenarios: Scenario[] = [
                {
                    "description": "Yellow Fever scenario",
                    "disease": "yf",
                    "id": "yf-1",
                    "touchstones": [
                        "test-1"
                    ]
                }
            ];

            const rendered = shallow(<ScenarioGroupComponent
                touchstoneVersionId={touchstoneVersionId}
                disease={{id: "yf", name: "Yellow Fever"}}
                canDownloadCoverage={true}
                scenarios={scenarios}/>);

            const href = rendered.find(FileDownloadButton).first().prop("href");

            const response = await new TestService(this.store.dispatch, this.store.getState)
                .getAnyUrl(href);

            expect(response.status).toEqual(200);
            const result = await response.text();

            expect(result).toEqual("scenario,set_name,vaccine,gavi_support,activity_type,country_code,country,year,age_first,age_last,age_range_verbatim,target,coverage,gender,proportion_risk\n"
                + "yf-1,Test set,yf,no vaccine,none,ATL,Atlantis,1970,1,2,1-2,1000,1000,both,0.5\n")
        });

        it("can download coverage data in wide format", async () => {
            const coverageSetId = await addCoverageSetsForScenario(this.db, scenarioId, touchstoneVersionId);
            await addCoverageData(this.db, coverageSetId);

            const scenarios: Scenario[] = [
                {
                    "description": "Yellow Fever scenario",
                    "disease": "yf",
                    "id": "yf-1",
                    "touchstones": [
                        "test-1"
                    ]
                }
            ];

            const rendered = shallow(<ScenarioGroupComponent
                touchstoneVersionId={touchstoneVersionId}
                disease={{id: "yf", name: "Yellow Fever"}}
                canDownloadCoverage={true}
                scenarios={scenarios}/>);

            const href = rendered.find(FileDownloadButton).at(1).prop("href");

            const response = await new TestService(this.store.dispatch, this.store.getState)
                .getAnyUrl(href);

            expect(response.status).toEqual(200);
            const result = await response.text();

            expect(result).toEqual("scenario,set_name,vaccine,gavi_support,activity_type,country_code,country,age_first,age_last,age_range_verbatim,gender,coverage_1970,target_1970\n"
                + "yf-1,Test set,yf,no vaccine,none,ATL,Atlantis,1,2,1-2,both,1000,1000\n")
        });

        it("can upload coverage", async () => {
            const form = new FormData();

            const uploadResult: Result = await (new CoverageService(this.store.dispatch, this.store.getState))
                .uploadCoverage(touchstoneVersionId, form);

            expect(uploadResult.errors[0].message).toEqual("You must supply a \'description\' parameter in the multipart body");
        });

        it("can get coverage metadata", async () => {
            const result: Result = await (new CoverageService(this.store.dispatch, this.store.getState))
                .fetchCoverageMetadata("touchstone-1");
            expect(result).toStrictEqual([]);
        });

        it("can download coverage template", async () => {
            const sandbox = new Sandbox();
            const store = createMockAdminStore({
                touchstones: {currentTouchstoneVersion: mockTouchstoneVersion()}
            });
            const testMatch = mockMatch<TouchstoneVersionPageLocationProps>({
                touchstoneId: "touchstone",
                touchstoneVersionId: "touchstone-1"
            });
            sandbox.setStubReduxAction(coveragePageActionCreators, "onLoad");
            const rendered = shallow(<CoveragePage match={testMatch}/>, {context: {store}}).dive().dive();
            const href = rendered.find(FileDownloadLink).prop("href");

            const response = await new TestService(this.store.dispatch, this.store.getState)
                .getAnyUrl(href);

            expect(response.status).toEqual(200);

            const result = await response.text();
            const headers = result.split("\n")[0];

            // just check it's the format we're expecting
            expect(headers).toEqual("\"vaccine\", \"country\", \"activity_type\", \"gavi_support\", \"year\", \"age_first\", \"age_last\", \"gender\", \"target\", \"coverage\", \"subnational\"")
        })

        it("can annotate responsibility", async () => {
            await addResponsibilities(this.db);
            const touchstoneService = new TouchstonesService(this.store.dispatch, this.store.getState);
            const result = await touchstoneService
                .addResponsibilityComment(touchstoneVersionId, "g1", scenarioId, "comment 1");
            expect(result).toEqual("OK")
        });

        it("can annotate responsibility set", async () => {
            await addResponsibilities(this.db);
            const touchstoneService = new TouchstonesService(this.store.dispatch, this.store.getState);
            const result = await touchstoneService
                .addResponsibilitySetComment(touchstoneVersionId, "g1", "comment 1");
            expect(result).toEqual("OK")
        });

        it("can retrieve annotated responsibilities", async () => {
            await addResponsibilityComments(this.db);
            const touchstoneService = new TouchstonesService(this.store.dispatch, this.store.getState);
            const result = await touchstoneService
                .getResponsibilityCommentsForTouchstoneVersion(touchstoneVersionId);
            expect(result).toEqual(
                [
                    {
                        "modelling_group_id": "g1",
                        "comment": null,
                        "responsibilities": [
                            {
                                "comment": {
                                    "added_by": "bob",
                                    "added_on": "2021-06-17T08:58:32.233Z",
                                    "comment": "comment 2",
                                },
                                "scenario_id": "yf-1",
                            },
                        ],
                        "touchstone_version": "test-1",
                    },
                ]
            );
        });

        it("can retrieve annotated responsibility set", async () => {
            await addResponsibilitySetComments(this.db);
            const touchstoneService = new TouchstonesService(this.store.dispatch, this.store.getState);
            const result = await touchstoneService
                .getResponsibilityCommentsForTouchstoneVersion(touchstoneVersionId);
            expect(result).toEqual(
                [
                    {
                        "modelling_group_id": "g1",
                        "responsibilities": [
                            {
                                "comment": null,
                                "scenario_id": "yf-1",
                            },
                        ],
                        "touchstone_version": "test-1",
                        "comment": {
                            "added_by": "bob",
                            "added_on": "2021-06-17T08:58:32.233Z",
                            "comment": "comment B",
                        },
                    },
                ]
            );
        })
    }
}

new AdminIntegrationTests();

function addGroups(db: Client): Promise<QueryResult> {
    return db.query(`
        DO $$
            DECLARE role_id integer;
        BEGIN
            INSERT INTO modelling_group (id, description, institution, pi) VALUES ('g1', 'Group 1', '', '');
            INSERT INTO modelling_group (id, description, institution, pi) VALUES ('g2', 'Group 2', '', '');
            
            INSERT INTO disease (id, name) values ('yf', 'yellow fever');
            INSERT INTO model (id, modelling_group, description, citation, is_current, disease) VALUES ('model', 'g1', 'A model', 'Citation', true, 'yf');
            INSERT INTO model (id, modelling_group, description, citation, is_current, disease) VALUES ('model2', 'g2', 'Another model', 'Citation', true, 'yf');
            
            INSERT INTO app_user (username) VALUES ('bob'); 
            INSERT INTO user_group (id, name) VALUES ('bob', 'bob');
            INSERT INTO user_group_membership (username, user_group) VALUES ('bob', 'bob');        
            
            --See VIMC-359 for why this is group members rather than admins    
            SELECT id INTO role_id FROM role WHERE name = 'member' AND scope_prefix = 'modelling-group';
            
            INSERT INTO user_group_role (user_group, role, scope_id) VALUES ('bob', role_id, 'g1');
        END $$;
    `);
}

function addUsers(db: Client): Promise<QueryResult> {
    return db.query(`
        DO $$
            DECLARE simple_role_id integer;
            DECLARE scoped_role_id integer;
        BEGIN
            INSERT INTO app_user (username, name, email, last_logged_in)
            VALUES ('bob', 'Bob Jones', 'bob@example.com', '2017-01-01T08:36:23');
             
            INSERT INTO user_group (id, name) VALUES ('bob', 'bob');
            INSERT INTO user_group_membership (username, user_group) VALUES ('bob', 'bob');           
            
            SELECT id INTO simple_role_id FROM role WHERE name = 'user-manager' AND scope_prefix IS NULL;
            SELECT id INTO scoped_role_id FROM role WHERE name = 'member' AND scope_prefix = 'modelling-group';
            INSERT INTO user_group_role (user_group, role, scope_id) VALUES ('bob', simple_role_id, '');
            INSERT INTO user_group_role (user_group, role, scope_id) VALUES ('bob', scoped_role_id, 'some-group');
       END $$;
    `);
}

function addTouchstone(db: Client): Promise<QueryResult> {
    return db.query(`
        INSERT INTO touchstone_name (id,     description, comment) 
        VALUES ('test', 'Testing',   'comment');
        INSERT INTO touchstone (id,       touchstone_name, version, description,         status, comment) 
        VALUES ('${touchstoneVersionId}', 'test',          1,       'Testing version 1', 'open',      'comment for v1');
    `);
}

function addResponsibilities(db: Client) {
    return addTouchstone(db)
        .then(() => addGroups(db))
        .then(() => db.query(`
            DO $$
                DECLARE scenario_id integer;
                DECLARE set_id integer;
                DECLARE burden_estimate_expectation_id integer;
            BEGIN
                INSERT INTO scenario_type (id, name)
                VALUES ('default', 'default');
                INSERT INTO scenario_description (id, description, disease, scenario_type)
                VALUES ('${scenarioId}', 'Yellow Fever scenario', 'yf', 'default');
                INSERT INTO scenario (touchstone, scenario_description)
                VALUES ('${touchstoneVersionId}', '${scenarioId}')
                RETURNING id INTO scenario_id;
        
                INSERT INTO responsibility_set (modelling_group, touchstone, status)
                VALUES ('g1', '${touchstoneVersionId}', 'incomplete')
                RETURNING id INTO set_id;
                
                INSERT INTO burden_estimate_expectation (year_min_inclusive, year_max_inclusive, age_min_inclusive,
                    age_max_inclusive, cohort_min_inclusive, cohort_max_inclusive, description, version)
                VALUES (1950, 2100, 0, 99, 1900, 2100, 'bee desc', '1')    
                RETURNING id INTO burden_estimate_expectation_id;
                
                INSERT INTO burden_estimate_outcome_expectation (burden_estimate_expectation, outcome)
                VALUES (burden_estimate_expectation_id, 'cases');
                
                INSERT INTO burden_estimate_outcome_expectation (burden_estimate_expectation, outcome)
                VALUES (burden_estimate_expectation_id, 'deaths');
                
                INSERT INTO responsibility (responsibility_set, scenario, is_open, expectations)
                VALUES (set_id, scenario_id, true, burden_estimate_expectation_id);
            END $$;
    `))
}

function addResponsibilityComments(db: Client) {
    return addResponsibilities(db)
        .then(() => db.query(`
            DO $$
                DECLARE responsibility_id integer;
            BEGIN
                SELECT id INTO responsibility_id FROM responsibility LIMIT 1;

                INSERT INTO responsibility_comment (responsibility, comment, added_by, added_on)
                VALUES (responsibility_id, 'comment 1', 'bob', '2021-06-16T08:58:32.233Z'),
                       (responsibility_id, 'comment 2', 'bob', '2021-06-17T08:58:32.233Z');
            END $$;
    `))
}

function addResponsibilitySetComments(db: Client) {
    return addResponsibilities(db)
        .then(() => db.query(`
            DO $$
                DECLARE responsibility_set_id integer;
            BEGIN
                SELECT id INTO responsibility_set_id FROM responsibility_set LIMIT 1;

                INSERT INTO responsibility_set_comment (responsibility_set, comment, added_by, added_on)
                VALUES (responsibility_set_id, 'comment A', 'bob', '2021-06-16T08:58:32.233Z'),
                       (responsibility_set_id, 'comment B', 'bob', '2021-06-17T08:58:32.233Z');
            END $$;
    `))
}

const expectedResponsibilitySets: ResponsibilitySetWithExpectations[] = [{
    modelling_group_id: "g1",
    touchstone_version: touchstoneVersionId,
    status: "incomplete",
    responsibilities: [
        {
            problems: [],
            status: "empty",
            current_estimate_set: null,
            scenario: {
                id: scenarioId,
                description: "Yellow Fever scenario",
                disease: "yf",
                touchstones: [touchstoneVersionId]
            }
        }
    ],
    expectations: [
        {
            applicable_scenarios: [scenarioId],
            disease: "yf",
            expectation: {
                ages: {
                    minimum_inclusive: 0,
                    maximum_inclusive: 99
                },
                cohorts: {
                    minimum_birth_year: 1900,
                    maximum_birth_year: 2100
                },
                countries: [],
                description: "bee desc",
                id: 1,
                outcomes: [{code: "cases", name: "cases"},{code: "deaths", name: "deaths"}],
                years: {
                    minimum_inclusive: 1950,
                    maximum_inclusive: 2100
                }
            }
        }
     ]
}];
