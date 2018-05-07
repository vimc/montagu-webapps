import * as React from "react";
import { reduxForm, Field} from "redux-form";
import { connect } from "react-redux";
import { compose } from "recompose";
import { Dispatch } from "redux";

// import { ValidationError } from "../../../../shared/components/ValidationError";
import { validations } from "../../../../shared/modules/reduxForm";
// import { authActionCreators } from "../../actions/authActionCreators";
import {InputFieldProps} from "../../../../shared/types";

export interface ResetPasswordFormProps {
    handleSubmit: (F: Function) => any;
    submit: (values: ResetPasswordFormFields) => void;
}

export interface ResetPasswordFormFields{
    email: string;
}

export class ForgottenPasswordFormComponent extends React.Component<ForgotPasswordFormProps, undefined> {
    renderField(data: InputFieldProps)
    {
        const { input, label, type, meta: { touched,  error } } = data;
        return <div>
            <input {...input} placeholder={label} type={type}/>
    <ValidationError message={ touched && error ? label + error : null } />
    </div>;
    }

    render() {
        return (
            <div>
                <form className="form" onSubmit={this.props.handleSubmit(this.props.submit)}>
        <div className="fields">
        <Field
            name="email"
        component={this.renderField}
        type="text"
        label="Email address"
        validate={[validations.required, validations.email]}
        />
        </div>
        <button
        type="submit"
            >
            Log in
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



/*
import AltReform, { FormConnector, Reform } from "alt-reform";
import { alt } from "../../../../shared/alt";
import FormActions from "../../../../shared/FormActions";
import * as Validation from "../../../../shared/validation/Validation";
import {
    makeNotification, notificationActions,
    NotificationException
} from "../../../../shared/actions/NotificationActions";
import { FormErrors, justState } from "../../../../shared/FormHelpers";
import fetcher from "../../../../shared/sources/Fetcher";
import { AccountStoreInterface } from "../../../stores/AccountStore";
import { ErrorInfo, Result } from "../../../../shared/models/Generated";
import { accountActions } from "../../../actions/AccountActions";
import {settings} from "../../../../shared/Settings";

export interface ResetPasswordFields {
    password: string;
}

export function resetPasswordForm(accountStore: AccountStoreInterface, name?: string): Reform<ResetPasswordFields> {
    const qualifiedName = "ResetPassword_" + (name || "main");
    const { submitFailed } = FormActions(qualifiedName);

    const handleError = (error: ErrorInfo) => {
        if (error.code == "invalid-token-used") {
            accountActions.passwordResetTokenExpired();
            alt.dispatch(submitFailed("This password reset link has expired. Please request a new one."));
        }
        else {
            alt.dispatch(submitFailed(error.message));
        }
    };

    return AltReform(qualifiedName, alt, {
        fields: {
            password: Validation.multi("Password", [Validation.required, (name: string) => Validation.minLength(name, 8)]),
            errors: () => {
            },
        },
        onSubmit: (state: ResetPasswordFields & FormErrors) =>
            fetcher.fetcher.fetch(`/onetime_link/${(accountStore.getState().passwordResetToken)}/`, {
            method: "post",
            body: JSON.stringify(justState(state))
        }),
        onSubmitSuccess: (response: Response) => {
            response.json()
                .then((response: any) => {
                    const apiResponse = <Result>response;
                    if (apiResponse.status === "success") {
                        notificationActions.notify(makeNotification("Your password has been set. You are now being redirected to the Montagu homepage...", "info"))
                        setTimeout(() => window.location.replace(settings.montaguUrl()), 3000);
                    } else if (apiResponse.status === "failure") {
                        handleError(apiResponse.errors[0])
                    } else {
                        alt.dispatch(submitFailed("The server response was not correctly formatted: "
                            + response.toString()));
                    }
                })
                .catch(() => {
                    alt.dispatch(submitFailed("An error occurred setting the password"));
                })
        },
        onSubmitFail: (response: any) => {
            response = typeof response == "string" ? response : "An error occurred setting the password";
            alt.dispatch(submitFailed(response));
        }
    });
}
*/