import * as React from "react";
import { touchstoneActions } from "../../../actions/TouchstoneActions";
import { responsibilityActions } from "../../../actions/ResponsibilityActions";
import { responsibilityStore } from "../../../stores/ResponsibilityStore";
import { modellingGroupActions } from "../../../../shared/actions/ModellingGroupActions";
import { doNothing } from "../../../../shared/Helpers";
import { DownloadDataTitle } from "../DownloadDataTitle";
import { UploadBurdenEstimatesContent } from "./UploadBurdenEstimatesContent";
import { estimateTokenActions } from "../../../actions/EstimateActions";
import {ContribPageWithHeader} from "../../PageWithHeader/ContribPageWithHeader";

interface LocationProps {
    groupId: string;
    touchstoneId: string;
    scenarioId: string;
}

export class UploadBurdenEstimatesPage extends ContribPageWithHeader<LocationProps> {
    componentDidMount() {
        super.componentDidMount();
        setTimeout(() => {
            estimateTokenActions.clearUsedToken();
            modellingGroupActions.setCurrentGroup(this.props.location.params.groupId);
            responsibilityStore.fetchTouchstones().catch(doNothing).then(() => {
                touchstoneActions.setCurrentTouchstone(this.props.location.params.touchstoneId);
                responsibilityStore.fetchResponsibilities().catch(doNothing).then(() => {
                    responsibilityActions.setCurrentResponsibility(this.props.location.params.scenarioId);
                    responsibilityStore.fetchOneTimeEstimatesToken().catch(doNothing)
                });
            });
        });
    }

    name() {
        return "Upload burden estimates";
    }

    title() {
        return <DownloadDataTitle title="Upload burden estimates"/>
    }

    renderPageContent() {
        return <UploadBurdenEstimatesContent />
    }
}