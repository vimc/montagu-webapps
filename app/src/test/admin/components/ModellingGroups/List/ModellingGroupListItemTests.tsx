import * as React from "react";
import { shallow } from "enzyme";


import "../../../../helper";
import { mockModellingGroup } from "../../../../mocks/mockModels";

import { ModellingGroupListItem } from "../../../../../main/admin/components/ModellingGroups/List/ModellingGroupListItem";

describe("ModellingGroupListItem component tests", () => {

    const testGroup = mockModellingGroup();

    it("can render", () => {
        const rendered = shallow(<ModellingGroupListItem {...testGroup} />);
        expect(rendered.props().href).toEqual(`/modelling-groups/${testGroup.id}/`);
        expect(rendered.props().children).toEqual(testGroup.description);
    });
});