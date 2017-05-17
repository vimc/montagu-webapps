import * as React from "react";
import { PageWithHeader } from "../PageWithHeader/PageWithHeader";
import { touchstoneActions } from "../../actions/TouchstoneActions";
import { responsibilityActions } from "../../actions/ResponsibilityActions";
import { ResponsibilityDetailsTitle } from "./ResponsibilityDetailsTitle";

interface LocationProps {
    touchstoneId: string;
    scenarioId: string;
}

export class ResponsibilityDetailsPage extends PageWithHeader<LocationProps> {
    componentDidMount() {
        touchstoneActions.setCurrentTouchstone(this.props.location.params.touchstoneId);
        responsibilityActions.setCurrentResponsibility(this.props.location.params.scenarioId);
    }

    title() {
        return <ResponsibilityDetailsTitle />
    }

    renderPageContent() {
        return <span>Test</span>
    }
}