import * as React from "react";
import {branch, compose, renderComponent} from "recompose";
import {LoadingElement} from "../../../../shared/partials/LoadingElement/LoadingElement";
import {ILookup} from "../../../../shared/models/Lookup";
import {VictoryAxis, VictoryBar, VictoryChart, VictoryStack, VictoryTheme, VictoryTooltip} from 'victory';
import {DataPoint} from "./ChartPrototypingPage";

interface BarChartProps {
    data: ILookup<DataPoint[]>
}

export class VictoryStackedBarChartComponent extends React.Component<BarChartProps> {

    render() {

        const keys = Object.keys(this.props.data);

        return (
            <VictoryChart width={400} height={200}
                          domainPadding={20}
                          theme={VictoryTheme.material}>
                <VictoryAxis label={"year"}
                             style={{
                                 tickLabels: {fontSize: 6},
                                 axisLabel: {fontSize: 6, padding: 20}
                             }}/>
                <VictoryAxis label={"deaths"}
                             style={{
                                 tickLabels: {fontSize: 8},
                                 axisLabel: {fontSize: 8, padding: 30},
                             }}
                             dependentAxis/>
                <VictoryStack>
                    {keys.map(k => <VictoryBar
                        labelComponent={<VictoryTooltip />}
                        labels={(d) => "age " + d.age + " :" + d.value}
                        key={k}
                        data={this.props.data[k]}
                        x="year"
                        y="value"
                    />)}
                </VictoryStack>
            </VictoryChart>
        );
    }
}

export const VictoryStackedBarChart =
    compose<BarChartProps, BarChartProps>(branch((props: BarChartProps) =>
        !props.data, renderComponent(LoadingElement)))(VictoryStackedBarChartComponent);
