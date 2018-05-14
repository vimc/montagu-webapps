import * as React from "react";

import {CalendarIcon} from "./Calendar";
import {DatePicker} from "../../../shared/components/DatePicker/DatePicker";

interface ReportsListFilterProps {
    filter: { start: Date, end: Date },
    timeFromSelected: (date: Date) => void;
    timeUntilSelected: (date: Date) => void;
}

const fromMonth = new Date("2017-03-01T00:00:00");
const toMonth = new Date;

export const ReportListDateFilter: React.StatelessComponent<ReportsListFilterProps> = (props: ReportsListFilterProps) => (
    <div className="report-date-filters">
        <div className="d-inline-block date-filter">
            <div className="input-group">
                <div className="input-group-prepend">
                <span className="input-group-text">
                    <CalendarIcon/>
                </span>
                </div>
                <DatePicker
                    onChange={props.timeFromSelected}
                    value={props.filter.start ? new Date(props.filter.start) : fromMonth}
                    fromMonth={fromMonth}
                    toMonth={toMonth}
                />
            </div>
        </div>
        <span> to </span>
        <div className="d-inline-block date-filter">
            <div className="input-group picker-on-right">
                <div className="input-group-prepend">
                <span className="input-group-text">
                    <CalendarIcon/>
                </span>
                </div>
                <DatePicker
                    onChange={props.timeUntilSelected}
                    value={props.filter.end ? new Date(props.filter.end) : toMonth}
                    fromMonth={fromMonth}
                    toMonth={toMonth}
                />
            </div>
        </div>
    </div>
);