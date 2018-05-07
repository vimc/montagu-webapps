import * as React from "react";

import {InputFieldProps} from "../../types";
import {ReduxFormValidationError} from "./ReduxFormValidationError";

export const ReduxFormField = (data: InputFieldProps) => {
    const { input, label, type, meta: { touched,  error } } = data;
    return <div>
        <input {...input} placeholder={label} type={type}/>
        <ReduxFormValidationError message={ touched && error ? label + error : null } />
    </div>;
}