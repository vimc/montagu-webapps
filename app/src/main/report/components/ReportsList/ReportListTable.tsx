import * as React from "react";
import {ReportVersion} from "../../../shared/models/Generated";
import ReactTable, {Column, Filter, FilterRender, ReactTableFunction, RowRenderProps} from 'react-table'

import {
    aggregatedVersionFilterMethod,
    BasicVersionDetails,
    getLatestVersion,
    VersionCell,
    versionIdAccessorFunction,
    versionSortMethod
} from "./ReportListColumns/VersionColumn";
import {
    aggregatedPublishStatusFilterMethod,
    PublishStatusCell,
    PublishStatusFilter
} from "./ReportListColumns/PublishStatusColumn";
import {ReportVersionFilter} from "./ReportListColumns/ReportVersionFilter";
import {aggregatedNameFilterMethod, NameCell} from "./ReportListColumns/NameColumn";
import {ButtonGroup} from "reactstrap";

export interface ReportsListTableProps {
    reports: ReportVersion[]
    isReviewer: boolean;
}

export interface ReportRowRenderProps extends RowRenderProps {
    original: ReportVersion,
    value: string | BasicVersionDetails | boolean;
}

export interface ReportRow {
    version: BasicVersionDetails,
    name: string,
    author: string,
    requester: string,
    published?: boolean,
    subRows?: ReportRow[]

    [key: string]: string | boolean | BasicVersionDetails | ReportRow[]
}

export interface FilterGeneric<T> extends Filter {
    value: T
}

export interface FilterProps<T> {
    filter?: FilterGeneric<T>,
    onChange: ReactTableFunction
}

export const TextFilter: FilterRender = (props: FilterProps<string>) => {

    const value = props.filter ? props.filter.value : "";

    return <input type={"text"} className={"form-control mb-1 "} value={value}
                  placeholder="Type to filter..."
                  onChange={event => props.onChange(event.target.value)}/>
};

export const EmptyCell = () => {
    return <span>&nbsp;</span>
};

export const CellWithValue = (row: ReportRowRenderProps) => {
    return <span>{row.value}</span>
};

const getFirstOfAggregatedValues = (vals: any) => vals[0];

export class ReportsListTable extends React.Component<ReportsListTableProps, any> {

    constructor(props: ReportsListTableProps) {
        super(props);
        const expanded = this.allCollapsed(props);
        this.state = {
            expanded: expanded
        }
    }

    allExpanded(props: ReportsListTableProps) {
        const numRows = props.reports.length;
        const expanded = {} as any;
        for (let i = 0; i < numRows; i++) {
            expanded[i] = true;
        }

        return expanded
    }

    allCollapsed(props: ReportsListTableProps) {
        const numRows = props.reports.length;
        const expanded = {} as any;
        for (let i = 0; i < numRows; i++) {
            expanded[i] = false;
        }

        return expanded
    }

    expandAll() {
        const expanded = this.allExpanded(this.props);
        this.setState({expanded})
    }

    collapseAll() {
        const expanded = this.allCollapsed(this.props);
        this.setState({expanded})
    }

    render() {

        // Note: if these column headers change, you must also change ./styles/report-table.scss
        // where the headers are hard-coded for small devices
        const columns: Column[] =
            [
                {
                    Header: "Name",
                    id: "name",
                    Filter: TextFilter,
                    accessor: "name",
                    PivotValue: NameCell,
                    filterMethod: aggregatedNameFilterMethod
                },
                {
                    Header: "Version",
                    id: "version",
                    Cell: VersionCell,
                    width: 345,
                    accessor: versionIdAccessorFunction,
                    sortMethod: versionSortMethod,
                    filterMethod: aggregatedVersionFilterMethod,
                    Filter: ReportVersionFilter,
                    aggregate: getLatestVersion,
                    Aggregated: EmptyCell
                },
                {
                    Header: "Author",
                    accessor: "author",
                    width: 200,
                    Filter: TextFilter,
                    Cell: CellWithValue,
                    Aggregated: CellWithValue,
                    aggregate: getFirstOfAggregatedValues,
                },
                {
                    Header: "Requester",
                    accessor: "requester",
                    width: 200,
                    Cell: CellWithValue,
                    Filter: TextFilter,
                    Aggregated: CellWithValue,
                    aggregate: getFirstOfAggregatedValues,
                },
            ];

        if (this.props.isReviewer) {
            columns.splice(2, 0, {
                Header: "Status",
                accessor: "published",
                id: "published",
                width: 120,
                Cell: PublishStatusCell,
                filterMethod: aggregatedPublishStatusFilterMethod,
                Filter: PublishStatusFilter,
                aggregate: _ => null,
                Aggregated: EmptyCell,
            })
        }

        return <div>
            <h1 className="h3 mb-3">
                Find a report
            </h1>
            <div className="helper-text text-muted mb-2">
                Click on a column heading to sort by that field. Hold shift to multi-sort.
            </div>
            <ButtonGroup className={"mb-3"}>
                <a href={"#"} onClick={this.collapseAll.bind(this)} className={"mr-2"}>Collapse all reports</a>
                /
                <a href={'#'} onClick={this.expandAll.bind(this)} className={"ml-2"}>Expand all reports</a>
            </ButtonGroup>
            <ReactTable
                pivotBy={["name"]}
                defaultSorted={[{id: "version"}]}
                defaultFilterMethod={(filter: Filter, row: ReportRow) =>
                    String(row[filter.id]).toLowerCase().indexOf(filter.value.toLowerCase()) > -1}
                filterable
                expanded={this.state.expanded}
                onExpandedChange={expanded => this.setState({expanded})}
                collapseOnSortingChange={false}
                collapseOnDataChange={false}
                collapseOnPageChange={false}
                defaultPageSize={100}
                className="-striped -highlight responsive"
                data={this.props.reports}
                columns={columns}
                subRowsKey={'subRows'}/>
        </div>;
    }
}