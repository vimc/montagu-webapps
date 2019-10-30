import * as React from "react";
import {connect} from "react-redux";
import {compose} from "recompose";


import {ContribAppState} from "../../../reducers/contribAppReducers";
import {LoadingElement} from "../../../../shared/partials/LoadingElement/LoadingElement";
import {settings} from "../../../../shared/Settings";
import {ContribPage} from "../../../ContribPage";
import {responsibilityGuidanceModelInputsPageActionCreators} from "../../../actions/pages/responsibilityGuidancePageActionCreators";

import {ResponsibilityGuidancePageProps} from "./ResponsibilityGuidancePageProps";
import {ResponsibilityGuidanceModelInputsContent2017} from "./content/ResponsibilityGuidanceModelInputsContent2017";
import {ResponsibilityGuidanceModelInputsContentDefault} from "./content/ResponsibilityGuidanceModelInputsContentDefault";
import {ResponsibilityGuidanceTouchstoneNotOpenContent} from "./content/ResponsibilityGuidanceTouchstoneNotOpenContent";
import {ResponsibilityGuidanceModelInputsContent2019} from "./content/ResponsibilityGuidanceModelInputsContent201910";

export class ResponsibilityGuidanceModelInputsPageComponent extends React.Component<ResponsibilityGuidancePageProps> {

    render(): JSX.Element {

        if (!this.props.touchstoneVersion) {
            return <LoadingElement/>
        }

        if (this.props.touchstoneVersion.status !== "open") {
            return <ResponsibilityGuidanceTouchstoneNotOpenContent/>
        }

        if (settings.is2017Touchstone(this.props.touchstoneVersion.id)) {
            return <ResponsibilityGuidanceModelInputsContent2017/>
        } else if (settings.is2019Touchstone(this.props.touchstoneVersion.id)) {
            return <ResponsibilityGuidanceModelInputsContent2019/>
        } else {
            return <ResponsibilityGuidanceModelInputsContentDefault/>
        }
    }
}

export const mapStateToProps = (state: ContribAppState, props: Partial<ResponsibilityGuidancePageProps>):
    Partial<ResponsibilityGuidancePageProps> => {
    return {
        touchstoneVersion: state.touchstones.currentTouchstoneVersion,
    }
};

export const ResponsibilityGuidanceModelInputsPage = compose<ResponsibilityGuidancePageProps,
    Partial<ResponsibilityGuidancePageProps>>(
    connect(mapStateToProps), ContribPage(responsibilityGuidanceModelInputsPageActionCreators))(ResponsibilityGuidanceModelInputsPageComponent);






