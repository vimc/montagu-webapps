
import * as React from "react";
import { PageWithHeaderAndNav } from "./PageWithHeader/PageWithHeaderAndNav";

const commonStyles = require("../../shared/styles/common.css");

export class InputGuidance extends PageWithHeaderAndNav<undefined> {
    title() {
        return <span>Guidance on model inputs: coverage and demographic data</span>;
    }

    renderPageContent() {
        return <div>
            <h1>
                Input data sources
            </h1>
            <p>
              Both coverage and demographic datasets to be used in the full model runs are available for download through Montagu. You must download and use these datasets, rather than your own datasets.
            </p>
            <h1>  
                  Coverage
            </h1>
            <p>
              The first set of full model runs generated within the VIMC will assume vaccination coverage as detailed in Gavi’s Operational Forecast v15 (released October 2017), which details coverage for both routine and campaign vaccination in the Gavi 73 countries from 2017 to 2030. This will be combined with coverage data from various other sources, some of which has been extrapolated by us, in order to cover all countries and time periods.
            </p>
           <table>
                  <tr>
                    <th>Country set</th>
                    <th>Period</th>
                    <th>Type</th>
                    <th>Source</th>
                  </tr>
                  <tr>
                    <td>Gavi 73</td>
                    <td>2017-2030</td>
                    <td>Routine</td>
                    <td>Gavi OF v15</td>
                  </tr>
                  <tr>
                    <td>Gavi 73</td>
                    <td>2017-2030</td>
                    <td>Campaign</td>
                    <td>Gavi OF v15</td>
                  </tr>
                  <tr>
                    <td>Gavi 73</td>
                    <td>Up to 2016</td>
                    <td>Routine</td>
                    <td>WUENIC</td>
                  </tr>
                  <tr>
                    <td>Gavi 73</td>
                    <td>Up to 2016</td>
                    <td>Campaign</td>
                    <td>Gavi records of past campaigns</td>
                  </tr>
                  <tr>
                    <td>Other 25 countries</td>
                    <td>2017 onwards</td>
                    <td>Routine</td>
                    <td>Extrapolated from WUENIC routine coverage data by VIMC secretariat, to cover future years.</td>
                  </tr>
                  <tr>
                    <td>Other 25 countries</td>
                    <td>2017 onwards</td>
                    <td>Campaign</td>
                    <td>Extrapolated from various sources by VIMC secretariat</td>
                  </tr>
                  <tr>
                    <td>Other 25 countries</td>
                    <td>Up to 2016</td>
                    <td>Routine</td>
                    <td>WUENIC</td>
                  </tr>
                  <tr>
                    <td>Other 25 countries</td>
                    <td>Up to 2016</td>
                    <td>Campaign</td>
                    <td>Gavi records of past campaigns</td>
                  </tr>
            </table>
            <p>
        Each scenario is based on vaccination coverage from up to 3 different coverage sets (e.g. routine and campaign). The datasets to download contain data on all coverage sets to be included in a particular scenario. Note that there are no coverage sets included in the no vaccination scenario, and therefore the coverage file does not contain any data apart from the header row.
            </p>
            <p>
            </p>
            <h1>  
                  Demography
            </h1>    
            <p>
            <strong>Q. What is the source of the demographic data provided via Montagu?</strong>
            <br>
                A. The demographic data used in these model runs is based on the 2017 UNWPP (Revision of UN World Population Prospects).
            </p>
            <p>
            <strong>Q. Is there any documentation for the demographic data sources?</strong>
            <br>
                A. The documentation for the UNWPP data can be found at <a href="https://esa.un.org/unpd/wpp/">https://esa.un.org/unpd/wpp/</a>. We also have additional descriptions for how we created data for the following:
                <ul>
                    <li>
                        Kosovo
                    </li>
                    <li>
                       Marshall Islands
                    </li>
                    <li>
                       Tuvalu
                    </li>
                    <li>
                       Neonatal mortality
                    </li>
                    <li>
                       Population for over-80 year olds before 1990
                    </li>
                </ul>
            </p>
                <p>
                <strong>Q. Can I use a different set of demographic data, rather than the set provided on Montagu?</strong>
                <br>
                A. No. In order to ensure consistency between all models, you must use the demographic data provided via Montagu.
                </p>
                <p>
                <strong>Q. Why does male + female not equal the total population?</strong>
                <br>
                A. This is a property of the UNWPP data; they provide separate data for male, female, and total, and we provide the same data.
                </p>
                <p>
                <strong>Q. Why is population at birth (age 0) not the same as the number of births?</strong>
                <br>
                A.
                </p>
                <p>
                <strong>Q. </strong>
                <br>
                A. In UNWPP data, ‘age 0-0’ refers to all people between age 0 and age 0.999999. This value also takes into account migration effects.
                </p>
                <p>
                <strong>Q. I require demographic data that isn't available on Montagu. What should I do?</strong>
                <br>
                A. Please contact us at <a href="mailto:montagu-help@imperial.ac.uk">montagu-help@imperial.ac.uk</a>.
                </p>
                <p>
                <strong>Q. Can I download all demographic data in one download?</strong>
                <br>
                A. We are working on this functionality for future runs, but for the current runs you will need to download each demographic dataset separately. 
                </p>        
                 </div>;
    }
}
