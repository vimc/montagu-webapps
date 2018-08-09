import * as React from "react";
import {ErrorInfo} from "../../models/Generated";

export interface FormValidationErrorProps {
    errors: ErrorInfo[];
}

export const FormValidationErrors: React.SFC<FormValidationErrorProps> = (props: FormValidationErrorProps) => {
    if (props.errors.length > 0) {
        const messages = props.errors.map(e => e.message).join(", ");
        return <div className="error">{messages}</div>;
    } else {
        return null;
    }
};
