import * as React from "react";
import {Report} from "../../../shared/models/Generated";
import ReactTable, {
    Column, Filter, FilterRender, ReactTableFunction, RowRenderProps,
    TableCellRenderer
} from 'react-table'
import {longDate} from "../../../shared/Helpers";
import {InternalLink} from "../../../shared/components/InternalLink";
import {ReportLatestVersionFilter} from "./ReportListDateFilter";

export interface ReportsListComponentProps {
    reports: Report[]
    isReviewer: boolean;
}

interface ReportRowRenderProps extends RowRenderProps {
    original: Report,
    value: string | LatestVersion | boolean;
}

interface LatestVersion {
    version: string,
    date: Date
}

interface ReportRowProps {
    latest_version: LatestVersion,
    name: string,
    author: string,
    requester: string,
    published: boolean,

    [key: string]: string | boolean | LatestVersion
}

export interface FilterGeneric<T> extends Filter {
    value: T
}

export interface FilterProps<T> {
    filter?: FilterGeneric<T>,
    onChange: ReactTableFunction
}

export const NameCell: React.StatelessComponent<ReportRowRenderProps> = (props: ReportRowRenderProps) => {

    let name = props.value as string;
    const report = props.original;
    if (report.display_name) {
        name = report.display_name + ` (${name})`
    }
    return <div>
        <InternalLink href={`/${report.name}/${report.latest_version}/`}>
            {name}
        </InternalLink>
    </div>
};

export const LatestVersionCell: React.StatelessComponent<ReportRowRenderProps> = (props: ReportRowRenderProps) => {
    const value = props.value as LatestVersion;
    return <div className="small">
        <div>{value.version}</div>
        <div>({longDate(value.date)})</div>
    </div>
};

export const PublishStatusCell: React.StatelessComponent<ReportRowRenderProps> = (props: ReportRowRenderProps) => {
    return props.value ?
        <span className="ml-1 badge-published badge d-none d-sm-inline mr-2">published</span> :
        <span className="ml-1 badge-internal badge d-none d-sm-inline mr-2">internal</span>
};

export const PublishStatusFilter = (props: FilterProps<string>) => {
    return <select className="form-control"
                   onChange={event => props.onChange(event.target.value)}
                   value={props.filter ? props.filter.value : "all"}>
        <option value="all">All</option>
        <option value="published">Published</option>
        <option value="internal">Internal</option>
    </select>
};

export const TextFilter: FilterRender = (props: FilterProps<string> ) => {

    const value = props.filter ? props.filter.value : "";

    return <input type={"text"} className={"form-control mb-1 "} value={value}
                  placeholder="Type to filter..."
                  onChange={event => props.onChange(event.target.value)}/>
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

export const versionFilterMethod = (filter: Filter, row: ReportRowProps) => {
    const lastUpdatedDate = row.latest_version.date;
    const lastVersionId = row.latest_version.version;

    return lastUpdatedDate <= filter.value.end
        && lastUpdatedDate >= filter.value.start &&
        lastVersionId.indexOf(filter.value.versionId) > -1;
};

export const latestVersionAccessorFunction = (data: Report): LatestVersion => {
    return {version: data.latest_version, date: new Date(data.updated_on)}
};

export const ReportsListComponent: React.StatelessComponent<ReportsListComponentProps>
    = (props: ReportsListComponentProps) => {

    // Note: if these column headers change, you must also change ./styles/report-table.scss
    // where the headers are hard-coded for small devices
    const columns: Column[] =
        [{
            Header: "Name",
            accessor: "name",
            Cell: NameCell,
            Filter: TextFilter
        },
            {
                Header: "Latest version",
                id: "latest_version",
                width: 340,
                accessor: latestVersionAccessorFunction,
                Cell: LatestVersionCell,
                filterMethod: versionFilterMethod,
                Filter: ReportLatestVersionFilter
            },
            {
                Header: "Author",
                accessor: "author",
                Filter: TextFilter
            },
            {
                Header: "Requester",
                accessor: "requester",
                Filter: TextFilter
            },

        ];

    if (props.isReviewer) {
        columns.push({
            Header: "Status",
            accessor: "published",
            id: "published",
            width: 110,
            Cell: PublishStatusCell,
            filterMethod: publishStatusFilterMethod,
            Filter: PublishStatusFilter
        })
    }

    return <div>
        <h5 className="mb-5">
            Click on a column heading to sort reports by that field
        </h5>
        <ReactTable
            defaultFilterMethod={(filter: Filter, row: ReportRowProps) =>
                String(row[filter.id]).toLowerCase().indexOf(filter.value.toLowerCase()) > -1}
            filterable
            className="-striped -highlight responsive"
            data={props.reports}
            columns={columns}/>
    </div>;
};