import * as React from "react";
import {compose, branch, renderComponent} from "recompose";
import {connect} from 'react-redux';

import {IExtendedResponsibilitySet} from "../../../models/ResponsibilitySet";
import {ModellingGroup} from "../../../../shared/models/Generated";
import {ResponsibilityList} from "./List/ResponsibilityList";
import {ButtonLink} from "../../../../shared/components/ButtonLink";

import {ResponsibilitySetStatusMessage} from "./ResponsibilitySetStatusMessage";
import {settings} from "../../../../shared/Settings";
import {LoadingElement} from "../../../../shared/partials/LoadingElement/LoadingElement";
import {ContribAppState} from "../../../reducers/contribAppReducers";
import {withConfidentialityAgreement} from "./ConfidentialityAgreement";
import {ResponsibilityOverviewDescription} from "./ResponsibilityOverviewDescription";
import {InternalLink} from "../../../../shared/components/InternalLink";

const stochasticParams = require('./stochastic_template_params.csv');

export interface ResponsibilityOverviewContentProps {
    responsibilitySet: IExtendedResponsibilitySet;
    currentDiseaseId: string;
    modellingGroup: ModellingGroup;
    touchstoneId: string;
}

function paramsSection(props: ResponsibilityOverviewContentProps) {
    if (settings.isStochasticTouchstone(props.touchstoneId) || !settings.isApplicantTouchstone(props.touchstoneId)) {
        const parametersUrl = `/${props.modellingGroup.id}/responsibilities/${props.touchstoneId}/parameters/`;
        return <div id="params-section">
            <div className="largeSectionTitle">Parameters</div>
            <div><a key={"params"}
                    href={stochasticParams}>Download stochastic parameters template</a>
            </div>
            <ButtonLink href={parametersUrl}>Upload parameters</ButtonLink>
        </div>
    } else {
        return null;
    }
}

export const ResponsibilityOverviewContentComponent: React.SFC<ResponsibilityOverviewContentProps> =
    (props: ResponsibilityOverviewContentProps) => {

        const demographyUrl = `/${props.modellingGroup.id}/responsibilities/${props.touchstoneId}/demographics/`;
        const templatesUrl = `/${props.modellingGroup.id}/responsibilities/${props.touchstoneId}/templates/`;

        return <div>
            <ResponsibilityOverviewDescription
                currentTouchstoneId={props.touchstoneId}
            />
            <ResponsibilitySetStatusMessage status={props.responsibilitySet.status}/>
            <div className="largeSectionTitle">Demographic data</div>
            <div className="mt-3">
                <ButtonLink href={demographyUrl}>Download demographic data</ButtonLink>
            </div>
            {paramsSection(props)}
            <div className="largeSectionTitle">Scenarios</div>
            {settings.useNewTemplates &&
            <ButtonLink href={templatesUrl}>Download burden estimate templates</ButtonLink>
            }
            <ResponsibilityList
                modellingGroup={props.modellingGroup}
                responsibilitySet={props.responsibilitySet}
                currentDiseaseId={props.currentDiseaseId}
            />

        </div>
    }

export const mapStateToProps = (state: ContribAppState): Partial<ResponsibilityOverviewContentProps> => {
    return {
        responsibilitySet: state.responsibilities.responsibilitiesSet,
        currentDiseaseId: state.diseases.currentDiseaseId,
        modellingGroup: state.groups.currentUserGroup,
        touchstoneId: state.touchstones.currentTouchstoneVersion.id
    }
};


export const ResponsibilityOverviewContent = compose(
    connect(mapStateToProps),
    branch((props: ResponsibilityOverviewContentProps) => (!props.responsibilitySet), renderComponent(LoadingElement)),
    withConfidentialityAgreement
)(ResponsibilityOverviewContentComponent) as React.ComponentClass<Partial<ResponsibilityOverviewContentProps>>;

