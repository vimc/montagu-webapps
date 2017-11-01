import {NavState, navStore} from "../../stores/NavStore";
import * as React from 'react';
import {connectToStores} from "../../alt";
import {InternalLink} from "../InternalLink";
import {Breadcrumb} from "../../models/Breadcrumb";

const styles = require("./NavBar.css");

class NavBarComponent extends React.Component<NavState, undefined> {
    static getStores() {
        return [navStore];
    }

    static getPropsFromStores(): NavState {
        return navStore.getState();
    }

    private makeLink(crumb: Breadcrumb): JSX.Element {
        if (crumb.url != null) {
            return <InternalLink href={crumb.url}>
                {crumb.name}
            </InternalLink>;
        } else {
            return <span>{crumb.name}</span>;
        }
    }

    render(): JSX.Element {
        const crumbs = this.props.crumbs.map(c =>
            <div className={styles.chunk} key={c.url}>
                {this.makeLink(c)}
            </div>
        );

        return <div className={styles.navbar}>
            {crumbs}
        </div>
    }
}

export const NavBar = connectToStores(NavBarComponent);