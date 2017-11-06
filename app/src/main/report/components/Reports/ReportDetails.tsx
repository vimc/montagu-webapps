import * as React from "react";
import {RemoteContent} from "../../../shared/models/RemoteContent";
import {RemoteContentComponent} from "../../../shared/components/RemoteContentComponent/RemoteContentComponent";
import {reportStore} from "../../stores/ReportStore";
import {connectToStores} from "../../../shared/alt";
import {Version} from "../../../shared/models/reports/Report";
import {ParameterList} from "../Parameters/ParameterList";
import {DataLinks} from "../Data/DataLinks";
import {ResourceLinks} from "../Resources/ResourceLinks";
import {ArtefactsList} from "../Artefacts/ArtefactsList";
import {FileDownloadLink} from "../FileDownloadLink";
import {ReportVersionSwitcher} from "./ReportVersionSwitcher";
import {IRouter} from "simple-react-router";

const styles = require("../../styles/reports.css");

interface PublicProps {
    onChangeVersion: (version: string) => void;
}

export interface ReportDetailsProps extends RemoteContent, PublicProps {
    versionDetails: Version;
    report: string;
    allVersions: string[];
}

export class ReportDetailsComponent extends RemoteContentComponent<ReportDetailsProps> {
    static getStores() {
        return [reportStore];
    }

    static getPropsFromStores(props: Partial<ReportDetailsProps>): ReportDetailsProps {
        const s = reportStore.getState();
        return {
            versionDetails: s.versionDetails[s.currentVersion],
            report: s.currentReport,
            allVersions: s.versions[s.currentReport],
            ready: s.ready
                && s.versions[s.currentReport] !== undefined
                && s.versionDetails[s.currentVersion] != null,

            onChangeVersion: props.onChangeVersion
        };
    }

    private renderTable(props: ReportDetailsProps) {
        const url = `/reports/${props.report}/versions/${props.versionDetails.id}/all/`;
        const version = props.versionDetails.id;

        return <table className={styles.versionDetails}>
            <thead>
            <tr>
                <th>Version</th>
                <th>Date created</th>
                <th>Parameters</th>
                <th>Data</th>
                <th>Resources</th>
                <th>Artefacts</th>
            </tr>
            </thead>
            <tbody>
            <tr>
                <td>
                    {props.versionDetails.id}
                    <div><FileDownloadLink href={url}>Download zip</FileDownloadLink></div>
                </td>
                <td>{(new Date(props.versionDetails.date)).toISOString().slice(0, 10)}</td>
                <td><ParameterList {...props.versionDetails.parameters} /></td>
                <td><DataLinks {...props.versionDetails.hash_data} /></td>
                <td><ResourceLinks resources={props.versionDetails.resources} report={props.report} version={version}/>
                </td>
                <td className={styles.artefactColumn}>
                    <ArtefactsList artefacts={props.versionDetails.artefacts}
                                   report={props.report}
                                   version={version}/>
                </td>
            </tr>
            </tbody>
        </table>;
    }

    renderContent(props: ReportDetailsProps) {
        return <div>
            <ReportVersionSwitcher
                currentVersion={props.versionDetails.id}
                versions={props.allVersions}
                onChangeVersion={props.onChangeVersion}
            />
            {this.renderTable(props)}
        </div>
    }
}

export const ReportDetails = connectToStores(ReportDetailsComponent) as ComponentConstructor<PublicProps, undefined>;