import * as React from "react";
import {Alert} from "reactstrap";
import {checkFileExtensionIsCSV} from "../../../../shared/validation/FileValidationHelpers";
import rs from "resumablejs"
import {ErrorInfo, Result} from "../../../../shared/models/Generated";

const Resumable = require('resumablejs');

interface ResumableUploadState {
    file: rs.ResumableFile,
    progress: number,
    isUploading: boolean,
    hasSuccess: boolean,
    errors: ErrorInfo[]
}

interface ResumableUploadProps {
    onSuccess: () => void; // TODO refresh latest estimate set
    url: string;
    bearerToken: string;
}

export class ReactResumableJs extends React.Component<ResumableUploadProps, ResumableUploadState> {

    componentDidMount = () => {

        // const headers = {
        //     Authorization: `Bearer ${this.props.bearerToken}`
        // };

        const settings: rs.ConfigurationHash = {
            target: this.props.url,
            testChunks: false,
            maxFiles: 1,
            withCredentials: true,
            setChunkTypeFromFile: true,
            generateUniqueIdentifier: () => new Date().toISOString()
        };

        this.resumable = new Resumable(settings);

        this.resumable.assignBrowse(this.uploader, false);

        this.resumable.on('fileAdded', (file: rs.ResumableFile) => {

            this.setState({
                file: file,
                hasSuccess: false,
                errors: []
            });
        });

        this.resumable.on('fileSuccess', () => {

            this.setState({
                hasSuccess: true,
                isUploading: false
            }, () => {
                this.props.onSuccess();
            });
        });

        this.resumable.on('progress', () => {

            this.setState({
                isUploading: this.resumable.isUploading()
            });

            let progress = this.resumable.progress();
            if (progress > 0.9) {
                progress = 1;
            }

            this.setState({
                progress: progress * 100
            });

        });

        this.resumable.on('fileError', (file: any, error: string) => {

            let errors = [];
            try {
                const result = JSON.parse(error) as Result;
                errors = result.errors
            }
            catch {
                errors.push({code: "error", message: "Error contacting server"})
            }
            this.setState({
                errors: errors,
                isUploading: false
            });
        });
    };

    removeFile = (event: any, file: any) => {

        event.preventDefault();

        this.setState({
            file: null,
            hasSuccess: false,
            errors: []
        });

        this.resumable.removeFile(file);
    };

    cancelUpload = () => {
        this.setState({
            isUploading: false
        });
        this.resumable.cancel();
    };

    startUpload = () => {
        this.setState({
            isUploading: true
        });
        this.resumable.upload();
    };

    private resumable: any = null;
    private uploader: Element;

    constructor(props: any) {
        super(props);
        this.state = {
            progress: 0,
            file: null,
            isUploading: false,
            errors: [],
            hasSuccess: false
        };

        this.onDismiss = this.onDismiss.bind(this);
    }

    renderSelectedFile(): JSX.Element {
        const originFile = this.state.file;
        if (this.state.file) {
            const problems = checkFileExtensionIsCSV(originFile.fileName);
            return <span>
                File selected: {originFile.fileName}
                <Alert color="danger" isOpen={!problems.isValid} className="mt-3 pathProblems">
                    {problems.content}
                </Alert>
                 <a onClick={(event) => this.removeFile(event, originFile)} href="#">[X]</a>
            </span>;
        } else {
            return null;
        }
    }

    onDismiss() {
        this.setState({
            errors: [],
            hasSuccess: false,
            progress: 0,
            file: null
        })
    }

    render() {

        return (
            <div>

                <div className="progress" style={{display: this.state.progress === 0 ? "none" : "block"}}>
                    <div className={`progress-bar ${this.state.errors.length > 0 ? "bg-danger" :"bg-success"}`}
                         style={{width: this.state.progress + '%'}}>&nbsp;</div>
                </div>
                <span>{this.state.isUploading ? "Uploading file" : this.state.progress == 1 ? "Validating estimates" : ""}</span>
                <div className="form-group">
                    <label className="customFileUpload">
                        <input
                            ref={node => this.uploader = node}
                            type="file"
                            className='btn'
                            name={'file-upload'}
                            accept={"csv"}
                        />
                        <div className="button mt-2 mb-2">
                            Choose file
                        </div>
                    </label>

                    <div className="mr-5">
                        {this.renderSelectedFile()}
                    </div>
                </div>
                <Alert color="danger" isOpen={this.state.errors.length > 0} toggle={this.onDismiss}>
                    {this.state.errors.length > 0 && this.state.errors[0].message}
                </Alert>
                <Alert color="success" isOpen={this.state.hasSuccess} toggle={this.onDismiss}>
                    Success! You have uploaded a new burden estimate set
                </Alert>
                <button disabled={this.state.isUploading || this.state.file == null} className="submit start"
                        onClick={this.startUpload}>Upload
                </button>
                <button disabled={!this.state.isUploading} className="cancel"
                        onClick={this.cancelUpload}>Cancel
                </button>
            </div>
        );
    }
}

