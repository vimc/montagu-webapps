import * as React from "react";
import {touchstoneActions} from "../../../actions/TouchstoneActions";
import {responsibilityStore} from "../../../stores/ResponsibilityStore";
import {modellingGroupActions} from "../../../../shared/actions/ModellingGroupActions";
import {doNothing} from "../../../../shared/Helpers";
import {DownloadDataTitle} from "../DownloadDataTitle";
import {ContribPageWithHeader} from "../../PageWithHeader/ContribPageWithHeader";
import {IPageWithParent} from "../../../../shared/models/Breadcrumb";
import {ResponsibilityOverviewPage} from "../Overview/ResponsibilityOverviewPage";
import {runParametersStore} from "../../../stores/RunParametersStore";
import {runParameterActions} from "../../../actions/RunParameterActions";
import {ModelRunParameterUploadSection} from "./ModelRunParameterUploadSection";
import {InternalLink} from "../../../../shared/components/InternalLink";

const stochasticParams = require('../Overview/List/stochastic_template_params.csv');

export interface ModelRunParametersProps {
    groupId: string;
    touchstoneId: string;
}

export class ModelRunParametersPage extends ContribPageWithHeader<ModelRunParametersProps> {
    load() {
        runParameterActions.clearUsedToken();
        modellingGroupActions.setCurrentGroup(this.props.location.params.groupId);
        responsibilityStore.fetchTouchstones().catch(doNothing).then(() => {
            touchstoneActions.setCurrentTouchstone(this.props.location.params.touchstoneId);
            responsibilityStore.fetchResponsibilities().catch(doNothing);
            runParametersStore.fetchParameterSets().catch(doNothing);
            runParametersStore.fetchOneTimeParametersToken(this.props.location.pathname).catch(doNothing);
            super.load();
        });
    }

    name() {
        return "Model run parameters";
    }

    title() {
        return <DownloadDataTitle title="Model run parameters"/>
    }

    urlFragment(): string {
        return 'model-run-parameters';
    }

    parent(): IPageWithParent {
        return new ResponsibilityOverviewPage();
    }

    renderPageContent() {
        const guidanceOutputsUrl = `/help/model-outputs/`;

        return <div className="mt-2">
            <p>
                <InternalLink href={guidanceOutputsUrl}>
                    Guidance on creating and uploading model run parameter sets
                </InternalLink>
            </p>
            <p>
                <a key={"params"}
                   href={stochasticParams}>Parameters template</a>
            </p>
            <ModelRunParameterUploadSection/>
        </div>
    }
}