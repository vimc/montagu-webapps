import * as React from "react";
import {Alert} from "./Alert";
import fetcher from "../sources/Fetcher";
import {ErrorInfo, Result} from "../models/Generated";
import {apiResponse} from "../sources/Source";

export interface FormState {
    disabled: boolean;
    errors: ErrorInfo[];
    hasSuccess: boolean;
    validated: boolean;
}

interface FormProps {
    url: string;
    successCallback: (result: Result) => any;
    successMessage: string;
    submitText: string;
    data: any;
}

export class Form extends React.Component<FormProps, FormState> {

    constructor(props: FormProps) {

        super(props);

        this.state = {
            validated: false,
            disabled: false,
            errors: [],
            hasSuccess: false
        }
    }

    submitForm(form: HTMLFormElement) {

        const self = this;

        const data = this.props.data ? JSON.stringify(this.props.data) : new FormData(form);

        return fetcher.fetcher.fetch(this.props.url, {
            method: "POST",
            body: data
        }).then((response: Response) => {
            return apiResponse(response)
                .then((result: Result) => {
                        self.resultCallback(result)
                    }
                );
        });
    }

    resultCallback(result: Result) {
        const success = result.status == "success";
        this.setState({
            hasSuccess: success,
            errors: result.errors,
            disabled: false,
            validated: false
        });

        if (success) {
            this.props.successCallback(result);
        }
    }

    onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const form = e.target as HTMLFormElement;

        this.setState({
            validated: true,
            errors: [],
            hasSuccess: false
        });

        if (form.checkValidity() === true) {

            this.setState({
                disabled: true
            });

            this.submitForm(form)
        }
    }

    render() {

        const hasError = this.state.errors.length > 0;
        const alertMessage = hasError ? this.state.errors[0].message : this.props.successMessage;

        return <div>
            <form encType="multipart/form-data" className={this.state.validated ? "was-validated" : ""}
                  onSubmit={this.onSubmit.bind(this)}
                  noValidate>
                {this.props.children}
                <Alert cssClass="mt-4" hasSuccess={this.state.hasSuccess} hasError={hasError} message={alertMessage}/>
                <button type="submit" className="mt-2"
                        disabled={this.state.disabled}>{this.props.submitText}
                </button>
            </form>
        </div>;
    }
}