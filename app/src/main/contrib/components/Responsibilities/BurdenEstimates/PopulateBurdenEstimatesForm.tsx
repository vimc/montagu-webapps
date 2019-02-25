import * as React from "react";
import {Alert} from "reactstrap";
import {checkFileExtensionIsCSV, CustomValidationResult} from "../../../../shared/validation/FileValidationHelpers";
import {ErrorInfo, Result} from "../../../../shared/models/Generated";
import {ConfigurationHash, ResumableFile} from "./ResumableTypes";
import {settings} from "../../../../shared/Settings";
import {ContribAppState} from "../../../reducers/contribAppReducers";
import {Dispatch} from "redux";
import {estimatesActionCreators} from "../../../actions/estimatesActionCreators";
import {connect} from "react-redux";
import {branch, compose, renderComponent} from "recompose";
import {LoadingElement} from "../../../../shared/partials/LoadingElement/LoadingElement";

const Resumable = require('resumablejs');

interface PopulateEstimatesState {
    file: ResumableFile,
    progress: number,
    isUploading: boolean,
    hasUploadSuccess: boolean,
    uploadErrors: ErrorInfo[],
    validationResult: CustomValidationResult
}

interface PopulateEstimatesPublicProps {
    touchstoneId: string;
    scenarioId: string;
    groupId: string;
    setId: number
}

interface PopulateEstimatesProps extends PopulateEstimatesPublicProps {
    getUploadToken: (fileName: string) => void,
    populateEstimateSet: (token: string) => void,
    hasPopulateSuccess: boolean;
    populateErrors: ErrorInfo[]
    resetPopulateState: () => void;
    url: string;
    uploadToken: string;
    populatingInProgress: boolean;
}

export class PopulateEstimatesFormComponent extends React.Component<PopulateEstimatesProps, PopulateEstimatesState> {

    private resumable: any = null;
    private uploader: Element;

    constructor(props: PopulateEstimatesProps) {
        super(props);
        this.state = {
            progress: 0,
            file: null,
            isUploading: false,
            uploadErrors: [],
            hasUploadSuccess: false,
            validationResult: null
        };

        this.onDismiss = this.onDismiss.bind(this);
    }

    componentDidMount = () => {

        const settings: ConfigurationHash = {
            target: (params) => `${this.props.url}?${params.join("&")}`,
            testChunks: false,
            maxFiles: 1,
            minFileSizeErrorCallback: () => {
                this.props.resetPopulateState();
                this.setState({
                    file: null,
                    uploadErrors: [{
                        code: "e",
                        message: "This file is empty."
                    }]
                })
            },
            withCredentials: true,
            setChunkTypeFromFile: true,
            totalSizeParameterName: "totalSize",
            fileNameParameterName: "fileName",
            totalChunksParameterName: "totalChunks",
            chunkNumberParameterName: "chunkNumber",
            chunkSizeParameterName: "chunkSize"
        };

        this.resumable = new Resumable(settings);
        this.resumable.assignBrowse(this.uploader, false);

        this.resumable.on('fileAdded', (file: ResumableFile) => {

            this.props.resetPopulateState();
            const validationResult = checkFileExtensionIsCSV(file.fileName);

            this.setState({
                validationResult: validationResult,
                file: file,
                hasUploadSuccess: false,
                uploadErrors: [],
                progress: 0
            });

            this.props.getUploadToken(file.fileName)
        });

        this.resumable.on('fileSuccess', () => {

            this.setState({
                hasUploadSuccess: true,
                isUploading: false,
                progress: 0
            }, () => {
                this.props.populateEstimateSet(this.props.uploadToken);
            });
        });

        this.resumable.on('progress', () => {

            this.setState({
                isUploading: this.resumable.isUploading(),
                progress: Math.round(this.resumable.progress() * 10) / 10 * 100
            });
        });

        this.resumable.on('fileError', (file: ResumableFile, error: string) => {

            let uploadErrors: ErrorInfo[] = [];
            try {
                const result = JSON.parse(error) as Result;
                uploadErrors = result.errors
            } catch {
                uploadErrors.push({code: "error", message: "Error contacting server"})
            }
            this.setState({
                uploadErrors: uploadErrors,
                isUploading: false,
                progress: 0
            });
        });
    };

    removeFile = (event: any, file: ResumableFile) => {

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
            isUploading: false,
            file: null
        });
        this.resumable.cancel();
    };

    startUpload = () => {
        this.props.resetPopulateState();
        this.setState({
            isUploading: true
        });
        if (this.resumable.files[0].isComplete()) {
            this.resumable.files[0].retry()
        } else {
            this.resumable.upload();
        }

    };

    renderSelectedFile(): JSX.Element {
        const originFile = this.state.file;
        if (this.state.file) {
            return <span>
                File selected: {originFile.fileName}
                <a onClick={(event) => this.removeFile(event, originFile)} href="#"
                   className={"text-danger px-3 font-weight-bold"}>x</a>
                                <Alert color="danger" isOpen={!this.state.validationResult.isValid}
                                       className="mt-3 pathProblems">
                    {this.state.validationResult.content}
                </Alert>
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
                <Alert color="danger" isOpen={this.props.populateErrors.length > 0}
                       toggle={this.props.resetPopulateState}>
                    {this.props.populateErrors.length > 0 && this.props.populateErrors[0].message}
                </Alert>
                <Alert color="success" isOpen={this.props.hasPopulateSuccess} toggle={this.props.resetPopulateState}>
                    Success! You have uploaded a new burden estimate set
                </Alert>
                <button disabled={this.state.isUploading || this.state.file == null || this.props.url == null
                || !this.state.validationResult.isValid}
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

const mapStateToProps: (state: ContribAppState, props: PopulateEstimatesPublicProps) => Partial<PopulateEstimatesProps>
    = (state: ContribAppState, props: PopulateEstimatesPublicProps) => {
    return {
        ...props,
        url: state.estimates.uploadToken == null ? null :
            `${settings.apiUrl()}/modelling-groups/${props.groupId}/responsibilities/${props.touchstoneId}/${props.scenarioId}/estimate-sets/${props.setId}/actions/upload/${state.estimates.uploadToken}/`,
        uploadToken: state.estimates.uploadToken,
        populateErrors: state.estimates.populateErrors,
        hasPopulateSuccess: state.estimates.hasPopulateSuccess,
        populatingInProgress: state.estimates.populatingInProgress
    }
};

const mapDispatchToProps:
    (dispatch: Dispatch<ContribAppState>, props: Partial<PopulateEstimatesProps>) => Partial<PopulateEstimatesProps>
    = (dispatch, props) => {
    return {
        ...props,
        getUploadToken: () => dispatch(estimatesActionCreators.getUploadToken()),
        populateEstimateSet: (token) => dispatch(estimatesActionCreators.populateEstimateSet(token)),
        resetPopulateState: () => dispatch(estimatesActionCreators.resetPopulateState())
    }
};

export const PopulateEstimatesForm =
    compose<PopulateEstimatesProps, PopulateEstimatesPublicProps>(
        connect(mapStateToProps, mapDispatchToProps),
        branch((props: PopulateEstimatesProps) => props.populatingInProgress, renderComponent(LoadingElement))
    )(PopulateEstimatesFormComponent);