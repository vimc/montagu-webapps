import * as React from "react";
import { connectToStores } from "../../../alt";
import { CoverageSet, Scenario, Touchstone } from "../../../models/Generated";
import { RemoteContent } from "../../../stores/RemoteContent";
import { RemoteContentComponent } from "../../RemoteContentComponent/RemoteContentComponent";
import { CoverageSetList } from "./CoverageSetList";
import { Store } from "../../../stores/ResponsibilityStore";
import fetcher from "../../../sources/Fetcher";
import { coverageTokenActions } from "../../../actions/CoverageActions";
const commonStyles = require("../../../styles/common.css");

interface ResponsibilityDetails {
    touchstone: Touchstone;
    scenario: Scenario;
    coverageSets: CoverageSet[];
    coverageToken: string;
}

export interface ResponsibilityDetailsProps extends RemoteContent {
    props: ResponsibilityDetails;
}

export class ResponsibilityDetailsComponent extends RemoteContentComponent<ResponsibilityDetailsProps> {
    static getStores() {
        return [ Store ];
    }
    static getPropsFromStores(): ResponsibilityDetailsProps {
        const state = Store.getState();
        const r = state.currentResponsibility;
        if (r != null) {
            return {
                ready: state.ready,
                props: {
                    touchstone: state.currentTouchstone,
                    scenario: r.scenario,
                    coverageSets: r.coverageSets,
                    coverageToken: state.coverageOneTimeToken
                }
            };
        } else {
            return {
                ready: false,
                props: null
            };
        }
    }

    refreshToken(e: React.MouseEvent<HTMLButtonElement>): void {
        setTimeout(() => {
            coverageTokenActions.clearUsedToken();
            Store.fetchOneTimeCoverageToken();
        });
    }

    renderContent(props: ResponsibilityDetailsProps) {
        const data = props.props;
        const url = fetcher.buildURL(`/onetime_link/${data.coverageToken}/`);
        const downloadDisabled = data.coverageToken == null;
        return <div>
            <table className={ commonStyles.specialColumn }>
                <tbody>
                    <tr><td>Touchstone</td><td>{ data.touchstone.description }</td></tr>
                    <tr><td>Scenario</td><td>{ data.scenario.description }</td></tr>
                </tbody>
            </table>
            <CoverageSetList coverageSets={ data.coverageSets } />
            <div className={ commonStyles.gapAbove }>
                <form action={ url }>
                    <button onClick={ this.refreshToken }
                            disabled={ downloadDisabled }
                            type="submit">
                        Download combined coverage set data in CSV format
                    </button>
                </form>
            </div>
        </div>;
    }
}

export const ResponsibilityDetails = connectToStores(ResponsibilityDetailsComponent);