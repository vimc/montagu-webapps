import * as React from "react";
import {VersionIdentifier} from "../../models/VersionIdentifier";
import {longTimestamp} from "../../../shared/Helpers";

import "../../../shared/styles/common.scss";
import "../../styles/reports.scss";

interface Props {
    currentVersion: string;
    versions: string[];
    onChangeVersion: (version: string) => void;
}

export class ReportVersionSwitcher extends React.Component<Props, undefined> {
    constructor() {
        super();
        this.onSelect = this.onSelect.bind(this);
    }

    onSelect(e: React.ChangeEvent<HTMLSelectElement>) {
        this.props.onChangeVersion(e.target.value);
    }

    render() {
        const versions = this.props.versions.map(v => new VersionIdentifier(v));
        versions.sort((a, b) => b.compareTo(a));
        const items = versions.map(v => {
            return <option value={v.id} key={v.id}>
                {longTimestamp(v.timestamp)}
            </option>
        });
        return <div className="row versionSwitcher">
            <div className="col-12">
                <label className={"font-weight-bold"}
                    htmlFor="report-version-switcher">
                    Version
                </label>
                <select
                    onChange={this.onSelect}
                    value={this.props.currentVersion}
                    className="form-control form-control-sm col-lg-4"
                    id="report-version-switcher">
                    {items}
                </select>
                <div className={"mt-3 font-weight-bold"}>Version notes</div>
                <p>Updated introduction to give more details</p>
            </div>
        </div>;
    }
}