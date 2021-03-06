import * as React from "react";
import { shallow } from "enzyme";


import "../../../helper";
import { ChooseGroupPage, ChooseGroupPageComponent } from "../../../../main/contrib/components/ChooseGroup/ChooseGroupPage";
import { Sandbox } from "../../../Sandbox";
import {createMockStore} from "../../../mocks/mockStore";
import {ChooseGroupContent} from "../../../../main/contrib/components/ChooseGroup/ChooseGroupContent";
import {PageArticle} from "../../../../main/shared/components/PageWithHeader/PageArticle";

describe("Choose Group Page Component", () => {

    const sandbox = new Sandbox();
    afterEach(() => sandbox.restore());

    it("renders component on connect level", () => {
        let store = createMockStore();
        const rendered = shallow(<ChooseGroupPage/>, {context: {store}});
        expect(typeof rendered.props().onLoad).toBe('function');
    });

    it("renders title, description and ChooseGroupContent", () => {
        const rendered = shallow(<ChooseGroupPageComponent history={null} location={null} match={null}
                                                           router={null} title={"title"}/>);
        const pageArticle = rendered.find(PageArticle);
        expect(pageArticle.props().title).toBe("title");
        expect(pageArticle.find('p').length).toBe(1);
        expect(pageArticle.find(ChooseGroupContent).length).toBe(1);
    });


});

