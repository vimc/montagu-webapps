import * as React from "react";
import {IRouter, Location} from "simple-react-router";
import {InternalLink} from "../InternalLink";

const styles = require('./PageWithHeader.css');

export abstract class PageWithHeader<TLocationProps>
    extends React.Component<PageProperties<TLocationProps>, undefined> {

    abstract title(): JSX.Element;

    abstract siteTitle(): string;

    abstract renderPageContent(): JSX.Element;

    abstract logoURL(): string;
    abstract headerStyle(): any;

    render() {
        return <div>
            <header className={styles.header} style={this.headerStyle()}>
                <a href="/"><img src={this.logoURL()} height="80" alt="VIMC"/></a>
                <div className={styles.siteTitle}>
                    <InternalLink href="/">{this.siteTitle()}</InternalLink>
                </div>
                {this.header()}
            </header>
            {this.postHeader()}
            <article className={`${styles.page} container`}>
                <div className={styles.pageTitle}>{this.title()}</div>
                <div className={styles.pageContent}>{this.renderPageContent()}</div>
            </article>
        </div>
    }

    header(): JSX.Element {
        return null;
    }

    postHeader(): JSX.Element {
        return null;
    }
}

export interface PageProperties<T> {
    location: Location<T>;
    router: IRouter;
}