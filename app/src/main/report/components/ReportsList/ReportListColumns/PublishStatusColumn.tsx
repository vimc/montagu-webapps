import * as React from "react";
import {FilterGeneric, FilterProps, ReportRowProps, ReportRowRenderProps} from "../ReportListTable";

export const PublishStatusCell: React.SFC<ReportRowRenderProps> = (props: ReportRowRenderProps) => {
    return props.value ?
        <span className="badge-published badge ">published</span> :
        <span className="badge-internal badge">internal</span>
};

export const PublishStatusFilter: React.SFC<FilterProps<string>> = (props: FilterProps<string>) => {
    return <select className="form-control"
                   onChange={event => props.onChange(event.target.value)}
                   value={props.filter ? props.filter.value : "all"}>
        <option value="all">All</option>
        <option value="published">Published</option>
        <option value="internal">Internal</option>
    </select>
};

export const publishStatusFilterMethod = (filter: FilterGeneric<string>, row: ReportRowProps) => {
    const published = row.published;
    if (filter.value === "all") {
        return true;
    }
    if (filter.value === "published") {
        return published;
    }
    return !published;
};