import * as React from "react";
import {Alert} from "reactstrap";
import {checkFileExtensionIsCSV} from "../../../../shared/validation/FileValidationHelpers";
import {ErrorInfo, Result} from "../../../../shared/models/Generated";
import {ConfigurationHash, ResumableFile} from "./ResumableTypes";
import {settings} from "../../../../shared/Settings";
import {ContribAppState} from "../../../reducers/contribAppReducers";
import {Dispatch} from "redux";
import {estimatesActionCreators} from "../../../actions/estimatesActionCreators";
import {connect} from "react-redux";
import {branch, compose} from "recompose";

const Resumable = require('resumablejs');

interface ResumableUploadState {
    file: ResumableFile,
    progress: number,
    isUploading: boolean,
    hasUploadSuccess: boolean,
    uploadErrors: ErrorInfo[]
}

interface ResumableUploadPublicProps {
    touchstoneId: string;
    scenarioId: string;
    groupId: string;
    setId: number
}

interface ResumableUploadProps extends ResumableUploadPublicProps {
    getUploadToken: (fileName: string) => void,
    populateEstimateSet: (token: string) => void,
    hasPopulateSuccess: boolean;
    populateErrors: ErrorInfo[]
    resetPopulateState: () => void;
    url: string;
    uploadToken: string;
}

export class ResumableUploadFormComponent extends React.Component<ResumableUploadProps, ResumableUploadState> {

    private resumable: any = null;
    private uploader: Element;

    constructor(props: ResumableUploadProps) {
        super(props);
        this.state = {
            progress: 0,
            file: null,
            isUploading: false,
            uploadErrors: [],
            hasUploadSuccess: false
        };

        this.onDismiss = this.onDismiss.bind(this);
    }

    componentDidMount = () => {

        const settings: ConfigurationHash = {
            target: this.props.url,
            testChunks: false,
            maxFiles: 1,
            withCredentials: true,
            setChunkTypeFromFile: true,
            generateUniqueIdentifier: () => this.props.uploadToken
        };

        this.resumable = new Resumable(settings);

        this.resumable.assignBrowse(this.uploader, false);

        this.resumable.on('fileAdded', (file: ResumableFile) => {

            this.props.resetPopulateState();

            this.setState({
                file: file,
                hasUploadSuccess: false,
                uploadErrors: []
            });

            this.props.getUploadToken(file.fileName)
        });

        this.resumable.on('fileSuccess', () => {

            this.setState({
                hasUploadSuccess: true,
                isUploading: false
            }, () => {
                this.props.populateEstimateSet(this.props.uploadToken);
            });
        });

        this.resumable.on('progress', () => {

            this.setState({
                isUploading: this.resumable.isUploading()
            });

            this.setState({
                progress: Math.round(this.resumable.progress() * 10) / 10 * 100
            });

        });

        this.resumable.on('fileError', (file: any, error: string) => {

            let uploadErrors: ErrorInfo[] = [];
            try {
                const result = JSON.parse(error) as Result;
                uploadErrors = result.errors
            }
            catch {
                uploadErrors.push({code: "error", message: "Error contacting server"})
            }
            this.setState({
                uploadErrors: uploadErrors,
                isUploading: false
            });
        });
    };

    removeFile = (event: any, file: any) => {

        event.preventDefault();

        this.setState({
            file: null,
            hasUploadSuccess: false,
            uploadErrors: []
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


    renderSelectedFile(): JSX.Element {
        const originFile = this.state.file;
        if (this.state.file) {
            const problems = checkFileExtensionIsCSV(originFile.fileName);
            return <span>
                File selected: {originFile.fileName}
                <Alert color="danger" isOpen={!problems.isValid} className="mt-3 pathProblems">
                    {problems.content}
                </Alert>
                 <a onClick={(event) => this.removeFile(event, originFile)} href="#" className={"btn btn-close"}>x</a>
            </span>;
        } else {
            return null;
        }
    }

    onDismiss() {
        this.setState({
            uploadErrors: [],
            hasUploadSuccess: false,
            progress: 0,
            file: null
        })
    }

    render() {

        return (
            <div>

                <div className="progress" style={{display: this.state.progress === 0 ? "none" : "block"}}>
                    <div className={`progress-bar ${this.state.uploadErrors.length > 0 ? "bg-danger" : "bg-success"}`}
                         style={{width: this.state.progress + '%'}}>&nbsp;</div>
                </div>
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
                <Alert color="danger" isOpen={this.state.uploadErrors.length > 0} toggle={this.onDismiss}>
                    {this.state.uploadErrors.length > 0 && this.state.uploadErrors[0].message}
                </Alert>
                <Alert color="danger" isOpen={this.state.uploadErrors.length > 0} toggle={this.props.resetPopulateState}>
                    {this.props.populateErrors.length > 0 && this.props.populateErrors[0].message}
                </Alert>
                <Alert color="success" isOpen={this.props.hasPopulateSuccess} toggle={this.props.resetPopulateState}>
                    Success! You have uploaded a new burden estimate set
                </Alert>
                <button disabled={this.state.isUploading || this.state.file == null || this.props.uploadToken == null}
                        className="submit start"
                        onClick={this.startUpload}>Upload
                </button>
                <button disabled={!this.state.isUploading} className="cancel"
                        onClick={this.cancelUpload}>Cancel
                </button>
            </div>
        );
    }
}

const mapStateToProps: (state: ContribAppState, props: ResumableUploadPublicProps) => Partial<ResumableUploadProps>
    = (state: ContribAppState, props: ResumableUploadPublicProps) => {
    return {
        ...props,
        url: `${settings.apiUrl()}/modelling-groups/${props.groupId}/responsibilities/${props.touchstoneId}/${props.scenarioId}/estimate-sets/${props.setId}/`,
        uploadToken: state.estimates.uploadToken,
        populateErrors: state.estimates.populateErrors,
        hasPopulateSuccess: state.estimates.hasPopulateSuccess
    }
};

const mapDispatchToProps:
    (dispatch: Dispatch<ContribAppState>, props: Partial<ResumableUploadProps>) => Partial<ResumableUploadProps>
    = (dispatch, props) => {
    return {
        ...props,
        getUploadToken: (fileName) => dispatch(estimatesActionCreators.getUploadToken(fileName)),
        populateEstimateSet: (token) => dispatch(estimatesActionCreators.populateEstimateSet(token)),
        resetPopulateState: () => dispatch(estimatesActionCreators.resetPopulateState())
    }
};

export const ResumableUploadForm =
    compose(
        connect(mapStateToProps, mapDispatchToProps)(ResumableUploadFormComponent)
    ) as any;