import * as React from "react";
import { ReformProps } from "alt-reform";
import { ValidationError } from "./ValidationError";

const formStyles = require("../../styles/forms.css");

export class PasswordResetFormComponent extends React.Component<ReformProps, undefined> {

    render() {
        const buttonStyle = {
            width: 140
        };
        const disabled = this.props.loading;
        return <form className={ formStyles.form } onSubmit={ this.props.submit }>
            <div className={ formStyles.fields }>
                <input name="email" type="email" placeholder="Email address"
                       disabled={ disabled }
                       { ...this.props.fields.email } />
                <ValidationError message={ this.props.errors.email } />
                <ValidationError message={ this.props.store.state.submitError } />
            </div>
            <button type="submit"
                    style={ buttonStyle }
                    disabled={ disabled }>Log in ➡
            </button>
        </form>;
    }
}