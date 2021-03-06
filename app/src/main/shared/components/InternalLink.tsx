import * as React from "react";
import {Link} from 'react-router-dom';
import {Router} from 'react-router';
import {object} from "prop-types";

interface InternalLinkProps {
    href: string;
    onClick?: React.EventHandler<React.MouseEvent<HTMLAnchorElement>>;
    children: JSX.Element | string;
    className?: string;
}

interface InternalLinkContext {
    router: Router;
}

// this component is just a wrapper on top of original link for react router
const InternalLink: React.FunctionComponent<InternalLinkProps> = (props: InternalLinkProps, context: InternalLinkContext) => {
    // This condition here is used to ease burden of components unit testing, making it unnecessary to mock router context
    if (context.router) {
        return <Link to={props.href} className={props.className} onClick={props.onClick}>{props.children}</Link>
    } else {
        return <a href={props.href} className={props.className} onClick={props.onClick}>{props.children}</a>
    }
};

export {InternalLink};

InternalLink.contextTypes = {
    router: object
};