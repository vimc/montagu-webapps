import * as React from "react";

import {DiseaseFilter} from "./DiseaseFilter";
import {ResponsibilityScenario} from "./ResponsibilityScenario";
import {IExtendedResponsibilitySet} from "../../../../models/ResponsibilitySet";
import {ModellingGroup, Responsibility} from "../../../../../shared/models/Generated";
import {settings} from "../../../../../shared/Settings";

export interface ResponsibilityListComponentProps {
    responsibilitySet: IExtendedResponsibilitySet;
    currentDiseaseId: string;
    modellingGroup: ModellingGroup;
}

export class ResponsibilityList extends React.Component<ResponsibilityListComponentProps, undefined> {
    getResponsibilities(props: ResponsibilityListComponentProps): Responsibility[] {
        const set = props.responsibilitySet;
        if (set) {
            let reps = set.responsibilities;
            if (props.currentDiseaseId) {
                reps = reps.filter(r => r.scenario.disease == props.currentDiseaseId);
            }
            return reps;
        } else {
            return [];
        }
    }

    render(): JSX.Element {
        const props = this.props;
        const reps = this.getResponsibilities(props);
        if (reps.length) {
            const items = reps
                .sort((a, b) => a.scenario.description > b.scenario.description ? 1 : -1)
                .map((item: Responsibility) =>
                <ResponsibilityScenario
                    key={item.scenario.id}
                    responsibility={item}
                    touchstone={props.responsibilitySet.touchstone}
                    modellingGroup={props.modellingGroup}
                    responsibilitySetStatus={props.responsibilitySet.status}
                />
            );
            return <div>
                <div className="mb-4">
                    <DiseaseFilter/>
                </div>
                <ul className="responsibilities">{items}</ul>
            </div>;
        } else {
            return <div className="message">This modelling group has no responsibilities in this
                touchstone</div>
        }
    }
}