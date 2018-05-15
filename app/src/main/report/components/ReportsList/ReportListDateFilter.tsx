import * as React from "react";

import {CalendarIcon} from "./Calendar";
import {DatePicker} from "../../../shared/components/DatePicker/DatePicker";
import {FilterRender} from "react-table";
import {FilterProps} from "./ReportsListComponent";

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

export interface VersionFilterValue {
    start: Date,
    end: Date,
    versionId: string
}

export const ReportLatestVersionFilter = (props: FilterProps<VersionFilterValue>) => {

    const value = props.filter ? props.filter.value : {
        start: new Date("2017-03-01T00:00:00"),
        end: new Date(), versionId: ""
    };

    return <div>
        <input type={"text"} className={"form-control mb-1 "}
               value={value.versionId}
               placeholder="Type to filter by id..."
               onChange={event => props.onChange({
                   end: value.end,
                   start: value.start,
                   versionId: event.target.value
               })}/>
        <ReportListDateFilter filter={value}
                              timeFromSelected={(date: Date) => props.onChange({
                                  start: date, end: value.end,
                                  versionId: value.versionId
                              })}
                              timeUntilSelected={(date: Date) => props.onChange({
                                  end: date, start: value.start,
                                  versionId: value.versionId
                              })}/>
    </div>
}