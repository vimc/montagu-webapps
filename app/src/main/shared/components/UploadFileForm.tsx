import * as React from "react";

import {settings} from "../Settings";
import {helpers} from "../Helpers";
import {ErrorInfo, Result} from "../models/Generated";
import {Alert} from "reactstrap";

import {CustomValidationResult} from "../validation/FileValidationHelpers";
import {OneTimeLinkContext, OneTimeLinkProps} from "./OneTimeLinkContext";

export interface UploadFileProps {
    href: string;
    enableSubmit: boolean;
    successMessage: string;
    validatePath?: (path: string) => CustomValidationResult;
}

export interface UploadFileState {
    fileSelected: boolean;
    fileName: string;
    hasSuccess: boolean;
    serverErrors: ErrorInfo[];
}

export class UploadFileForm extends React.Component<UploadFileProps, UploadFileState> {
    constructor() {
        super();

        const result = helpers.ingestQueryStringAndReturnResult();
        this.state = {
            fileSelected: false,
            fileName: "",
            hasSuccess: result != null && (result as Result).status == "success",
            serverErrors: result ? result.errors : []
        };
    }

    handleChange(e: React.MouseEvent<HTMLInputElement>) {
        const filePath = (e.target as HTMLInputElement).value.replace("C:\\fakepath\\", "");
        this.setState({
            hasSuccess: false,
            serverErrors: [],
            fileSelected: true,
            fileName: filePath
        });
    }

    validatePath(): CustomValidationResult {
        if (this.props.validatePath) {
            return this.props.validatePath(this.state.fileName);
        }
        return {isValid: true, content: null};
    }

    render() {
        const enableSubmit = this.props.enableSubmit
            && this.props.href != null
            && this.state.fileSelected
            && this.validatePath().isValid;

        const hasError = this.state.serverErrors.length > 0;

        return <OneTimeUploadFileForm href={this.props.href} enabled={enableSubmit}>
            <div className="form-group">
                <label className="customFileUpload">
                    <input name="file" type="file" onChange={this.handleChange.bind(this)}/>
                    <div className="button mt-2 mb-2">
                        Choose file
                    </div>
                </label>

                <div className="mr-5">
                    {this.renderSelectedFile()}
                </div>
            </div>
            <Alert color="danger" isOpen={hasError}>
                {this.state.serverErrors[0] && this.state.serverErrors[0].message}
            </Alert>
            <Alert color="success" isOpen={this.state.hasSuccess}>
                {this.props.successMessage}
            </Alert>
        </OneTimeUploadFileForm>;
    }

    renderSelectedFile(): JSX.Element {
        if (this.state.fileSelected) {
            const problems = this.validatePath();
            return <span>
                File selected: {this.state.fileName}
                <Alert color="danger" isOpen={!problems.isValid} className="mt-3 pathProblems">
                    {problems.content}
                </Alert>
            </span>;
        } else {
            return null;
        }
    }
}

export class OneTimeUploadFileFormInner extends React.Component<OneTimeLinkProps, undefined> {
    render(): JSX.Element {
        return <form action={this.props.href} className="form"
                     method="POST" encType="multipart/form-data">
            {this.props.children}

            <button type="submit"
                    className={this.props.enabled ? "" : "disabled"}
                    disabled={!this.props.enabled}
                    onClick={this.props.refreshToken}>
                Upload
            </button>
        </form>
    }
}

export const OneTimeUploadFileForm = OneTimeLinkContext(OneTimeUploadFileFormInner);

