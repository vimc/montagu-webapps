import * as React from "react";
import {branch, compose, renderComponent} from "recompose";
import {LoadingElement} from "../../../../shared/partials/LoadingElement/LoadingElement";
import {ILookup} from "../../../../shared/models/Lookup";
import {DataPoint} from "./ChartPrototypingPage";
import {Bar, BarChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis} from "recharts"

interface BarChartProps {
    data: ILookup<DataPoint[]>
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
        const keys = Object.keys(this.props.data);
        const wideData = [];
        keys.forEach((key) => {
            series.push(this.props.data[key].map(d => this.mapDataPoint(d, key)))
        });

        const length = series[0].length;
        for (let i = 0; i < length; i++) {

            let dataPoint = {};
            for (let s = 0; s < series.length; s++) {
                dataPoint = Object.assign(series[s][i], dataPoint)
            }
            wideData.push(dataPoint);
        }

        const fills = ["#8884d8", "#8814d8", "#6384d9", "#8874d8"];

        return (
            <div>
                <BarChart width={600} height={300} data={wideData}
                          margin={{top: 20, right: 30, left: 20, bottom: 5}}>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis dataKey="year"/>
                    <YAxis/>
                    <Tooltip/>
                    <Legend/>
                    {keys.map((k, index) => <Bar dataKey={k} key={k} stackId="a" fill={fills[index]}/>)}
                </BarChart>
            </div>
        );
    }
}

export const RechartsChart =
    compose<BarChartProps, BarChartProps>(branch((props: BarChartProps) =>
        !props.data, renderComponent(LoadingElement)))(RechartsComponent);