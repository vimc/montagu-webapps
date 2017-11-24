import * as React from "react";
import fetcher from "../sources/Fetcher";

const formStyles = require("../styles/forms.css");
const commonStyles = require("../styles/common.css");
const buttonStyles = require("../styles/buttons.css");

export interface UploadState {
    fileSelected: boolean;
    fileName: string;
}

export interface UploadProps {
    canUpload: boolean;
    fieldNames: string[];
    token: string;
    uploadText: string;
    disabledText: string;
}

export class UploadForm extends React.Component<UploadProps, UploadState> {

    constructor() {
        super();
        this.state = {
            fileSelected: false,
            fileName: ""
        };
    }

    handleChange(e: any) {
        this.setState({
            fileSelected: true,
            fileName: e.target.value.replace("C:\\fakepath\\", "")
        });
    }

    renderFields() {
        return this.props.fieldNames.map(item =>
            <div className="form-group"><input type="text" name={item} placeholder={item}/></div>
        )
    }

    render() {
        const url = fetcher.fetcher.buildOneTimeLink(this.props.token);
        const enabled = this.props.token != null;

        return <form className={formStyles.form} action={url}
                     method="POST" encType="multipart/form-data">
            <div className="form-group">
                <label className={formStyles.customFileUpload}>
                    <input name="file" type="file" onChange={this.handleChange.bind(this)}
                           disabled={!this.props.canUpload}/>
                    <div className={`${buttonStyles.button} ${commonStyles.mt5} ${commonStyles.mb5}
                        ${!this.props.canUpload ? buttonStyles.disabled : ""}`}>
                        {this.props.canUpload ? this.props.uploadText: this.props.disabledText}
                    </div>
                    <div
                        className={`${commonStyles.mr10}`}>{this.state.fileSelected ? "File selected: " + this.state.fileName : ""}</div>
                </label>
            </div>
            {this.renderFields()}
            <button type="submit"
                    style={{display: this.props.canUpload ? "block" : "none"}}
                    disabled={!this.props.canUpload || !this.state.fileSelected || !enabled}>Upload
            </button>
        </form>
    }
}