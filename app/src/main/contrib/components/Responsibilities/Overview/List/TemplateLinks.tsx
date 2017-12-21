import * as React from "react";
import { mainStore } from "../../../../stores/MainStore";
import { ExtendedResponsibility } from "../../../../models/ResponsibilitySet";

const stochasticParams = require('./stochastic_template_params.csv');

export interface TemplateLinksProps {
    responsibilities: ExtendedResponsibility[];
    groupId: string
}

export interface TemplateLinkProps{
    diseaseId: string;
    groupId: string;
}

export class TemplateLink extends React.Component<TemplateLinkProps, undefined> {
    render(): JSX.Element {

        const disease = mainStore.getDiseaseById(this.props.diseaseId);
        const href = `/contribution/templates/central_burden_template_${disease.id}-${this.props.groupId}.csv`;
        const hrefStochastic = `/contribution/templates/stochastic_burden_template_${disease.id}-${this.props.groupId}.csv`;

        return <div><div><a key={`${disease.id}-d`}
                            href={href}>{disease.name} - central</a></div>
            <div>
            <a key={`${disease.id}-s`}
               href={hrefStochastic}>{disease.name} - stochastic</a>
            </div>
        </div>;
    }
}

export class TemplateLinks extends React.Component<TemplateLinksProps, undefined> {
    render(): JSX.Element {

        const diseaseIds = [ ...new Set(this.props.responsibilities.map(x => x.scenario.disease)) ];

        if (diseaseIds.length > 0) {
            const links = diseaseIds
                .map(id =>
                    <TemplateLink key={id} diseaseId={id} groupId={this.props.groupId}/>);

            return <div>Download burden estimate templates:<br/>
                {links}
                <div>
                    <a key={"params"}
                       href={stochasticParams}>Stochastic parameters template</a>
                </div>
            </div>;
        } else {
            return <span/>;
        }
    }

}