import * as React from "react";
import {ChangeEvent} from "react";
import {connect, Dispatch} from "react-redux";
import {ReportAppState} from "../../reducers/reportAppReducers";
import {reportsActions} from "../../actions/reportsActions";

export type SearchTagType = "name" | "display_name" | "latest_version";

export class SearchTag {

    field: SearchTagType;
    value: string;

    constructor(field: SearchTagType, value: string) {

        this.field = field;
        this.value = value;
    }
}

export interface SearchProps {
    tags: SearchTag[];
    search: (tag: SearchTag) => void;
}

export interface SearchState {
    matches: SearchTag[];
    selected: SearchTag[];
    value: string;
    padding: number;
}

export class SearchComponent extends React.Component<SearchProps, SearchState> {

    tagMatch = (val: string) => {

        this.setState({
            matches: this.props.tags.filter(t => t.value.includes(val))
        });

    };

    onChange = (e: ChangeEvent<any>) => {
        const val = e.target.value;

        this.setState({
            value: val
        });

        if (val.length > 2) {
            this.tagMatch(val);
        }
    };

    onTagSelect = (e: any) => {
        const val = e.target.id;
        const tagParts = val.split(":");
        const tag = new SearchTag(tagParts[0], tagParts[1]);

        this.setState((prevState: SearchState) => {
            prevState.selected.push(tag);
            return {
                matches: prevState.matches.filter(m => m.field != tag.field || m.value != tag.value),
                selected: prevState.selected,
                value: "",
                padding: prevState.padding + 100
            }
        });

        this.props.search(tag);
    };

    tagResult = (tag: SearchTag): JSX.Element => {

        const id = `${tag.field}:${tag.value}`;
        let badge = "badge-info";

        switch (tag.field) {
            case "name":
                badge = "badge-success";
                break;
            case "display_name":
                badge = "badge-info";
                break;
            case "latest_version":
                badge = "badge-light";
                break;
        }

        return <li key={id}>
            <a href={"#"} onClick={this.onTagSelect}>
                <div className={`badge ${badge}`} id={id}>{tag.field} : {tag.value}</div>
            </a>
        </li>
    };

    badge = (tag: SearchTag): JSX.Element => {

        let badgeClass = "badge-info";
        const id = `${tag.field}:${tag.value}`;

        switch (tag.field) {
            case "name":
                badgeClass = "badge-success";
                break;
            case "display_name":
                badgeClass = "badge-info";
                break;
            case "latest_version":
                badgeClass = "badge-light";
                break;
        }

        const badge = <div key={id} className={`badge ${badgeClass}`}>{tag.field} : {tag.value}
            <button type="button" className="close">
                <span>&times;</span>
            </button>
        </div>;

        return badge
    };

    constructor() {
        super();
        this.onChange = this.onChange.bind(this);
        this.state = {
            matches: [],
            selected: [],
            value: "",
            padding: 10
        }
    }

    render() {
        return <div>
            <h1 className={"h4"}>Search</h1>
            <textarea rows={1} style={{paddingLeft: `${this.state.padding}px`}}
                      className="form-control" id={"search"} onChange={this.onChange} value={this.state.value}>
            </textarea>
            <div className={"text-tags"} style={{marginTop: "-33px", position: "absolute", paddingLeft: "5px"}}>
                {this.state.selected.map(s => this.badge(s))}
            </div>
            <ul className={`p-2 list-unstyled border ${this.state.matches.length > 0 ? "d-block" : "d-none"}`}>
                {this.state.matches.map(m => this.tagResult(m))}
            </ul>
        </div>
    }
}

export const mapDispatchToProps = (dispatch: Dispatch<any>): Partial<SearchProps> => {
    return {
        search: (tag: SearchTag) => dispatch(reportsActions.filterReports(tag))
    }
};

export const mapStateToProps = (state: ReportAppState, props: Partial<SearchProps>): Partial<SearchProps> => {
    return {
        tags: state.reports.tags,
        search: props.search
    }
};

export const Search = connect(mapStateToProps, mapDispatchToProps)(SearchComponent);