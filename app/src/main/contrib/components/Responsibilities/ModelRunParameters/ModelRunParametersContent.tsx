import * as React from "react";
import { compose, branch, renderComponent} from "recompose";
import { connect } from 'react-redux';

import {TouchstoneVersion} from "../../../../shared/models/Generated";
import {ModelRunParametersSection} from "./ModelRunParametersSection";
import {LoadingElement} from "../../../../shared/partials/LoadingElement/LoadingElement";
import {ContribAppState} from "../../../reducers/contribAppReducers";

export interface ModelRunParametersContentProps {
    touchstone: TouchstoneVersion;
    diseases: string[];
}

export class ModelRunParametersContentComponent extends React.Component<ModelRunParametersContentProps> {
    render(): JSX.Element {
        return <div>
            {
                this.props.diseases.map(d => <ModelRunParametersSection disease={d}  key={d} />)
            }
        </div>;
    }
}

export const mapStateToProps = (state: ContribAppState): Partial<ModelRunParametersContentProps> => {
    return {
        touchstone: state.touchstones.currentTouchstoneVersion,
        diseases: state.responsibilities.responsibilitiesSet
            ? [...new Set(state.responsibilities.responsibilitiesSet.responsibilities.map(r => r.scenario.disease))]
            : []
    }
};

export const ModelRunParametersContent = compose(
    connect(mapStateToProps),
    branch((props: ModelRunParametersContentProps) => !props.touchstone, renderComponent(LoadingElement))
)(ModelRunParametersContentComponent) as React.ComponentClass<Partial<ModelRunParametersContentProps>>;
