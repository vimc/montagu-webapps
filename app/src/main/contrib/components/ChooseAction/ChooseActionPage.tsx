import * as React from "react";

import {ChooseActionContent} from "./ChooseActionContent";
import {ChooseGroupPageComponent} from "../ChooseGroup/ChooseGroupPage";
import {PageBreadcrumb, PageProperties} from "../../../shared/components/PageWithHeader/PageWithHeader";
import {ContribAppState} from "../../reducers/contribAppReducers";
import {PageArticle} from "../../../shared/components/PageWithHeader/PageArticle";
import {ContribPage} from "../../ContribPage";
import {chooseActionPageActionCreators} from "../../actions/pages/chooseActionPageActionCreators";

export interface ChooseActionPageLocationProps {
    groupId: string;
}

export class ChooseActionPageComponent extends React.Component<PageProperties<ChooseActionPageLocationProps>> {
    // TODO: This is still here for the old action creators - to be removed when
    // they are all switched to ContribPageActionCreators
    static breadcrumb(state: ContribAppState): PageBreadcrumb {
        return {
            name: state.groups.currentUserGroup.description,
            urlFragment: `${state.groups.currentUserGroup.id}/`,
            parent: ChooseGroupPageComponent.breadcrumb()
        }
    }

    render(): JSX.Element {
        return <PageArticle title="What do you want to do?">
            <ChooseActionContent/>
        </PageArticle>;
    }
}

export const ChooseActionPage = ContribPage(chooseActionPageActionCreators)(ChooseActionPageComponent);
