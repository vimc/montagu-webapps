import * as React from 'react';
import { RemoteContent } from '../../stores/RemoteContent';

const spinner = require("./spinner.gif");

export abstract class RemoteContentComponent<TProps extends RemoteContent> extends React.Component<TProps, undefined> {
    abstract renderContent(content: TProps): JSX.Element;

    render() {
        if (this.props.errorMessage) {
            return <div>{ this.props.errorMessage }</div>
        } else if (this.props.ready) {
            return this.renderContent(this.props);
        } else {
            return <img src={ spinner } />
        }
    }
}