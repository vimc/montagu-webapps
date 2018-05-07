import * as React from "react";
import { reduxForm, Field } from "redux-form";
import { connect } from "react-redux";
import { compose } from "recompose";
import { Dispatch } from "redux";

import { InternalLink } from "../InternalLink";
import { validations } from "../../modules/reduxForm";
import { authActionCreators } from "../../actions/authActionCreators";
import { GlobalState } from "../../reducers/GlobalState";
import {ReduxFormField} from "../ReduxForm/ReduxFormField";
import {ReduxFormValidationError} from "../ReduxForm/ReduxFormValidationError";

export interface LoginFormProps {
    handleSubmit: (F: Function) => any;
    errorMessage?: string;
    submit: (values: LoginFormFields) => void;
}

export interface LoginFormFields{
    email: string;
    password: string;
}

export class LoginFormComponent extends React.Component<LoginFormProps, undefined> {
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
                        <Field
                            name="password"
                            component={ReduxFormField}
                            type="password"
                            label="Password"
                            validate={[validations.required]}
                        />
                        <ReduxFormValidationError message={ this.props.errorMessage } />
                    </div>
                    <button
                        type="submit"
                    >
                        Log in
                    </button>
                </form>
                <div style={{"clear": "both"}}>
                    Forgotten your password?&nbsp;
                    <InternalLink href={"/forgotten-password/"}>
                        Click here
                    </InternalLink>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state: GlobalState): Partial<LoginFormProps> {
    return { errorMessage: state.auth.errorMessage };
}

function mapDispatchToProps(dispatch: Dispatch<any>): Partial<LoginFormProps> {
    return {
        submit : (values: LoginFormFields) => dispatch(authActionCreators.logIn(values.email, values.password))
    }
}

const enhance = compose(
    reduxForm({ form: 'login'}),
    connect(mapStateToProps, mapDispatchToProps),
);

export const LoginForm = enhance(LoginFormComponent);
