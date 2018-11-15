import * as React from "react";
import {UploadBurdenEstimatesContentProps} from "./UploadBurdenEstimatesContent";
import {PageProperties} from "../../../../shared/components/PageWithHeader/PageProperties";
import {PageArticle} from "../../../../shared/components/PageWithHeader/PageArticle";
import {uploadBurdenEstimatesPageActionCreators} from "../../../actions/pages/uploadBurdenEstimatesPageActionCreators";
import {ContribPage} from "../../../ContribPage";
import {ContribAppState} from "../../../reducers/contribAppReducers";
import {isNullOrUndefined} from "util";
import {branch, compose, renderComponent} from "recompose";
import {connect} from "react-redux";
import {LoadingElement} from "../../../../shared/partials/LoadingElement/LoadingElement";
import {VictoryStackedBarChart} from "./VictoryChart";
import {Dispatch} from "redux";
import {estimatesActionCreators} from "../../../actions/estimatesActionCreators";
import {ILookup} from "../../../../shared/models/Lookup";
import {UploadBurdenEstimatesPageLocationProps} from "./UploadBurdenEstimatesPage";
import {ReactVisStackedBarChart} from "./ReactVisChart";
import {RechartsChart} from "./RechartsChart";

export class ChartPrototypingPageComponent extends React.Component<PageProperties<UploadBurdenEstimatesPageLocationProps>> {

    render(): JSX.Element {
        return <PageArticle title={"Prototypes"}>
            <ScenarioChart/>
        </PageArticle>
    }
}

export const ChartPrototypingPage = ContribPage(uploadBurdenEstimatesPageActionCreators)
(ChartPrototypingPageComponent);

interface ChartProps {
    scenarioId: string,
    touchstoneVersionId: string,
    groupId: string;
    getData: () => void;
    data: ILookup<DataPoint[]>
}

export interface DataPoint {
    year: number,
    value: number
}

class ScenarioChartComponent extends React.Component<ChartProps> {

    componentDidMount() {
        this.props.getData();
    }

    render() {
        return <div>
            <VictoryStackedBarChart data={this.props.data}/>
            <ReactVisStackedBarChart data={this.props.data}/>
            <RechartsChart data={this.props.data} />
        </div>
    }
}

const mapStateToProps = (state: ContribAppState): Partial<ChartProps> => {
    return {
        touchstoneVersionId: state.touchstones.currentTouchstoneVersion && state.touchstones.currentTouchstoneVersion.id,
        scenarioId: state.responsibilities.currentResponsibility ? state.responsibilities.currentResponsibility.scenario.id : null,
        groupId: state.groups.currentUserGroup && state.groups.currentUserGroup.id,
        data: state.estimates.deaths
    };
};

export const mapDispatchToProps = (dispatch: Dispatch<ContribAppState>): Partial<ChartProps> => {
    return {
        getData: () => dispatch(estimatesActionCreators.getEstimates())
    }
};

function notReady(props: ChartProps): boolean {
    return isNullOrUndefined(props.scenarioId);
}

const ScenarioChart = compose<ChartProps, {}>(
    connect(mapStateToProps, mapDispatchToProps),
    branch(notReady, renderComponent(LoadingElement))
)(ScenarioChartComponent);