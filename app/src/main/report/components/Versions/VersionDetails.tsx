import * as React from "react";
import {RemoteContent} from "../../../shared/models/RemoteContent";
import {RemoteContentComponent} from "../../../shared/components/RemoteContentComponent/RemoteContentComponent";
import {reportStore} from "../../stores/ReportStore";
import {connectToStores} from "../../../shared/alt";
import {Version} from "../../../shared/models/reports/Report";
import {ParameterList} from "../Parameters/ParameterList";
import {DataLinks} from "../Data/DataLinks";
import {ResourceLinks} from "../Resources/ResourceLinks";
import {settings} from "../../../shared/Settings";
import {ArtefactsList} from "../Artefacts/ArtefactsList";

export interface VersionProps extends RemoteContent {
    versionDetails: Version,
    report: string
}

export class VersionDetailsComponent extends RemoteContentComponent<VersionProps> {
    static getStores() {
        return [reportStore];
    }

    static getPropsFromStores(): VersionProps {

        const s = reportStore.getState();

        return {
            versionDetails: s.versionDetails[s.currentVersion],
            report: s.currentReport,
            ready: s.ready && s.versionDetails[s.currentVersion] != null
        };
    }

    renderContent(props: VersionProps) {

        const url = settings.reportingApiUrl() + "/reports/"
            + props.report + "/"
            + props.versionDetails.id + "/all/";

        const version = props.versionDetails.id;

        return <table>
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
                    <div><a href={url}>Download zip</a></div>
                </td>
                <td>{(new Date(props.versionDetails.date)).toISOString().slice(0, 10)}</td>
                <td><ParameterList {...props.versionDetails.parameters} /></td>
                <td><DataLinks {...props.versionDetails.hash_data} /></td>
                <td><ResourceLinks resources={props.versionDetails.resources} report={props.report} version={version}/></td>
                <td><ArtefactsList artefacts={props.versionDetails.artefacts}
                                   report={props.report}
                                   version={version}/></td>
            </tr>
            </tbody>
        </table>;
    }
}

export const VersionDetails = connectToStores(VersionDetailsComponent);