import * as React from "react";
import { reduxForm, Field} from "redux-form";
import { connect } from "react-redux";
import { compose } from "recompose";
import { Dispatch } from "redux";

import { validations } from "../../../../shared/modules/reduxForm";
import { authActionCreators } from "../../../../shared/actions/authActionCreators";
import {ReduxFormField} from "../../../../shared/components/ReduxForm/ReduxFormField";
import {ReduxFormValidationError} from "../../../../shared/components/ReduxForm/ReduxFormValidationError";
import {AdminAppState} from "../../../reducers/adminAppReducers";
import { InternalLink } from "../../../../shared/components/InternalLink";

export interface ResetPasswordFormProps {
    handleSubmit: (F: Function) => any;
    submit: (values: ResetPasswordFormFields) => void;
    errorMessage?: string;
    resetPasswordTokenExpired?: boolean;
}

export interface ResetPasswordFormFields{
    password: string;
}

const validationMin8 = validations.minLength(8);

export class ResetPasswordFormComponent extends React.Component<ResetPasswordFormProps, undefined> {
    render() {
        return (
            <div>
                <form className="form" onSubmit={this.props.handleSubmit(this.props.submit)}>
                    <div className="fields row">
                        <Field
                            name="password"
                            component={ReduxFormField}
                            type="password"
                            label="Password"
                            validate={[validations.required, validationMin8]}
                        />
                    </div>
                    <div className="clearfix"></div>
                    <div className="row">
                        <ReduxFormValidationError message={ this.props.errorMessage } />
                    </div>
                    <div className="clearfix"></div>
                    <button type="submit">Update</button>
                </form>
                <div className="clearfix"></div>
                {this.props.resetPasswordTokenExpired &&
                    <InternalLink href="/forgotten-password/">
                        <button>Request new reset password link</button>
                    </InternalLink>
                }
            </div>
        );
    }
}

function mapStateToProps(state: AdminAppState) {
    return {
        errorMessage: state.auth.resetPasswordError,
        resetPasswordTokenExpired: state.auth.resetPasswordTokenExpired
    }
}

function mapDispatchToProps(dispatch: Dispatch<any>): Partial<ResetPasswordFormProps> {
    return {
        submit : (values: ResetPasswordFormFields) => dispatch(authActionCreators.resetPassword(values.password))
    }
}

export const ResetPasswordForm = compose(
    reduxForm({ form: 'resetPassword'}),
    connect(mapStateToProps, mapDispatchToProps),
)(ResetPasswordFormComponent);
