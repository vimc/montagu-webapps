import {Touchstone} from "../../../../shared/models/Generated";
import * as React from "react";
import {AdminAppState} from "../../../reducers/adminAppReducers";
import {compose} from "recompose";
import {connect} from "react-redux";
import {partition} from "lodash";
import {TouchstoneTable} from "./TouchstoneTable";

interface TouchstoneListProps {
    active: Touchstone[];
    inactive: Touchstone[];
}

export const TouchstoneListComponent: React.FunctionComponent<TouchstoneListProps> = (props: TouchstoneListProps) => {
    return <div>
        <div className="mb-5 row">
            <div className="col-12">
                <h4>Active touchstones</h4>
                <div className="mb-2">These touchstones have at least one version that is 'open' or 'in-preparation'.</div>
                <TouchstoneTable touchstones={props.active} showFinished={false}/>
            </div>
        </div>
        <div className="mb-5 row">
            <div className="col-12">
                <h4>Inactive touchstones</h4>
                <div className="mb-2">All versions of these touchstones are 'finished'.</div>
                <TouchstoneTable touchstones={props.inactive} showFinished={true}/>
            </div>
        </div>
    </div>;
};

const mapStateToProps = (state: AdminAppState): TouchstoneListProps => {
    const touchstones = state.touchstones.touchstones;
    const [active, inactive] = partition(touchstones, t => t.versions.some(v => v.status != "finished"));
    return {active, inactive}
};

export const TouchstoneList = compose(
    connect(mapStateToProps)
)(TouchstoneListComponent) as React.ComponentClass<{}>;