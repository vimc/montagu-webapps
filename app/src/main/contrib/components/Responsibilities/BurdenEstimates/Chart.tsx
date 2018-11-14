import * as React from "react";
import {BarChart, CartesianGrid, XAxis, YAxis, Bar, Legend} from "recharts"
import {Dispatch} from "redux";
import {ContribAppState} from "../../../reducers/contribAppReducers";
import {estimatesActionCreators} from "../../../actions/estimatesActionCreators";
import {branch, compose, renderComponent} from "recompose";
import {connect} from "react-redux";
import {LoadingElement} from "../../../../shared/partials/LoadingElement/LoadingElement";
import {ILookup} from "../../../../shared/models/Lookup";
import {flatMap, flatten} from "../../../../shared/ArrayHelpers";

interface BarChartProps {
    scenarioId: string,
    touchstoneVersionId: string,
    groupId: string,
    getData: () => void,
    data: ILookup<DataPoint[]>
}

interface DataPoint {
    year: number,
    value: number
}

export class StackedBarChartComponent extends React.Component<BarChartProps> {

    componentDidMount() {
        this.props.getData();
    }

    mapPoint(p: DataPoint, keyName: string): any {
        let ret = {
            year: p.year
        };

        // @ts-ignore
        ret[keyName] = p.value;
        return ret
    }

    render() {

        const series = [];
        const fills = ["#8884d8", "#82ca9d", "#8884e8", "#82ca9d"];
        const keys = Object.keys(this.props.data);
        for (var key in this.props.data) {
            // skip loop if the property is from prototype
            if (!this.props.data.hasOwnProperty(key)) continue;

            var dataset = this.props.data[key];
            series.push(dataset.map(p => this.mapPoint(p, key)))

        }

        const data = flatten(series);
console.log(data)

        return (
            <BarChart width={600} height={300} data={data}
                      margin={{top: 20, right: 30, left: 20, bottom: 5}}>
                <CartesianGrid strokeDasharray="3 3"/>
                <XAxis dataKey="year"/>
                <YAxis />
                {keys.map((k, i) => <Bar dataKey={k} fill={fills[i]} stackId={"a"} key={k}/>)}
            </BarChart>
        );
    }
}

export const mapDispatchToProps = (dispatch: Dispatch<ContribAppState>): Partial<BarChartProps> => {
    return {
        getData: () => dispatch(estimatesActionCreators.getEstimates())
    }
};

export const mapStateToProps = (state: ContribAppState) => {
    return {
        data: state.estimates.deaths
    }
};

export const StackedBarChart = compose<BarChartProps, Partial<BarChartProps>>(connect(mapStateToProps, mapDispatchToProps),
    branch((props: BarChartProps) => !props.data, renderComponent(LoadingElement)))(StackedBarChartComponent);
