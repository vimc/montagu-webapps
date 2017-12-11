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
            <div className="col-12 col-md-6">
                <label
                    htmlFor="report-version-switcher"
                    className="mt-0 sectionTitle">
                    Report version
                </label>
                <select
                    onChange={this.onSelect}
                    value={this.props.currentVersion}
                    className="form-control"
                    id="report-version-switcher">
                    {items}
                </select>
            </div>
        </div>;
    }
}