import * as React from "react";
import { reduxForm, Field} from "redux-form";
import { connect } from "react-redux";
import { compose } from "recompose";
import { Dispatch } from "redux";


import { validations } from "../../../../shared/modules/reduxForm";
import {ReduxFormField} from "../../../../shared/components/ReduxForm/ReduxFormField";
import {ReduxFormValidationError} from "../../../../shared/components/ReduxForm/ReduxFormValidationError";
import {AdminAppState} from "../../../reducers/adminAppReducers";
import {usersActionCreators} from "../../../actions/usersActionCreators";

export interface CreateUserFormProps {
    handleSubmit: (F: Function) => any,
    submit: (values: CreateUserFormFields) => void,
    errorMessage?: string,
    dispatch: Dispatch<AdminAppState>,
    change: any
}

export interface CreateUserFormFields{
    name: string;
    email: string;
    username: string;
}

export class CreateUserFormComponent extends React.Component<CreateUserFormProps, undefined> {
    onNameChange(e: any) {
        const {value} = e.target;
        this.props.change('username', value);
    }

    render() {
        return (
            <div>
                <form className="form" onSubmit={this.props.handleSubmit(this.props.submit)}>
                    <div className="fields row">
                        <Field
                            name="name"
                            component={ReduxFormField}
                            type="text"
                            label="Full name"
                            validate={[validations.required]}
                            onChange={(e) => this.onNameChange(e)}
                        />
                    </div>
                    <div className="clearfix"></div>
                    <div className="fields row">
                        <Field
                            name="email"
                            component={ReduxFormField}
                            type="text"
                            label="Email address"
                            validate={[validations.required, validations.email]}
                        />
                    </div>
                    <div className="clearfix"></div>
                    <div className="fields row">
                        <Field
                            name="username"
                            component={ReduxFormField}
                            type="text"
                            label="Username"
                            validate={[validations.required, validations.username]}
                        />
                    </div>
                    <div className="clearfix"></div>
                    <div>
                        <ReduxFormValidationError message={ this.props.errorMessage } />
                    </div>
                    <div className="clearfix"></div>
                    <button type="submit">Save user</button>
                </form>
                <div className="clearfix"></div>
            </div>
        );
    }
}

function mapStateToProps(state: AdminAppState) {
    return {
        errorMessage: state.users.createUserError,
    }
}

function mapDispatchToProps(dispatch: Dispatch<any>): Partial<CreateUserFormProps> {
    return {
        submit : (values: CreateUserFormFields) => dispatch(usersActionCreators.createUser(
            values.name, values.email, values.username
        ))
    }
}

export const CreateUserForm = compose(
    reduxForm({ form: 'createUser'}),
    connect(mapStateToProps, mapDispatchToProps),
)(CreateUserFormComponent);
