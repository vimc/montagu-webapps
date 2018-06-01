import * as React from "react";
import {change, Field, reduxForm} from "redux-form";
import {connect} from "react-redux";
import {compose} from "recompose";
import {Dispatch} from "redux";
import {validations} from "../../../../shared/modules/reduxForm";
import {ReduxFormField} from "../../../../shared/components/ReduxForm/ReduxFormField";
import {
    ReduxFormValidationErrors
} from "../../../../shared/components/ReduxForm/ReduxFormValidationError";
import {AdminAppState} from "../../../reducers/adminAppReducers";
import {usersActionCreators} from "../../../actions/usersActionCreators";
import {FormEvent} from "react";
import {ErrorInfo} from "../../../../shared/models/Generated";

export interface CreateUserFormProps {
    // https://redux-form.com/7.3.0/docs/api/props.md/#-code-handlesubmit-eventorsubmit-function-code-
    // this function is added by redux form. it takes a function with the form values as arguments and
    // returns a function that can be used as an 'onSubmit' handler
    handleSubmit: (submitFunction: (values: CreateUserFormFields) => void)
        => (event: FormEvent<HTMLFormElement>) => void,
    submit: (values: CreateUserFormFields) => void,
    errors: ErrorInfo[],
    changeFieldValue: (field: string, value: string) => void
}

export interface CreateUserFormFields {
    name: string;
    email: string;
    username: string;
}

function processName(name: string) {
    return name.toLowerCase().replace(/[^a-z]/gi, "");
}

export function suggestUsername(name: string): string {
    const names = name.split(" ");
    let username = processName(names[0]);
    if (names.length > 1) {
        username += ("." + processName(names[names.length - 1]));
    }
    return username;
}

export class CreateUserFormComponent extends React.Component<CreateUserFormProps, undefined> {
    onNameChange(e: any) {
        const {value} = e.target;
        this.props.changeFieldValue('username', suggestUsername(value));
    }

    render() {
        return <form className="form" onSubmit={this.props.handleSubmit(this.props.submit)}>
            <table className="tableForm specialColumn">
                <tbody>
                <tr>
                    <td>Full name</td>
                    <td>
                        <Field
                            name="name"
                            label={"Full name"}
                            component={ReduxFormField}
                            type="text"
                            validate={[validations.required]}
                            onChange={(e) => this.onNameChange(e)}
                        />
                    </td>
                </tr>
                <tr>
                    <td>Email</td>
                    <td>
                        <Field
                            name="email"
                            label={"Email address"}
                            component={ReduxFormField}
                            type="text"
                            validate={[validations.required, validations.email]}
                        />
                    </td>
                </tr>
                <tr>
                    <td>Username</td>
                    <td>
                        <Field
                            label={"Username"}
                            name="username"
                            component={ReduxFormField}
                            type="text"
                            validate={[validations.required, validations.username]}
                        />
                    </td>
                </tr>
                </tbody>
            </table>

            <ReduxFormValidationErrors errors={this.props.errors}/>
            <button type="submit">Save user</button>
        </form>
    }
}


function mapStateToProps(state: AdminAppState): Partial<CreateUserFormProps> {
    return {
        errors: state.users.createUserErrors,
    }
}

export function mapDispatchToProps(dispatch: Dispatch<any>): Partial<CreateUserFormProps> {
    return {
        submit: (values: CreateUserFormFields) => dispatch(usersActionCreators.createUser(
            values.name, values.email, values.username
        )),
        changeFieldValue: (field: string, value: string) => {
            dispatch(change('createUser', field, value))
        }
    }
}

export const CreateUserForm = compose(
    reduxForm({form: 'createUser'}),
    connect(mapStateToProps, mapDispatchToProps),
)(CreateUserFormComponent);
