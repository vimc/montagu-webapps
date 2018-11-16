import * as React from "react";
import {branch, compose, renderComponent} from "recompose";
import {LoadingElement} from "../../../../shared/partials/LoadingElement/LoadingElement";
import {ILookup} from "../../../../shared/models/Lookup";
import {DataPoint} from "./ChartPrototypingPage";
import {format} from "d3-format";

import {HorizontalGridLines,XYPlot, VerticalBarSeries, Hint, VerticalBarSeriesCanvas, VerticalGridLines, XAxis, FlexibleWidthXYPlot, YAxis} from 'react-vis';
import {NumberRange} from "../../../../shared/models/Generated";
import {interpolatePlasma, interpolateSpectral, interpolateWarm} from "d3-scale-chromatic";

interface BarChartProps {
    data: ILookup<DataPoint[]>
    ages: NumberRange;
}

export class ReactVisChartComponent extends React.Component<BarChartProps, any> {

    constructor(props: BarChartProps) {
        super(props);
        this.state  = {

        }
    }


    renderBars() {
        const children = [];
        for (let x = this.props.ages.minimum_inclusive; x <= this.props.ages.maximum_inclusive; x++) {
            const data = this.props.data[x.toString()];
            if (data) {
                children.push(<VerticalBarSeries key={x} color={interpolatePlasma(x/this.props.ages.maximum_inclusive)}
                                                 data={this.props.data[x.toString()]}/>)
            }
        }

        return children
    }

    render() {

        return (
            <div>
                <XYPlot height={300} width={600} stackBy="y">
                    <VerticalGridLines/>
                    <HorizontalGridLines/>
                    <XAxis />
                    <YAxis tickFormat={(tick:any) => {
                        return format('.2s')(tick);
                    }}/>

                    {this.renderBars()}
                </XYPlot>
            </div>
        );
    }
}

export const ReactVisStackedBarChart =
    compose<BarChartProps, BarChartProps>(branch((props: BarChartProps) =>
        !props.data, renderComponent(LoadingElement)))(ReactVisChartComponent);