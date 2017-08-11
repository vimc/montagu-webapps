import * as React from 'react';
import { RemoteContentComponent } from "../../../../shared/components/RemoteContentComponent/RemoteContentComponent";
import { RemoteContent } from "../../../../shared/models/RemoteContent";
import { demographicStore } from "../../../stores/DemographicStore";
import { DemographicStatisticType, Touchstone } from "../../../../shared/models/Generated";
import { connectToStores } from "../../../../shared/alt";
import { responsibilityStore } from "../../../stores/ResponsibilityStore";
import { ButtonLink } from "../../../../shared/components/ButtonLink";
import { DemographicOptions } from "./DemographicOptions";

const commonStyles = require("../../../../shared/styles/common.css");
const styles = require("../Responsibilities.css");

interface Props extends RemoteContent {
    dataSets: DemographicStatisticType[];
    selectedDataSet: DemographicStatisticType;
    selectedGender: string;
    touchstone: Touchstone;
}

class DownloadDemographicsContentComponent extends RemoteContentComponent<Props> {
    static getStores() {
        return [demographicStore, responsibilityStore];
    }

    static getPropsFromStores(props: Props): Props {
        const demographicState = demographicStore.getState();
        const responsibilityState = responsibilityStore.getState();
        if (demographicState.currentTouchstone != null) {
            return {
                ready: demographicState.currentTouchstone in demographicState.dataSets,
                selectedDataSet: demographicState.selectedDataSet,
                selectedGender: demographicState.selectedGender,
                dataSets: demographicState.dataSets[demographicState.currentTouchstone],
                touchstone: responsibilityState.currentTouchstone
            };
        } else {
            return {
                ready: false,
                selectedDataSet: null,
                selectedGender: null,
                dataSets: null,
                touchstone: null
            }
        }
    }

    renderContent(props: Props) {
        const canDownload = props.selectedDataSet != null
            && (!props.selectedDataSet.gender_is_applicable || props.selectedGender != null);

        return <div className={styles.demographics}>
            <div className={commonStyles.sectionTitle}>
                Demographic data for {props.touchstone.description}
            </div>
            <div>
                Select the following options to download a CSV file containing demographic data
                for this touchstone.
                Not all data sets are expected to be relevant to all modellers.
            </div>
            <DemographicOptions
                dataSets={props.dataSets}
                selectedDataSet={props.selectedDataSet}
                selectedGender={props.selectedGender} />
            <ButtonLink href="#" disabled={ !canDownload }>Download data set</ButtonLink>
        </div>;
    }
}

export const DownloadDemographicsContent = connectToStores(DownloadDemographicsContentComponent);