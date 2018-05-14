import * as React from "react";
import {Report} from "../../../shared/models/Generated";
import ReactTable, {Column, Filter, RowRenderProps} from 'react-table'
import {longDate} from "../../../shared/Helpers";
import {InternalLink} from "../../../shared/components/InternalLink";
import {ReportListDateFilter} from "./ReportListDateFilter";

export interface ReportsListComponentProps {
    reports: Report[]
    isReviewer: boolean;
}

export const ReportsListComponent: React.StatelessComponent<ReportsListComponentProps>
    = (props: ReportsListComponentProps) => {

    const columns: Column[] =
        [{
            Header: "Name",
            accessor: "name",
            Cell: (row: RowRenderProps) => {
                let name = row.value;
                const report = row.row._original as Report;
                if (report.display_name) {
                    name = report.display_name + ` (${report.name})`
                }
                return <div>
                    <InternalLink href={`/${report.name}/${report.latest_version}/`}>
                        {name}
                    </InternalLink>
                </div>
            }
        },
            {
                Header: "Latest version",
                id: "latest_version",
                width: 340,
                accessor: (report: Report) => new Date(report.updated_on),
                Cell: (row: RowRenderProps) => {
                    const report = row.row._original as Report;
                    return <div className="small">
                        <div>{report.latest_version}</div>
                        <div>({longDate(row.value)})</div>
                    </div>
                },
                filterMethod: (filter: Filter, row: any) => {
                    const report = row._original as Report;
                    return row[filter.id] <= filter.value.end
                        && row[filter.id] >= filter.value.start &&
                        report.latest_version.indexOf(filter.value.versionId) > -1;
                },
                Filter: ({ filter, onChange }) => {
                    const value = filter ? filter.value : {start: new Date("2017-03-01T00:00:00"),
                        end: new Date(), versionId: ""};
                    return <div>
                        <input type={"text"} className={"form-control mb-1 "} value={value.versionId}
                               onChange={event => onChange({
                                   end: value.end,
                                   start: value.start,
                                   versionId: event.target.value})}/>
                        <ReportListDateFilter filter={value}
                                          timeFromSelected={(date: Date) => onChange({start: date, end: value.end,
                                              versionId: value.versionId})}
                                          timeUntilSelected={(date: Date) => onChange({end: date, start: value.start,
                                              versionId: value.versionId})}/>
                    </div>
                }
            },
            {
                Header: "Author",
                accessor: "author"
            },
            {
                Header: "Requester",
                accessor: "requester"
            },
            {
                Header: "Status",
                accessor: "published",
                id: "published",
                width: 110,
                Cell: ({value}) => (value ?
                    <span className="ml-1 badge-published badge d-none d-sm-inline mr-2">published</span> :
                    <span className="ml-1 badge-internal badge d-none d-sm-inline mr-2">internal</span>),
                filterMethod: (filter: Filter, row: any) => {
                    if (filter.value === "all") {
                        return true;
                    }
                    if (filter.value === "published") {
                        return row[filter.id];
                    }
                    return !row[filter.id];
                },
                Filter: ({ filter, onChange }) =>
                    <select className="form-control"
                        onChange={event => onChange(event.target.value)}
                        value={filter ? filter.value : "all"} >
                        <option value="all">All</option>
                        <option value="published">Published</option>
                        <option value="internal">Internal</option>
                    </select>
            }];

    return <ReactTable
        defaultFilterMethod={(filter, row) =>
            String(row[filter.id]).toLowerCase().indexOf(filter.value.toLowerCase()) > -1}
        filterable
        className="-striped -highlight"
        data={props.reports}
        columns={columns}/>;
};