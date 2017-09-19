import * as React from "react";
import { Link } from "simple-react-router";
import { appSettings } from "../Settings";

export class ButtonLink extends Link {
    constructor(props: any) {
        super(props);
        this.onClick = this.onClick.bind(this);
    }

    isAbsoluteURL(url: string) {
        const pat = /^https?:\/\//i;
        return pat.test(url);
    }

    onClick(event: any) {
        let href = (this.refs.link as HTMLButtonElement).getAttribute("href");
        if (!this.isAbsoluteURL(href)) {
            href = location.origin + appSettings.publicPath + href;
        }

        if (this.props.onClick) {
            this.props.onClick(event)
        }

        if (event.isDefaultPrevented() || event.isPropagationStopped()) return;

        if (!this.props.externalLink && !event.ctrlKey && !event.metaKey && !event.shiftKey && href.startsWith(location.origin)) {
            event.preventDefault();
            this.context.redirectTo(href, !!this.props.replace)
        }
    };

    render() {
        const props = Object.assign({}, this.props);
        delete props.externalLink;
        props.href = props.href || '';
        props.onClick = this.onClick;

        return <button ref="link" {...props}>{props.children}</button>;
    }
}