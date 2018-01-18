import * as React from "react";
import {touchstoneActions} from "../../../actions/TouchstoneActions";
import {responsibilityActions} from "../../../actions/ResponsibilityActions";
import {responsibilityStore} from "../../../stores/ResponsibilityStore";
import {modellingGroupActions} from "../../../../shared/actions/ModellingGroupActions";
import {doNothing} from "../../../../shared/Helpers";
import {DownloadDataTitle} from "../DownloadDataTitle";
import {UploadBurdenEstimatesContent} from "./UploadBurdenEstimatesContent";
import {estimateTokenActions} from "../../../actions/EstimateActions";
import {ContribPageWithHeader} from "../../PageWithHeader/ContribPageWithHeader";
import {IPageWithParent} from "../../../../shared/models/Breadcrumb";
import {ResponsibilityOverviewPage} from "../Overview/ResponsibilityOverviewPage";

export interface UploadEstimatesProps {
    groupId: string;
    touchstoneId: string;
    scenarioId: string;
}

export class UploadBurdenEstimatesPage extends ContribPageWithHeader<UploadEstimatesProps> {
    load() {

        estimateTokenActions.clearUsedToken();
        estimateTokenActions.setRedirectPath(this.props.location.pathname);
        modellingGroupActions.setCurrentGroup(this.props.location.params.groupId);
        responsibilityStore.fetchTouchstones().catch(doNothing).then(() => {
            touchstoneActions.setCurrentTouchstone(this.props.location.params.touchstoneId);
            responsibilityStore.fetchResponsibilities().catch(doNothing).then(() => {
                responsibilityActions.setCurrentResponsibility(this.props.location.params.scenarioId);
                responsibilityStore.fetchOneTimeEstimatesToken().catch(doNothing);
                super.load();
            });
        });
    }

    name() {
        const r = responsibilityStore.getState();
        return `Upload burden estimates for ${r.currentResponsibility.scenario.description}`;
    }

    title() {
        return <DownloadDataTitle title="Upload burden estimates"/>
    }

    urlFragment(): string {
        const r = responsibilityStore.getState();
        return `burdens/${r.currentResponsibility.scenario.id}`;
    }

    parent(): IPageWithParent {
        return new ResponsibilityOverviewPage();
    }

    renderPageContent() {
        return <UploadBurdenEstimatesContent/>
    }
}