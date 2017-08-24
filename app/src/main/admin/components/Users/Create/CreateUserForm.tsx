import { FormConnector, ReformProps } from "alt-reform";
import { CreateUserFields, createUserFormStore, suggestUsername } from "./CreateUserFormStore";
import { ValidationError } from "../../../../shared/components/Login/ValidationError";
import * as React from "react";

const commonStyles = require("../../../../shared/styles/common.css");
const formStyles = require("../../../../shared/styles/forms.css");

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
        return <form className={commonStyles.gapAbove} onSubmit={this.props.submit}>
            <fieldset disabled={this.props.loading}>
                <div className={commonStyles.sectionTitle}>Add new user</div>
                <table className={formStyles.tableForm}>
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
                <div className={commonStyles.gapAbove}>
                    <ValidationError message={this.props.store.state.submitError}/>
                </div>
                <div className={commonStyles.gapAbove}>
                    <button type="submit">Save user</button>
                </div>
            </fieldset>
        </form>;
    }
}

export const CreateUserForm = FormConnector(createUserFormStore())(CreateUserFormComponent);