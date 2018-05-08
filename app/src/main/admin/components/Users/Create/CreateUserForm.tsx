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
    handleSubmit: (F: Function) => any;
    submit: (values: CreateUserFormFields) => void;
    errorMessage?: string;
}

export interface CreateUserFormFields{
    name: string;
    email: string;
    username: string;
}

export class CreateUserFormComponent extends React.Component<CreateUserFormProps, undefined> {
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


/*

export class CreateUserFormComponent extends React.Component<ReformProps, undefined> {
    constructor() {
        super();
        this.changeName = this.changeName.bind(this);
    }

    changeName(e: React.ChangeEvent<HTMLInputElement>) {
        this.props.fields.name.onChange(e);
        this.props.change({
            username: suggestUsername(e.target.value)
        });
    }

    render() {
        const fields = this.props.fields as CreateUserFields;
        return <form className="gapAbove" onSubmit={this.props.submit}>
            <fieldset disabled={this.props.loading}>
                <div className="sectionTitle">Add new user</div>
                <table className="tableForm specialColumn">
                    <tbody>
                    <tr>
                        <td>Full name</td>
                        <td><input name="name" {...fields.name} onChange={this.changeName} /></td>
                        <td><ValidationError message={this.props.errors.name}/></td>
                    </tr>
                    <tr>
                        <td>Email address</td>
                        <td><input name="email" type="email" {...fields.email} /></td>
                        <td><ValidationError message={this.props.errors.email}/></td>
                    </tr>
                    <tr>
                        <td>Username</td>
                        <td><input name="username" {...fields.username} /></td>
                        <td><ValidationError message={this.props.errors.username}/></td>
                    </tr>
                    </tbody>
                </table>
                <div className="gapAbove">
                    <ValidationError message={this.props.store.state.submitError}/>
                </div>
                <div className="gapAbove">
                    <button type="submit">Save user</button>
                </div>
            </fieldset>
        </form>;
    }
}

export const CreateUserForm = FormConnector(createUserFormStore())(CreateUserFormComponent);

*/