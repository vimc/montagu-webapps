import * as React from "react";
import { compose, branch, renderComponent } from "recompose";
import { connect } from 'react-redux';

import {IExtendedResponsibilitySet} from "../../../models/ResponsibilitySet";
import {ModellingGroup} from "../../../../shared/models/Generated";
import {ResponsibilityList} from "./List/ResponsibilityList";
import {ButtonLink} from "../../../../shared/components/ButtonLink";

import {ResponsibilitySetStatusMessage} from "./ResponsibilitySetStatusMessage";
import {LoadingElement} from "../../../../shared/partials/LoadingElement/LoadingElement";
import {ContribAppState} from "../../../reducers/contribAppReducers";

const stochasticParams = require('./stochastic_template_params.csv');

export interface ResponsibilityOverviewContentProps {
    responsibilitySet: IExtendedResponsibilitySet;
    currentDiseaseId: string;
    modellingGroup: ModellingGroup;
}

export const ResponsibilityOverviewContentComponent: React.SFC<ResponsibilityOverviewContentProps> =
    (props: ResponsibilityOverviewContentProps) => {

    const touchstoneId = props.responsibilitySet.touchstone.id;
    const demographyUrl = `/${props.modellingGroup.id}/responsibilities/${touchstoneId}/demographics/`;
    const parametersUrl = `/${props.modellingGroup.id}/responsibilities/${touchstoneId}/parameters/`;

    const paramsSection = <div id="params-section">
        <div className="largeSectionTitle">Parameters</div>
        <div><a key={"params"}
                href={stochasticParams}>Download stochastic parameters template</a>
        </div>
        <ButtonLink href={parametersUrl}>Upload parameters</ButtonLink>
    </div>;
    return <div>
        <ResponsibilitySetStatusMessage status={props.responsibilitySet.status}/>
        <div className="largeSectionTitle">Demographic data</div>
        <div className="mt-3">
            <ButtonLink href={demographyUrl}>Download demographic data</ButtonLink>
        </div>
        {touchstoneId != "201801rfp-1" && paramsSection}
        <div className="largeSectionTitle">Scenarios</div>
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
        modellingGroup: state.groups.currentUserGroup
    }
};


export const ResponsibilityOverviewContent = compose(
    connect(mapStateToProps),
    branch((props: ResponsibilityOverviewContentProps) => (!props.responsibilitySet), renderComponent(LoadingElement))
)(ResponsibilityOverviewContentComponent) as React.ComponentClass<Partial<ResponsibilityOverviewContentProps>>;

