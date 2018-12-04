import * as React from "react";

import {settings} from "../../../../shared/Settings";
import {InternalLink} from "../../../../shared/components/InternalLink";
import {PageArticle} from "../../../../shared/components/PageWithHeader/PageArticle";
import {PageProperties} from "../../../../shared/components/PageWithHeader/PageProperties";
import {TouchstoneVersion} from "../../../../shared/models/Generated";
import {ResponsibilityOverviewPageLocationProps} from "./ResponsibilityOverviewPage";

interface ResponsibilityOverviewDescriptionProps {
    currentTouchstoneId: string;
    groupId: string;
    touchstoneStatus: string;
}

const outputGuide = require("./outputs-guide.pdf");


const ContactDetails = () => {
    return <div>
        If you have any questions or anything is not as you expected, please email&nbsp;
        <a href={`mailto:${settings.supportContact}`}>
                        {settings.supportContact}
                    </a>
        &nbsp;or use the #montagu-help
                    channel on&nbsp;
        <a href={settings.slackUrl} target="_blank">Slack</a>.
    </div>
}

const StochasticRfpTouchstone = (countries: String) => {
    return <div>
        On this page you can:
        <ul>
            <li>
                Download vaccination coverage for {countries}
            </li>
            <li>
                Download demographic data for {countries}
            </li>
            <li>
                Download csv templates for central and stochastic burden estimates, and for underlying
                parameter values
            </li>
            <li>
                Upload central burden estimates for each scenario, and review any problems the system has
                detected in the uploaded data
            </li>
            <li>
                Upload your parameters file
            </li>
        </ul>
        Useful links:
        <ul>
            <li>
                <a
                    href={outputGuide}
                    target="_blank">Output specification guidance (PDF)</a>
            </li>
        </ul>
        <ContactDetails/>
    </div>;
};

const JanuaryRfpTouchstone = () => {
    return <div>
        On this page you can:
        <ul>
            <li>
                Access the standardised demographic data (Most of the demographic data is based on the UN
                World Population Prospects (UNWPP) 2017 Revision).
            </li>
            <li>
                Download the burden estimate templates for your disease area.
            </li>
            <li>
                Submit the burden estimates generated by your model for one country of choice.
            </li>
        </ul>
        Output specifications guidance is available on the VIMC website (<a
        href="https://www.vaccineimpact.org/2017-12-19-request-for-proposals-yellow-fever-rubella-Japanese-encephalitis-closing-date-January-30/"
        target="_blank">
        https://www.vaccineimpact.org/2017-12-19-request-for-proposals-yellow-fever-rubella-Japanese-encephalitis-closing-date-January-30/</a>).
        <ContactDetails/>
    </div>;
};


export const ResponsibilityOverviewDescription = (props: ResponsibilityOverviewDescriptionProps) => {
    if (props.touchstoneStatus !== "open"){
        return  <div>
            <div className="alert alert-danger">This touchstone is no longer open.</div>
            <ContactDetails/>
        </div>;
    }

    if (settings.isApplicantTouchstone(props.currentTouchstoneId)) {
        if (settings.isStochasticTouchstone(props.currentTouchstoneId)) {
            return StochasticRfpTouchstone("Nigeria")
        }
        else {
            return JanuaryRfpTouchstone()
        }
    } else {
        const guidanceInputsUrl = `/help/model-inputs/${props.currentTouchstoneId}`;
        const guidanceOutputsUrl = `/help/model-outputs/${props.currentTouchstoneId}`;
        return <div>
            On this page you can:
            <ul>
                <li>
                    See an overview of which scenarios your group is responsible
                    for providing burden estimates for.
                </li>
                <li>
                    Download vaccination coverage data for each scenario.&nbsp;
                    <InternalLink href={guidanceInputsUrl}>
                        More guidance here
                    </InternalLink>.
                </li>
                <li>
                    Download demographic data which applies to all scenarios.
                    Please use the demographic datasets supplied to ensure consistency
                    between all models.&nbsp;
                    <InternalLink href={`${guidanceInputsUrl}#demography`}>
                        More guidance here
                    </InternalLink>.
                </li>
                <li>
                    Download csv templates for central and stochastic burden estimates,
                    and for underlying parameter values.
                </li>
                <li>
                    Upload central burden estimates for each scenario, and review any
                    problems the system has detected in the uploaded data.&nbsp;
                    <InternalLink href={guidanceOutputsUrl}>
                        More guidance here
                    </InternalLink>.
                </li>
                <li>
                    Upload your parameters file.&nbsp;
                    <InternalLink href={guidanceOutputsUrl}>
                        More guidance here
                    </InternalLink>.
                </li>
            </ul>
            <p>
                In the future, you will also be able to upload stochastic burden estimates for each
                scenario.
            </p>
            <span>
                    Useful links:
                </span>
            <ul>
                <li>
                    <InternalLink href={guidanceInputsUrl}>
                        Guidance on model inputs: coverage and demographic data
                    </InternalLink>
                </li>
                <li>
                    <InternalLink href={guidanceOutputsUrl}>
                        Guidance on model outputs: how to generate and upload central
                        and stochastic estimates
                    </InternalLink>
                </li>
            </ul>
            <ContactDetails />
        </div>;
    }
};
