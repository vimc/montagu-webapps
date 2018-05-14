import * as React from "react";

import {
    ReportsFilterFields, ReportsFilterPublishTypes,
} from "../../../actionTypes/ReportsActionsTypes";
import {asReactEvent} from "../../../../shared/Helpers";

interface ReportsListFilterProps {
    filterData: ReportsFilterFields;
    filterPublish: (value: ReportsFilterPublishTypes) => void;
}

export const ReportsListFilterPublished: React.StatelessComponent<ReportsListFilterProps> = (props: ReportsListFilterProps) => (
    <div className="col-12 col-lg-6 form-inline">
        <label className={"report-filter-label"}>Show</label>
        <select
            className="form-control-sm form-control"
            onChange={asReactEvent(props.filterPublish)}
            value={props.filterData.published}
        >
            <option value={ReportsFilterPublishTypes.all}>All</option>
            <option value={ReportsFilterPublishTypes.published}>Published</option>
            <option value={ReportsFilterPublishTypes.not_published}>Internal</option>
        </select>
    </div>
);
