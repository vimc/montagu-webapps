import * as React from "react";
import {ILookup} from "../../../shared/models/Lookup";
import {Artefact} from "../../../shared/models/reports/Artefact";
import {ArtefactItem} from "./ArtefactItem";

interface ArtefactsListProps{
    artefacts: ILookup<Artefact>[],
    report: string,
    version: string
}

export class ArtefactsList extends React.Component<ArtefactsListProps, undefined> {

    render() {
        const artefactItems = this.props.artefacts
            .map((artefactLookup)=> {
                const type = Object.getOwnPropertyNames(artefactLookup)[0];
                const artefact: Artefact = artefactLookup[type];
                return <ArtefactItem key={artefact.filenames[0]}
                                     report={this.props.report} version={this.props.version} artefact={artefact} />;
            });

        return <div>
            {artefactItems}
        </div>;
    }
}