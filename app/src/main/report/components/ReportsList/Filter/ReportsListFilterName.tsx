import * as React from "react";
import {ReportsFilterFields} from "../../../actionTypes/ReportsActionsTypes";
import {asReactEvent} from "../../../../shared/Helpers";

interface ReportsListFilterNameProps {
    filterData: ReportsFilterFields;
    onQueryChange: (query: string) => void;
}

export class ReportsListFilterName extends React.PureComponent<ReportsListFilterNameProps> {
    render(): JSX.Element {
        const {filterData, onQueryChange} = this.props;
        return <div className="col-12 col-lg-6">
            <label className="h3">Search</label>
            <input type="text"
                   value={(filterData.query || "")}
                   onChange={asReactEvent(onQueryChange)}
                   onKeyUp={this.clearQueryOnEscape.bind(this)}
                   className="form-control"
                   placeholder="Report name"/>
        </div>;
    }

    clearQueryOnEscape(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key == "Escape") {
            this.props.onQueryChange("");
        }
    }
}
