import * as React from "react";
import { ModellingGroup, Touchstone } from "../../../shared/models/Generated";
import { RemoteContent } from "../../../shared/models/RemoteContent";
import { ButtonLink } from "../../../shared/components/ButtonLink";

const commonStyles = require("../../../shared/styles/common.css");
const styles = require("./TouchstoneList.css");
const chooseStyles = require("./Choose.css");

export interface TouchstoneListProps extends RemoteContent {
    touchstones: Touchstone[];
    group: ModellingGroup;
}

export class TouchstoneList extends React.Component<TouchstoneListProps, undefined> {
    renderFinished(content: TouchstoneListProps): JSX.Element {
        const finished = content.touchstones.filter(x => x.status != "open");
        if (finished.length > 0) {
            const items = finished.map((touchstone: Touchstone) =>
                <li key={ touchstone.id}>
                    { this.renderButton(touchstone) }
                </li>
            );
            return <ul className={ chooseStyles.list }>{ items }</ul>
        } else {
            return <div>There are no past touchstones.</div>
        }
    }

    renderOpen(content: TouchstoneListProps): JSX.Element {
        const open = content.touchstones.find(x => x.status == "open");
        if (open) {
            return this.renderButton(open);
        } else {
            return <div>There is no open touchstone currently.</div>
        }
    }

    renderButton(touchstone: Touchstone): JSX.Element {
        const url = `/${this.props.group.id}/responsibilities/${touchstone.id}/`;
        return <ButtonLink className={ chooseStyles.choice } href={ url }>{ touchstone.description }</ButtonLink>
    }

    render(): JSX.Element {
        return <div>
            <div className={ styles.openTouchstone }>
                <div className={ commonStyles.subSectionTitle }>Open touchstone</div>
                <div>{ this.renderOpen(this.props) }</div>
            </div>
            <div className={ styles.finishedTouchstones }>
                <div className={ commonStyles.subSectionTitle }>Past finished touchstones</div>
                <div>{ this.renderFinished(this.props) }</div>
            </div>
        </div>;
    }
}