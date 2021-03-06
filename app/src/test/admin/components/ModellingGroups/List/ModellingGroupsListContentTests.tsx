import * as React from "react";

import { shallow } from "enzyme";

import "../../../../helper";
import { mockModellingGroup } from "../../../../mocks/mockModels";
import {
    ModellingGroupsListContent,
    ModellingGroupsListContentComponent
} from "../../../../../main/admin/components/ModellingGroups/List/ModellingGroupsListContent";
import { ModellingGroupListItem } from "../../../../../main/admin/components/ModellingGroups/List/ModellingGroupListItem";
import {createMockStore} from "../../../../mocks/mockStore";
import {Sandbox} from "../../../../Sandbox";

describe("Modelling Groups List Content Component tests", () => {

    describe("Connected", () => {

        const testGroup1 = mockModellingGroup({id: 'g-1', description: "b"});
        const testGroup2 = mockModellingGroup({id: 'g-2', description: "a"});
        const testGroup3 = mockModellingGroup({id: 'g-3', description: "c"});

        const sandbox = new Sandbox();
        afterEach(() => sandbox.restore());

        it("renders on connect level", () => {
            const testState = {
                groups: {groups: [testGroup1]}
            };
            const store = createMockStore(testState);
            const rendered = shallow(<ModellingGroupsListContent/>, {context: {store}});
            expect(rendered.props().groups).toEqual([testGroup1]);
        });

        it("renders on connect level, passes null as groups", () => {
            const testState = {
                groups: {groups: null as any}
            };
            const store = createMockStore(testState);
            const rendered = shallow(<ModellingGroupsListContent/>, {context: {store}});
            expect(rendered.props().groups).toEqual([]);
        });

        it("renders on connect level, check if groups are sorted correctly", () => {
            const testState = {
                groups: {groups: [testGroup1, testGroup2, testGroup3]}
            };
            const store = createMockStore(testState);
            const rendered = shallow(<ModellingGroupsListContent/>, {context: {store}});
            expect(rendered.props().groups).toEqual([testGroup2, testGroup1, testGroup3]);
        })

    });

    describe("Component", () => {

        const testGroup1 = mockModellingGroup({id: 'g-1', description: "b"});
        const testGroup2 = mockModellingGroup({id: 'g-2', description: "a"});

        it("can render group item elements", () => {
            const groups = [testGroup1, testGroup2];

            const rendered = shallow(<ModellingGroupsListContentComponent groups={ groups } />);
            const items = rendered.find(ModellingGroupListItem);
            expect(items).toHaveLength(2);
            expect(items.at(0).prop("description")).toEqual("b");
            expect(items.at(1).prop("description")).toEqual("a");
        });
    });
});