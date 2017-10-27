import * as React from "react";
import { ChooseActionContent } from "./ChooseActionContent";
import { responsibilityStore } from "../../stores/ResponsibilityStore";
import { doNothing } from "../../../shared/Helpers";
import {modellingGroupActions} from "../../../shared/actions/ModellingGroupActions";
import {ContribPageWithHeader} from "../PageWithHeader/ContribPageWithHeader";
import {IPageWithParent} from "../../../shared/models/Breadcrumb";
import {ChooseGroupPage} from "../ChooseGroup/ChooseGroupPage";

export interface LocationProps {
    groupId: string;
}

export class ChooseActionPage extends ContribPageWithHeader<LocationProps> {
    componentDidMount() {
        setTimeout(() => {
            responsibilityStore.fetchTouchstones().catch(doNothing).then(() => {
                modellingGroupActions.setCurrentGroup(this.props.location.params.groupId);
                super.componentDidMount();
            });
        });
    }

    name(): string {
        return "Touchstones";
    }

    title(): JSX.Element {
        return <span>What do you want to do?</span>;
    }

    urlFragment(): string {
        const s = responsibilityStore.getState();
        return `${s.currentModellingGroup.id}/`;
    }

    parent(): IPageWithParent {
        return new ChooseGroupPage();
    }

    renderPageContent() {
        return <ChooseActionContent />;
    }
}