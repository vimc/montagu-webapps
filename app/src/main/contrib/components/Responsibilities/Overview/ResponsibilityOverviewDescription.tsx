import * as React from "react";

import {settings} from "../../../../shared/Settings";
import {InternalLink} from "../../../../shared/components/InternalLink";

interface ResponsibilityOverviewDescriptionProps {
    currentTouchstoneId: string;
    groupId: string;
    touchstoneStatus: string;
}

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
};

const TwentyNineteenRfpTouchstone = () => {
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

const TwentyTwentyRfpTouchstone = () => {
    return <div>
        On this page you can:
        <ul>
            <li>Access standardised demographic data for a test country named 'RFP'.</li>
            <li>Download the burden estimate templates for your disease area.</li>
            <li>Submit the burden estimates generated by your model for this one 'RFP' country.</li>
        </ul>
        Output specifications guidance is available on the VIMC website
        (<a href="https://www.vaccineimpact.org/2020-02-10-request-for-proposals/">https://www.vaccineimpact.org/2020-02-10-request-for-proposals/</a>)
        <ContactDetails/>
    </div>
};

export const ResponsibilityOverviewDescription = (props: ResponsibilityOverviewDescriptionProps) => {
    if (props.touchstoneStatus !== "open") {
        return <div>
            <div className="alert alert-danger">This touchstone is no longer open.</div>
            <ContactDetails/>
        </div>;
    }

    if (settings.isApplicantTouchstone(props.currentTouchstoneId)) {
        if (props.currentTouchstoneId.indexOf("2020") > -1) {
            return TwentyTwentyRfpTouchstone()
        }
        else {
            return TwentyNineteenRfpTouchstone()
        }
    } else {
        let guidanceInputsUrl = `/help/model-inputs/${props.currentTouchstoneId}`;
        let guidanceOutputsUrl = `/help/model-outputs/${props.currentTouchstoneId}`;

        if (settings.is2019Touchstone(props.currentTouchstoneId)) {
            guidanceOutputsUrl = require("../Guidance/content/guidance-2019-outputs.pdf");
            guidanceInputsUrl = require("../Guidance/content/guidance-2019-inputs.pdf");
        }

        let templatesInfo;
        let outputGuidanceLinkText;
        let stochasticEstimatesText;

        const omitGuidance = settings.isNoGuidanceTouchstone(props.currentTouchstoneId);
        const guidanceAsPdfs = settings.is2019Touchstone(props.currentTouchstoneId);

        if (settings.isVersionOfStochasticTouchstone(props.currentTouchstoneId)) {
            templatesInfo = <li>
                Download csv templates for central and stochastic burden estimates,
                and for underlying parameter values.
            </li>;
            outputGuidanceLinkText = "Guidance on model outputs: how to generate and upload central and stochastic estimates";
            stochasticEstimatesText = "In the future, you will also be able to upload stochastic burden estimates for each scenario."
        } else {
            templatesInfo = <li>
                Download csv templates for central burden estimates.
            </li>;
            outputGuidanceLinkText = "Guidance on model outputs: how to generate and upload central estimates";
            stochasticEstimatesText = "Stochastic estimates are not required for this touchstone. Please provide central estimates only";
        }

        return <div>
            On this page you can:
            <ul>
                <li>
                    See an overview of which scenarios your group is responsible
                    for providing burden estimates for.
                </li>
                <li>
                    Download vaccination coverage data for each scenario.
                </li>
                <li>
                    Download demographic data which applies to all scenarios.
                    Please use the demographic datasets supplied to ensure consistency
                    between all models.
                </li>
                {templatesInfo}
                <li>
                    Upload central burden estimates for each scenario, and review any
                    problems the system has detected in the uploaded data.
                </li>
                {
                    settings.isVersionOfStochasticTouchstone(props.currentTouchstoneId) &&
                    <li>
                        Upload your parameters file.
                    </li>
                }
            </ul>
            <p>
                {stochasticEstimatesText}
            </p>

                {!omitGuidance &&
                <span id="useful-links">
                        Useful links:
                 </span>
                 }
                {!omitGuidance && !guidanceAsPdfs &&
                <ul>
                    <li>
                        <InternalLink href={guidanceInputsUrl}>
                            Guidance on model inputs: coverage and demographic data
                        </InternalLink>
                    </li>
                    <li><InternalLink href={guidanceOutputsUrl}>
                        {outputGuidanceLinkText}
                    </InternalLink>

                    </li>
                </ul>
                }
                {!omitGuidance && guidanceAsPdfs &&
                <ul>
                    <li>
                        <a href={guidanceInputsUrl} target={"_blank"}>
                            Guidance on model inputs: coverage and demographic data
                        </a>
                    </li>
                    <li>
                        <a href={guidanceOutputsUrl} target={"_blank"}>
                            {outputGuidanceLinkText}
                        </a>
                    </li>
                </ul>
                }


            <ContactDetails/>
        </div>
    }
};
