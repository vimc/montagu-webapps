import * as React from "react";
import {branch, compose, renderComponent} from "recompose";
import {LoadingElement} from "../../../../shared/partials/LoadingElement/LoadingElement";
import {ILookup} from "../../../../shared/models/Lookup";
import {DataPoint} from "./ChartPrototypingPage";
import {Bar, BarChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis} from "recharts"
import {NumberRange} from "../../../../shared/models/Generated";
import {interpolateSpectral, interpolateWarm} from "d3-scale-chromatic";

interface BarChartProps {
    data: ILookup<DataPoint[]>
    ages: NumberRange;
}

export class RechartsComponent extends React.Component<BarChartProps> {

    mapDataPoint(d: DataPoint, keyName: string) {
        let ret = {
            year: d.year,
        };
        // @ts-ignore
        ret[keyName] = d.value;
        return ret;
    }

    render() {
        const series: any[] = [];
        const wideData = [];

        const keys = [];
        for (let x = this.props.ages.minimum_inclusive; x <= this.props.ages.maximum_inclusive; x++) {
            const data = this.props.data[x.toString()];
            if (data) {
                series.push(this.props.data[x.toString()].map(d => this.mapDataPoint(d, x.toString())));
                keys.push(x);
            }

        }

        const length = series[0].length;
        for (let i = 0; i < length; i++) {

            let dataPoint = {};
            for (let s = 0; s < series.length; s++) {
                if (series[s][i]) {
                    dataPoint = Object.assign(series[s][i], dataPoint)
                }
            }
            wideData.push(dataPoint);
        }

        return (
            <div>
                <BarChart width={800} height={400} data={wideData}
                          margin={{top: 20, right: 30, left: 20, bottom: 5}}>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis dataKey="year"/>
                    <YAxis dataKey={"value"}/>
                    <Tooltip/>
                    <Legend/>
                    {keys.map((k, index) => <Bar dataKey={k} key={k} stackId="a"
                                                 fill={interpolateWarm(index/this.props.ages.maximum_inclusive)}/>)}
                </BarChart>
            </div>
        );
    }
}

export const RechartsChart =
    compose<BarChartProps, BarChartProps>(branch((props: BarChartProps) =>
        !props.data, renderComponent(LoadingElement)))(RechartsComponent);