import * as React from "react";
import ScrollableAnchor from 'react-scrollable-anchor';

import {ContribPageWithHeader} from "../../../PageWithHeader/ContribPageWithHeader";
import { ChooseGroupPage } from "../../../ChooseGroup/ChooseGroupPage";
import { settings } from "../../../../../shared/Settings";
import { InternalLink } from "../../../../../shared/components/InternalLink";

const commonStyles = require("../../../../../shared/styles/common.css");

const embeddedHtml = require('./html/childmortality.html');

export class ResponsibilityGuidanceNeonatalMortality extends ContribPageWithHeader<undefined> {
    name() {
        return "Child Mortality";
    }

    urlFragment() {
        return "help/neonatal-mortality/";
    }

    title() {
        return <span>Discussion and methods for Child Mortality</span>;
    }

    hideTitle(): boolean {
        return true;
    }

    parent() {
        return new ChooseGroupPage();
    }

    renderPageContent() {
        return <div>
            <iframe src={embeddedHtml} width="100%" height="2008px" frameBorder="0"></iframe>
        </div>;
    }
}