
import * as React from "react";
import { PageWithHeaderAndNav } from "./PageWithHeader/PageWithHeaderAndNav";

const commonStyles = require("../../shared/styles/common.css");

export class InputGuidance extends PageWithHeaderAndNav<undefined> {
    title() {
        return <span>Guidance on model inputs: coverage and demographic data</span>;
    }

    renderPageContent() {
        return <div>
            <p>
                Input data sources
            </p>
            <p>
              Both coverage and demographic datasets to be used in the full model runs are available for download through Montagu. You must download and use these datasets, rather than your own datasets.
            </p>
            <p>
                <ol>
                    <li>
                        list item 1
                    </li>
                    <li>
                       lis item 2
                    </li>
                </ol>
            </p>
            <div className={ commonStyles.subSectionTitle }>Subsection title</div>
            <p>
                sub-section para 1
            </p>
            <p>
                sub-section para 2
            </p>
            <p>
               sub-section para 3
            </p>
        </div>;
    }
}
