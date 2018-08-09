import * as React from "react";

import * as loaderAnimation from "../resources/link-loader.gif";
import {OneTimeLinkContext, OneTimeLinkProps} from "./OneTimeLinkContext";
import {DownloadIcon} from "./DownloadIcon";

export class FileDownloadLinkInner extends React.Component<OneTimeLinkProps, undefined> {

    render() {
        return <FileDownloadInner {...this.props}>
            {
                this.props.children
            }
            <span className="download-icon">
                    <DownloadIcon fillColor={"#007bff"}/>
                </span>
        </FileDownloadInner>
    }

}

export class FileDownloadButtonInner extends React.Component<OneTimeLinkProps, undefined> {

    render() {
        return <FileDownloadInner
            className={"button" + (this.props.className ? ` ${this.props.className}` : "")}
            href={this.props.href}
            enabled={this.props.enabled}
            refreshToken={this.props.refreshToken}>
            {this.props.children}
            <span className="download-icon">
                <DownloadIcon fillColor={"#ffffff"}/>
            </span>
        </FileDownloadInner>
    }

}

export class FileDownloadInner extends React.Component<OneTimeLinkProps, undefined> {
    constructor(props: OneTimeLinkProps) {
        super(props);
        this.refreshToken = this.refreshToken.bind(this);
    }

    refreshToken(e: React.MouseEvent<HTMLAnchorElement>) {
        this.props.refreshToken();
    }

    render() {
        const {href, enabled} = this.props;
        let className: string;
        let loader: JSX.Element = null;

        if (href != null) {
            className = this.props.className;
        } else {
            className = this.props.className + ' disabled';
            if (enabled) {
                loader = <img src={loaderAnimation}/>;
            }
        }

        return <a href={href}
                  onClick={this.refreshToken}
                  className={className}
                  target="_blank"
                  download="" // Filename is provided by server
        >
            {this.props.children}
            {loader}
        </a>
    }
}

export const FileDownloadButton = OneTimeLinkContext(FileDownloadButtonInner);
export const FileDownloadLink = OneTimeLinkContext(FileDownloadLinkInner);
