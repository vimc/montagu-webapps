import * as React from "react";
import {connectToStores} from "../../../../shared/alt";
import {ModellingGroup, Touchstone} from "../../../../shared/models/Generated";
import {RemoteContent} from "../../../../shared/models/RemoteContent";
import {RemoteContentComponent} from "../../../../shared/components/RemoteContentComponent/RemoteContentComponent";
import {responsibilityStore} from "../../../stores/ResponsibilityStore";
import {UploadModelRunParametersForm} from "./UploadModelRunParametersForm";

export interface UploadModelRunParametersContentComponentProps extends RemoteContent {
    touchstone: Touchstone;
    group: ModellingGroup;
    parametersToken: string;
    diseases: string[];
}

export class UploadModelRunParametersContentComponent extends RemoteContentComponent<UploadModelRunParametersContentComponentProps, undefined> {

    static getStores() {
        return [responsibilityStore];
    }

    static getPropsFromStores(): UploadModelRunParametersContentComponentProps {
        const state = responsibilityStore.getState();

        function onlyUnique(value: any, index: number, self: any[]) {
            return self.indexOf(value) === index;
        }

        if (state.parametersOneTimeToken != null) {
            return {
                ready: state.ready,
                touchstone: state.currentTouchstone,
                group: state.currentModellingGroup,
                parametersToken: state.parametersOneTimeToken,
                diseases: [].concat.apply([],
                    state.responsibilitySets.map((set) => set.responsibilities.map(r => r.scenario.disease)))
                    .filter(onlyUnique)
            };
        } else {
            return {
                ready: false,
                touchstone: null,
                group: null,
                parametersToken: null,
                diseases: []
            };
        }
    }

    renderContent(props: UploadModelRunParametersContentComponentProps) {

        return <div className="mt-2">
            <UploadModelRunParametersForm groupId={props.group.id}
                                          token={props.parametersToken}
                                          diseases={props.diseases}
                                          touchstoneId={props.touchstone.id}
            />
        </div>;
    }
}

export const UploadModelRunParametersContent = connectToStores(UploadModelRunParametersContentComponent);