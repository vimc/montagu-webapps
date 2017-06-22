import * as React from "react";
import { ModellingGroup, Touchstone } from "../../../shared/models/Generated";
import { responsibilityStore } from "../../stores/ResponsibilityStore";
import { contribAuthStore } from "../../stores/ContribAuthStore";
import { connectToStores } from "../../../shared/alt";
import { TouchstoneList } from "./TouchstoneList";
import { RemoteContent } from "../../../shared/models/RemoteContent";
import { RemoteContentComponent } from "../../../shared/components/RemoteContentComponent/RemoteContentComponent";
import { isNullOrUndefined } from "util";
import { ButtonLink } from "../../../shared/components/ButtonLink";

const commonStyles = require("../../../shared/styles/common.css");
const chooseStyles = require("./Choose.css");

export interface ChooseActionContentProps extends RemoteContent {
    touchstones: Touchstone[];
    group: ModellingGroup
}

export class ChooseActionContentComponent extends RemoteContentComponent<ChooseActionContentProps> {
    static getStores() {
        return [ responsibilityStore, contribAuthStore ];
    }
    static getPropsFromStores() {
        const res = responsibilityStore.getState();
        return {
            touchstones: res.touchstones,
            group: res.currentModellingGroup,
            ready: res.ready && !isNullOrUndefined(res.currentModellingGroup)
        };
    }

    renderTouchstoneChoice(props: ChooseActionContentProps): JSX.Element {
        const membershipUrl = `/${ props.group.id }/members/`;
        return <div>
            <div className={ commonStyles.sectionTitle }>View modelling responsibilities</div>
            <div>
                Which touchstone do you want to view responsibilities for? You can select either the current
                open touchstone, if there is one, or a past touchstone that is now closed.
            </div>
            <TouchstoneList touchstones={ props.touchstones }
                            group={ props.group }
                            ready={ props.ready } />

            <div className={ commonStyles.sectionTitle }>View and manage modelling group membership</div>
            <ButtonLink className={ chooseStyles.choice } href={ membershipUrl }>View group members</ButtonLink>
        </div>;
    }

    renderContent(props: ChooseActionContentProps) {
        return <div>
            { this.renderTouchstoneChoice(props) }
        </div>;
    }
}

export const ChooseActionContent = connectToStores(ChooseActionContentComponent);