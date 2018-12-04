import * as React from "react";

import {PageArticle} from "../../../../../shared/components/PageWithHeader/PageArticle";
import ScrollableAnchor from "react-scrollable-anchor";
import {InternalLink} from "../../../../../shared/components/InternalLink";
import {settings} from "../../../../../shared/Settings";
import { ResponsibilityGuidanceContentProps, mapStateToGuidanceContentProps} from "./ResponsibilityGuidanceContentProps";
import {connect} from "react-redux";


export class ResponsibilityGuidanceModelOutputsContent2017Component extends React.Component<ResponsibilityGuidanceContentProps> {

    render() :JSX.Element {
        const dalysPdf = require("./guidance-201710-DALYs.pdf");

        return <PageArticle title="Guidance on model outputs: how to generate and upload central and stochastic estimates">
            <div className="alert alert-primary">Guidance for 2017 touchstone {this.props.touchstoneVersion.description}</div>
            <div className="largeSectionTitle">
                Required model outputs
            </div>
            <p>
                In this round of model runs you will need to provide the following:
            </p>
            <table>
                <thead>
                <tr>
                    <th>Item</th>
                    <th>How to create</th>
                    <th>Where to upload complete file(s)</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>Central estimates (multiple files)</td>
                    <td>
                        Download central burden estimate template from Montagu,
                        use this to create one file per scenario
                    </td>
                    <td>Montagu</td>
                </tr>
                <tr>
                    <td>Stochastic estimates (multiple files)</td>
                    <td>
                        Download stochastic burden estimate template from Montagu,
                        use this to create as many files as
                        you need.
                    </td>
                    <td>Dropbox</td>
                </tr>
                <tr>
                    <td>Parameter set to accompany stochastic estimates (1 file per disease)</td>
                    <td>
                        Download stochastic parameters template from Montagu,
                        use this to create your parameter set.
                    </td>
                    <td>Montagu</td>
                </tr>
                <tr>
                    <td>Parameter certificate to accompany stochastic estimates (1 file per disease)</td>
                    <td>You will be able to download this from Montagu once you have uploaded your parameter set.</td>
                    <td>Dropbox</td>
                </tr>
                </tbody>
            </table>
            <p>
                Please refer to the scope of work in your subcontract for details of your deliverables and deadlines.
            </p>
            <div className="mb-3 mt-5">
                <span className="sectionTitle">Central estimates</span>
                &nbsp;(previously known as deterministic estimates)
            </div>
            <p>
                First, download your central burden estimate template from
                the Responsibilities page
                (listed under ‘Scenarios’). These templates are customised
                for each model.
            </p>
            <p>
                You will need to use this template to create one file for each
                scenario, ensuring that you fill in all rows and columns.
                Please contact us (
                <a href={`mailto:${settings.supportContact}`}>
                    {settings.supportContact}
                </a>
                ) if there are
                any problems with this.
            </p>
            <p>
                Your scenarios are shown in the grey headings on the
                Responsibilities page.
                Most modelling groups have three scenarios (routine, no
                vaccination, campaign) but others have more or less. The
                coverage data for each scenario may contain more than one
                coverage set. For instance, depending on the disease the
                campaign scenario may contain both routine and campaign
                coverage to enable us to evaluate the incremental impact
                of campaigns on top of routine vaccination. Details of the
                coverage sets are shown after you click the ‘<strong>Download
                coverage data</strong>’ buttons.
            </p>
            <p>
                Once you have completed one output file for each scenario,
                you should upload each file to Montagu, using the ‘<strong>Upload
                burden estimates</strong>’ buttons on the Responsibilities page.
            </p>
            <p>
                There is no specific filename format to use. This is because
                when you upload through Montagu, the URL of the page you are
                on will determine the scenario.
            </p>
            <p>
                If your central burden estimate uploads successfully, you will
                see a ‘Success’ message. If not, you will see a red header
                explaining the problem.
            </p>
            <p>
                Montagu will also ask you to register how these have been
                calculated, i.e. whether your central estimates are an average
                of your stochastic estimates. (If you are unsure how to answer
                the second question, you can enter ‘N/A’.)
            </p>
            <p>
                If your answers to these questions change between uploading
                your central estimates and your stochastic estimates, you
                should complete this registration step again and re-upload
                your central estimates to Montagu.
            </p>
            <div className="mb-3 mt-5">
                <span className="sectionTitle">Stochastic estimates</span>
                &nbsp;(also known as probabilistic estimates)
            </div>
            <p>
                We require multiple model runs for each scenario, each of which
                is based on a random sample from the joint uncertainty
                distribution (e.g. posterior distribution) of the input
                parameters. As we want to compare the runs across scenarios
                to calculate the impact, the same parameter samples should
                be used across all scenarios, and the runs labelled to ensure
                we can identify them.
            </p>
            <p>
                First, download your stochastic burden estimate template from
                the Responsibilities page
                (listed under ‘Scenarios’). This template is customised
                for each model following the discussions after the test runs.
            </p>
            <p>
                The format is almost identical to the central burden estimate
                template, but there is one additional column ‘run_id’. This
                column labels the particular run, and should link the run to
                the parameter value detailed in the parameter set file.
                Importantly, the runs across all scenarios with the same run
                id should be based on the same parameter values.
            </p>
            <p>
                We require multiple independent realisations in the stochastic
                estimates (30 for the test runs and 200 for the full set of runs). The template file only
                contains all rows for a single realisation, so you will
                need to generate 30 or 200 times as many rows.
            </p>
            <p>
                You will need to use the stochastic burden estimate template
                to create one or more files for each scenario, ensuring that
                you fill in all required rows and columns. If you choose to
                break the data up into multiple files it does not matter how
                you distribute the rows among files (e.g. by country, by
                run_id, by year or even randomly), as long as the data are
                complete, and scenarios are kept separate. The scenarios are
                the same as for your central estimates. Please contact us (
                <a href={`mailto:${settings.supportContact}`}>
                    {settings.supportContact}
                </a>
                ) or use the #montagu-help channel on&nbsp;
                <a href={settings.slackUrl} target="_blank">
                    Slack
                </a>
                &nbsp;if there are any problems with this.
            </p>
            <p>
                Next, rename your stochastic estimate files.
                The filename format should be, for example,&nbsp;
                <strong><em>
                    stochastic_burden_est_YF-IC-Garske_yf-routine-gavi_1.csv
                </em></strong>
                . The first part is from the template filename, the second part
                is the scenario ID (as it appears in Montagu), the final
                number is an arbitrary way to distinguish between
                different files for the same scenario if you choose to split
                the estimates across several files.
            </p>
            <p>
                Once you have completed all files for each scenario, you
                should upload each one to Dropbox, to the specific folder
                that we email you. We will then use scripts to
                automatically process the uploaded files and import them
                into Montagu.
            </p>
            <p>
                If your model changes between uploading your central
                estimates and your stochastic estimates, please let us know
                by emailing&nbsp;
                <a href={`mailto:${settings.supportContact}`}>
                    {settings.supportContact}
                </a>
                &nbsp;or using the #montagu-help channel on&nbsp;
                <a href={settings.slackUrl} target="_blank">
                    Slack
                </a>.
            </p>
            <ScrollableAnchor id={'parameters'}>
                <div className="mb-3 mt-5 sectionTitle">Parameter set file</div>
            </ScrollableAnchor>
            <p>
                First, download your stochastic parameters template from
                the Responsibilities page. You should use this template to
                create one file (a parameter set) that will show us the
                underlying parameter values of your stochastic runs.
            </p>
            <p>
                It is essential that the runs across all scenarios with the
                same ‘run id’ are based on the same parameter values.
            </p>
            <p>
                Your parameters file should contain 30 rows (for the stochastic test runs) or 200 rows (for the full set of stochastic runs), i.e. in
                addition to the row showing the column headings.
            </p>
            <p>
                The column headings in the template are labelled &lt;param_1&gt;
                and &lt;param_2&gt; but you should rename these to the actual
                parameters you are using, and add extra columns if necessary.
                For models explicitly fitted to data, probabilistic outputs can be a sample from the posterior distribution, and each run should be recorded with assumed parameter values as well as the likelihood. If no explicit model fitting has taken place, input parameters should be sampled from reasonable ranges.
            </p>
            <p>
                If the model uses country-specific parameters, each
                country-specific parameter should be given in a separate
                column, using the naming convention &lt;parameter_name&gt;:&lt;ISO&gt;,
                where ISO is the 3-letter country code.
            </p>
            <p>
                Once you have completed your parameter set file, you should
                upload this file via Montagu.
            </p>
            <p>
                Montagu will then give you a ‘parameter certificate’. After
                you have downloaded this, please upload it to Dropbox, to
                the specific folder that we email you. You do not
                need to open or read this file.
            </p>
            <p>
                You should only upload one parameter certificate to Dropbox.
                This must correspond to the exact parameters that underlie your
                stochastic estimates. Therefore, if you discover a mistake in
                your stochastic files or parameter set after you have uploaded
                these to Dropbox, please do all of the following:
            </p>

            <ol style={{listStyleType: "lower-alpha"}}>
                <li>
                    Contact us
                    (<a href={`mailto:${settings.supportContact}`}>{settings.supportContact}</a>)
                    to request a new Dropbox link
                </li>
                <li>
                    Upload your amended parameter set to Montagu and get
                    a new parameter certificate
                </li>
                <li>
                    Upload your new parameter certificate and all stochastic
                    estimate files to the new Dropbox link
                </li>
            </ol>
            If you have any questions, please contact&nbsp;
            <a href={`mailto:${settings.supportContact}`}>{settings.supportContact}</a> or
            use the #montagu-help channel on&nbsp;
            <a href={settings.slackUrl} target="_blank">Slack</a>

            <div className="mb-3 mt-5 sectionTitle">Age groups</div>
            <p>
                The age groups in your burden estimate templates must be
                1-year age groups. If your model uses larger age groups,
                you will need to disaggregate these.
            </p>
            <div className="mb-3 mt-5 sectionTitle">DALYs guidance</div>
            <p>
                <a href={dalysPdf} target="_blank">
                    Download report with detailed guidance on DALYs.
                </a>
            </p>
            <div className="mb-3 mt-5 sectionTitle">Cohort size</div>
            <p>
                The cohort size is the number of people alive in a given
                birth cohort specified by the calendar year and age during
                that year – so it will be the same across all scenarios.
                We will then be able to calculate the number of FVPs
                (fully vaccinated persons) by multiplying this with the
                relevant coverage. The cohort size should be comparable to
                the interpolated population provided on Montagu. The cohort
                size should reflect the age range, time range and gender
                (female, male or both) for which your model is tracking the
                population.
            </p>
            <div className="mb-3 mt-5 sectionTitle">
                Checklist for avoiding errors when uploading to Montagu:
            </div>
            <ul>
                <li>
                    Your file should not contain any empty columns
                </li>
                <li>
                    Values should not contain commas (e.g. 1395 not 1,395)
                </li>
                <li>
                    The demographic/coverage data may include years that are
                    outside the scope we are asking you to provide estimates
                    for. Therefore, you should go by the years that appear
                    in the burden estimate templates.
                </li>
                <li>
                    If your model doesn't provide something that the burden
                    estimate template requires, please contact us (see below).
                </li>
            </ul>
            <p>
                If you have any questions or any problems uploading your
                burden estimates, please email&nbsp;
                <a href={`mailto:${settings.supportContact}`}>
                    {settings.supportContact}
                </a>
                &nbsp;or use the #montagu-help channel on&nbsp;
                <a href={settings.slackUrl} target="_blank">
                    Slack
                </a>.
            </p>
        </PageArticle>
    }
}

export const ResponsibilityGuidanceModelOutputsContent2017 = connect(mapStateToGuidanceContentProps)(ResponsibilityGuidanceModelOutputsContent2017Component);