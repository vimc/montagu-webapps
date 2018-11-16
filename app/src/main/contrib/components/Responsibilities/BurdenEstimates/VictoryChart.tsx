import * as React from "react";
import {branch, compose, renderComponent} from "recompose";
import {LoadingElement} from "../../../../shared/partials/LoadingElement/LoadingElement";
import {ILookup} from "../../../../shared/models/Lookup";
import {VictoryAxis, VictoryBar, VictoryChart, VictoryStack, VictoryTheme, VictoryTooltip} from 'victory';
import {DataPoint} from "./ChartPrototypingPage";
import {NumberRange} from "../../../../shared/models/Generated";
import {interpolateSpectral, interpolateWarm} from "d3-scale-chromatic";

interface BarChartProps {
    data: ILookup<DataPoint[]>
    ages: NumberRange;
}

export class VictoryStackedBarChartComponent extends React.Component<BarChartProps> {

    renderBars() {
        const children = [];
        for (let x = this.props.ages.minimum_inclusive; x <= this.props.ages.maximum_inclusive; x++){
            const data = this.props.data[x.toString()];
            if (data) {
                children.push(<VictoryBar
                    style={{ data: { fill: interpolateWarm(x/this.props.ages.maximum_inclusive) } }}
                    labelComponent={<VictoryTooltip/>}
                    labels={(d) => "age " + d.age + " :" + d.value}
                    key={x}
                    data={this.props.data[x.toString()]}
                    padding={0}
                    x="year"
                    y="value"
                />)
            }
        }

        return children
    }

    render() {

        return (
            <VictoryChart width={400} height={200}
                          domainPadding={5}>
                <VictoryAxis label={"year"}
                             style={{
                                 tickLabels: {fontSize: 6},
                                 axisLabel: {fontSize: 6, padding: 20}
                             }}/>
                <VictoryAxis style={{
                                 tickLabels: {fontSize: 8},
                                 axisLabel: {fontSize: 8, padding: 30},
                             }}
                             dependentAxis/>
                <VictoryStack>
                    {this.renderBars()}
                </VictoryStack>
            </VictoryChart>
        );
    }
}

export const VictoryStackedBarChart =
    compose<BarChartProps, BarChartProps>(branch((props: BarChartProps) =>
        !props.data, renderComponent(LoadingElement)))(VictoryStackedBarChartComponent);
