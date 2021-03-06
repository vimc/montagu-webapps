import * as React from "react";

import { InternalLink } from "../InternalLink";
import {BreadcrumbsBar} from "../Breadcrumbs/Breadcrumbs";
import { LoggedInUserBox } from "../Login/LoggedInUserBox";
import * as logo from "./logo.png"

interface HeaderProps {
    siteTitle: string;
    logo?: any;
}

const defaultProps: Partial<HeaderProps> = {
    logo
};

const PageHeader: React.FunctionComponent<HeaderProps> = (props: HeaderProps) => {
    return <div>
        <header className="header">
            <a href="/">
                <img src={props.logo} className="pl-md-1 logo" height="75" alt="VIMC"/>
            </a>
            <div className="header__siteTitle">
                <InternalLink href="/">
                    {props.siteTitle}
                </InternalLink>
            </div>
            <LoggedInUserBox />
        </header>
        <BreadcrumbsBar />
    </div>;
};

PageHeader.defaultProps = defaultProps;

export {PageHeader}