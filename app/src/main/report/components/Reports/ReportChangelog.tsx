import * as React from "react";
import {connect} from 'react-redux';

import {Changelog} from "../../../shared/models/Generated";
import {shortTimestamp} from "../../../shared/Helpers";
import {VersionIdentifier} from "../../models/VersionIdentifier";
import {ReportAppState} from "../../reducers/reportAppReducers";
import {branch, compose, renderComponent} from "recompose";
import {LoadingElement} from "../../../shared/partials/LoadingElement/LoadingElement";
import {Dispatch} from "redux";
import {reportActionCreators} from "../../actionCreators/reportActionCreators";
import {ContribAppState} from "../../../contrib/reducers/contribAppReducers";
import withLifecycle from "@hocs/with-lifecycle";
import {InternalLink} from "../../../shared/components/InternalLink";

export interface ReportChangelogPublicProps {
    report: string;
    version: string;
}

export interface ReportChangelogProps extends ReportChangelogPublicProps {
    versionChangelog: Changelog[];
    fetchChangelog: (props: ReportChangelogPublicProps) => void;
}

export class ReportChangelogComponent extends React.Component<ReportChangelogProps> {

    render() {

        const header = <h3 className="mb-3">Changelog</h3>;

        if (this.props.versionChangelog.length == 0) {
            return <div>
                {header}
                <p>
                    There is no Changelog for this Report version.
                </p>
            </div>
        }

        let rowIdx = 0;
        return <div>
            {header}
            <table>
                <thead className="changelog-header">
                <tr>
                    <th className="datestring-column">Date</th>
                    <th>Label</th>
                    <th>Text</th>
                </tr>
                </thead>
                <tbody>
                {this.props.versionChangelog.map((changelog: Changelog) => {
                        const badgeType = (changelog.label == "public") ? "published" : "internal";
                        return <tr key={rowIdx++}>
                            <td style={{fontSize: "90%"}}>
                                <InternalLink href={`/${this.props.report}/${changelog.report_version}/`}>
                                    {shortTimestamp(new VersionIdentifier(changelog.report_version).timestamp)}
                                </InternalLink>
                            </td>
                            <td><span className={`badge badge-${badgeType}`}>{changelog.label}</span></td>
                            <td>{changelog.value}</td>
                        </tr>;
                    }
                )
                }
                </tbody>
            </table>
        </div>
    };
}

export const mapStateToProps = (state: ReportAppState): Partial<ReportChangelogProps> => {
    return {
        versionChangelog: state.reports.versionChangelog
    }
};

export const mapDispatchToProps = (dispatch: Dispatch<ContribAppState>): Partial<ReportChangelogProps> => {
    return {
        fetchChangelog: (props: ReportChangelogProps) => dispatch(reportActionCreators.getVersionChangelog(props.report, props.version))
    }
};

export const ReportChangelog = compose<ReportChangelogProps, ReportChangelogPublicProps>(
    connect(mapStateToProps, mapDispatchToProps),
    withLifecycle({
        onDidMount: (props: ReportChangelogProps) => {
            props.fetchChangelog(props);
        },
        onDidUpdate: (prevProps: ReportChangelogProps, props: ReportChangelogProps) => {
            if (props.versionChangelog == null) {
                props.fetchChangelog(props);
            }
        }
    }),
    branch((props: ReportChangelogProps) => props.versionChangelog == null, renderComponent(LoadingElement)),
)(ReportChangelogComponent);
