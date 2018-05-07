import * as React from "react";
import { reduxForm, Field} from "redux-form";
import { connect } from "react-redux";
import { compose } from "recompose";
import { Dispatch } from "redux";

import { validations } from "../../modules/reduxForm";
import { authActionCreators } from "../../actions/authActionCreators";
import {ReduxFormField} from "../ReduxForm/ReduxFormField";

export interface ForgotPasswordFormProps {
    handleSubmit: (F: Function) => any;
    submit: (values: ForgotPasswordFormFields) => void;
}

export interface ForgotPasswordFormFields{
    email: string;
}

export class ForgottenPasswordFormComponent extends React.Component<ForgotPasswordFormProps, undefined> {
    render() {
        return (
            <div>
                <form className="form" onSubmit={this.props.handleSubmit(this.props.submit)}>
                    <div className="fields">
                        <Field
                            name="email"
                            component={ReduxFormField}
                            type="text"
                            label="Email address"
                            validate={[validations.required, validations.email]}
                        />
                    </div>
                    <button
                        type="submit"
                    >
                        Send password reset email
                    </button>
                </form>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch: Dispatch<any>): Partial<ForgotPasswordFormProps> {
    return {
        submit : (values: ForgotPasswordFormFields) => dispatch(authActionCreators.forgotPassword(values.email))
    }
}

export const ForgottenPasswordForm = compose(
    reduxForm({ form: 'forgotPassword'}),
    connect(state => state, mapDispatchToProps),
)(ForgottenPasswordFormComponent);
