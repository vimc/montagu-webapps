import * as React from "react";

export interface ReduxFormValidationErrorProps {
    message: string;
}

export const ReduxFormValidationError: React.SFC<ReduxFormValidationErrorProps> = (props: ReduxFormValidationErrorProps) => {
    if (typeof props.message === "string") {
        return <span className="error">{ props.message }</span>;
    } else {
        return null;
    }
}
