import * as React from "react";
import { connect } from 'react-redux';

import { Disease, ModellingGroup, Responsibility, ResponsibilitySetStatus, TouchstoneVersion } from "../../../../../shared/models/Generated";
import { ButtonLink } from "../../../../../shared/components/ButtonLink";
import {CurrentEstimateSetSummary} from "./CurrentEstimateSetSummary";
import {ContribAppState} from "../../../../reducers/contribAppReducers";

export interface ResponsibilityScenarioPublicProps {
    responsibility: Responsibility;
    modellingGroup: ModellingGroup;
    touchstone: TouchstoneVersion;
    responsibilitySetStatus: ResponsibilitySetStatus;
}

interface ResponsibilityScenarioProps  extends ResponsibilityScenarioPublicProps {
    diseases: Disease[];
}

export class ResponsibilityScenarioComponent extends React.Component<ResponsibilityScenarioProps, undefined> {
    render() {
        const item = this.props.responsibility;
        const downloadUrl = `/${this.props.modellingGroup.id}/responsibilities/${this.props.touchstone.id}/coverage/${item.scenario.id}/`;
        const uploadUrl = `/${this.props.modellingGroup.id}/responsibilities/${this.props.touchstone.id}/burdens/${item.scenario.id}/`;
        const canUpload = this.props.responsibilitySetStatus == "incomplete";
        const disease = this.props.diseases.find(disease => disease.id === item.scenario.disease);

        return <li className="scenario">
            <div className="header">
                <span className="name">{item.scenario.description}</span>
                &nbsp;
                (ID: {item.scenario.id})
                <span className="status">{item.status}</span>
                <span className="clearfix"></span>
            </div>
            <div>
                <div className="content">
                    <div className="metadata">
                        Disease: {disease.name}
                    </div>
                    <div className="actions">
                        <ButtonLink href={downloadUrl}>Download coverage data</ButtonLink>
                        <ButtonLink href={uploadUrl}>Upload central burden estimates</ButtonLink>
                        <CurrentEstimateSetSummary
                            groupId={this.props.modellingGroup.id}
                            touchstoneId={this.props.touchstone.id}
                            scenarioId={item.scenario.id}
                            estimateSet={this.props.responsibility.current_estimate_set}
                            canUpload={canUpload}
                        />
                    </div>
                </div>
            </div>
        </li>
    }
}

const mapStateToProps = (state: ContribAppState, props: ResponsibilityScenarioProps): ResponsibilityScenarioProps => {
    return {
        ...props,
        diseases: state.diseases.diseases
    }
};

export const ResponsibilityScenario = connect(mapStateToProps)(ResponsibilityScenarioComponent) as
    React.ComponentClass<ResponsibilityScenarioPublicProps>;