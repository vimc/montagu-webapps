import * as React from "react";
import {branch, compose, renderComponent} from "recompose";
import {LoadingElement} from "../../../../shared/partials/LoadingElement/LoadingElement";
import {ILookup} from "../../../../shared/models/Lookup";
import {DataPoint} from "./ChartPrototypingPage";

import {HorizontalGridLines, VerticalBarSeries, VerticalGridLines, XAxis, XYPlot, YAxis} from 'react-vis';

interface BarChartProps {
    data: ILookup<DataPoint[]>
}

export class ReactVisChartComponent extends React.Component<BarChartProps> {

    render() {
        const keys = Object.keys(this.props.data);

        return (
            <div>
                <XYPlot width={600} height={300} stackBy="y">
                    <VerticalGridLines/>
                    <HorizontalGridLines/>
                    <XAxis/>
                    <YAxis/>
                    {keys.map(k =>
                        <VerticalBarSeries key={k}
                            data={this.props.data[k].map(p => ({x: p.year, y: p.value}))}/>)
                    }

                </XYPlot>
            </div>
        );
    }
}

export const ReactVisStackedBarChart =
    compose<BarChartProps, BarChartProps>(branch((props: BarChartProps) =>
        !props.data, renderComponent(LoadingElement)))(ReactVisChartComponent);