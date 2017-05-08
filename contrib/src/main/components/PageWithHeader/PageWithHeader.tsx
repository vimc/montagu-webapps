import * as React from 'react'
import { Location, Link } from 'simple-react-router';

const logo = require("./logo.png");
const styles = require('./PageWithHeader.css');

export abstract class PageWithHeader<TLocationProps, TProps extends PageProperties<TLocationProps>, TState>
    extends React.Component<TProps, TState> {
    abstract title(): JSX.Element;
    abstract renderPageContent(): JSX.Element;

    render() {
        return <div>
            <header className={ styles.header }>
                <img src={ logo } height="80" alt="VIMC" />                
                <div className={ styles.siteTitle }>
                    <Link href="/">Contribution portal</Link>
                </div>
            </header>
            <article className={ styles.page }>
                <div className={ styles.pageTitle }>{ this.title() }</div>            
                <div className={ styles.pageContent }>{ this.renderPageContent() }</div>
            </article>
        </div>
    }
}

export interface PageProperties<T> {
    location: Location<T>;
}