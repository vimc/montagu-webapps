import * as React from "react";
import ScrollableAnchor from 'react-scrollable-anchor';

import {ContribPageWithHeader} from "../../../PageWithHeader/ContribPageWithHeader";
import { ChooseGroupPage } from "../../../ChooseGroup/ChooseGroupPage";
import { settings } from "../../../../../shared/Settings";
import { InternalLink } from "../../../../../shared/components/InternalLink";

const commonStyles = require("../../../../../shared/styles/common.css");

const imageImr = require('./images/childmortality/imr.gif');
const imageNmr = require('./images/childmortality/nmr.gif');
const imageU5mr = require('./images/childmortality/u5mr.gif');

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

    parent() {
        return new ChooseGroupPage();
    }

    renderPageContent() {
        return <div>
            <div className={ commonStyles.sectionTitle }>
                <em>Wes Hinsley</em>
            </div>
            <div className={ commonStyles.subSectionTitle }>
                <em>14 November 2017</em>
            </div>
            <div className={ commonStyles.largeSectionTitle }>
                Introduction
            </div>
            <p>
                Some of the VIMC modelling groups use child mortality in their models.
                These datasets are commonly presented as Infant Mortality Rate (IMR)
                for under-1 year olds, and Under-5 Mortality Rate (U5MR). A small number
                of groups also use the 28-day Neonatal Mortality Rate (NMR).
            </p>
            <p>
                UNWPP provide IMR and U5MR for 1950-2100, but they do not provide NMR.
                IGME, (
                <a href="http://childmortality.org" target="_blank">
                    http://childmortality.org
                </a>
                ) provide all three, IMR, U5MR and NMR, but they only provide estimates,
                not predictions for the future; their 2017 dataset runs only as far as
                2016. Furthermore, the first time-point for IGME’s estimates varies from
                country-to-country, and even for the three data types within the same
                country.
            </p>
            <p>
                However, it can be well argued from observation that IGME’s estimates
                appear to model closer to reality than UNWPP’s; IGME appears to record
                genuine child mortality events, whereas UNWPP shows evidence of
                considerable smoothing. IGME also provide child mortality data for some
                countries that UNWPP do not; Marshall Islands and Tuvalu are noteworthy
                examples, since they are countries that modellers must provide estimates
                for.
            </p>
            <div className={ commonStyles.largeSectionTitle }>
                Which source to use?
            </div>
            <p>
                For VIMC purposes, the accuracy of data to real-life events is of
                secondary concern; our primary concern is consistency, both in the
                sense that we want all modellers to be using the same demographic data,
                and we want all the variables in that demographic data to be consistent
                with each other.
            </p>
            <p>
                In discussions, UNWPP acknowledged that the IGME’s child mortality data
                is of a higher accuracy towards reality, and if time and funding were
                available, a merging of the two data sources in a consistent way would
                be ideal. This however is not something we should expect to happen soon,
                perhaps ever.
            </p>
            <p>
                In the meantime, the use of IGME’s child mortality data, combined with
                all the other fields from UNWPP would be inconsistent, with the population
                data and life tables of UNWPP not being matched to IGME’s mortality rates,
                which differ from UNWPP’s as we’ll see. In any case, we would need to
                extend IGME’s time range back to 1950 and forward to 2100 to use the two
                source together.
            </p>
            <p>
                VIMC therefore asks that for VIMC work, the groups should use WPP’s
                data for IMR and U5MR, with the understanding this is not the ideal
                choice, but the best compromise. We will then provide Neonatal Mortality
                data, (which UNWPP do not), in a simple way, that is consistent with
                UNWPP, but also is guided by the IGME data.
            </p>
            <div className={ commonStyles.largeSectionTitle }>
                Method
            </div>
            <p>
                Neonatal Mortality Rate (28-day) represents a subset of the 1-year
                Infant Mortality Rate. Therefore, provided that NMR is less than IMR
                (since the rates are measured in deaths per live births), the two will
                be consistent with each other, and will not cause any consistency
                issues with UNWPP, since population is only given at yearly timepoints.
            </p>
            <p>
                We therefore define our hybrid NMR as a scaling of UNWPP’s IMR,
                multipled by IGME’s NMR/IMR fraction. Since IGME’s time-range usually
                starts after, and always finishes before UNWPP’s, we assume the nearest
                available NMR/IMR proportion for time-points that are out of IGME’s
                range.
            </p>
            <div className={ commonStyles.largeSectionTitle }>
                Results
            </div>
            <p>
                Below are the comparisons of UNWPP’s Under-5 and Infant Mortality Rates,
                which Montagu serves, compared to the data from IGME. The graphs show
                that while there appear to be methodological differences between the
                two datasets, they are broadly in agreement.
            </p>
            <p>
                Note also that Kosovo (XK) is represented neither by UNWPP, nor IGME.
                Serbia is used as a substitute; see the separate documentation about
                Kosovo for further discussion.
            </p>
            <p>
                <img src={imageImr} />
                <img src={imageNmr} />
            </p>
            <p>
                Finally, we show Montagu’s hybrid neonatal mortality rate, compared to
                IGME’s. Where the red line is solid, we are able to use IGME data to
                calculate the NMR/IMR scaling; where the line is dotted, either or both
                of those fields is not available from IGME for that time point, so we
                are using the nearest available data.
            </p>
            <p>
                <img src={imageU5mr} />
            </p>
        </div>;
    }
}