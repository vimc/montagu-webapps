import * as React from "react";

import {InternalLink} from "../InternalLink";
import {BreadcrumbsBar} from "../Breadcrumbs/Breadcrumbs";

interface HeaderProps {
    siteTitle: string;
    logo?: any;
}

const PageHeaderNew: React.SFC<HeaderProps> = (props: HeaderProps) => {
    return <div>
        <header className="header">
            <InternalLink href="/">
                { props.logo ? <img src={props.logo} className="pl-md-1 logo" height="75" alt="VIMC"/> : null }
            </InternalLink>
            <div className="header__siteTitle">
                <InternalLink href="/">
                    {props.siteTitle}
                </InternalLink>
            </div>
        </header>
        <BreadcrumbsBar />
    </div>;
}

export {PageHeaderNew}