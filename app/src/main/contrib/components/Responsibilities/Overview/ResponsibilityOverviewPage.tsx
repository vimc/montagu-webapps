import * as React from "react";
import { settings } from "../../../../shared/Settings";
import { ResponsibilityOverviewTitle } from "./ResponsibilityOverviewTitle";
import { touchstoneActions } from "../../../actions/TouchstoneActions";
import { responsibilityStore } from "../../../stores/ResponsibilityStore";
import { PageWithHeaderAndNav } from "../../PageWithHeader/PageWithHeaderAndNav";
import { doNothing } from "../../../../shared/Helpers";
import {modellingGroupActions} from "../../../../shared/actions/ModellingGroupActions";
import { ResponsibilityOverviewContent } from "./ResponsibilityOverviewContent";

interface LocationProps {
    groupId: string;
    touchstoneId: string;
}

export class ResponsibilityOverviewPage extends PageWithHeaderAndNav<LocationProps> {
    componentDidMount() {
        setTimeout(() => {
            modellingGroupActions.setCurrentGroup(this.props.location.params.groupId);
            responsibilityStore.fetchTouchstones().catch(doNothing).then(() => {
                touchstoneActions.setCurrentTouchstone(this.props.location.params.touchstoneId);
                responsibilityStore.fetchResponsibilities().catch(doNothing);
            });
        });
    }

    title() {
        return <ResponsibilityOverviewTitle />
    }

    renderPageContent() {
        const supportEmail = `mailto:${settings.supportContact}`;
        return <div>
            On this page you can:
            <ol>
                <li>
                    See an overview of which scenarios your group are responsible for providing impact estimates for.
                    If we have the wrong scenarios listed, please contact us <a href={ supportEmail }>here</a>.
                </li>
                <li>Download demographic data which applies to all scenarios</li>
                <li>Download coverage data for each scenario</li>
                <li>Upload impact estimates for each scenario, and review any problems the system has detected in the
                    uploaded data.
                </li>
                <li>Track progress towards providing impact estimates for all your scenarios</li>
            </ol>
            <ResponsibilityOverviewContent />
        </div>
    }
}