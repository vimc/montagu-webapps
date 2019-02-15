import * as React from "react";

const Resumable = require('resumablejs')

interface ResumableUploadState {
    file: any,
    progress: number,
    status: string,
    isUploading: boolean,
}

interface ResumableUploadProps {
    onSuccess: () => void; // TODO refresh latest estimate set
    url: string;
    bearerToken: string;
}

export class ReactResumableJs extends React.Component<ResumableUploadProps, ResumableUploadState> {

    private resumable: any;
    private uploader: Element;

    constructor(props: any) {
        super(props);
        this.state = {
            progress: 0,
            status: '',
            file: null,
            isUploading: false
        };

        this.resumable = null;
    }

    componentDidMount = () => {

        const headers = {
            Authorization: `Bearer ${this.props.bearerToken}`
        };
        let ResumableField = new Resumable({
            target: this.props.url,
            testChunks: false,
            maxFiles: 1,
            headers: headers
        });

        ResumableField.assignBrowse(this.uploader, false);

        ResumableField.on('fileAdded', (file: any, event: any) => {
            console.log("fileAdded");
            this.setState({
                file: file
            });
        });

        ResumableField.on('fileSuccess', () => {
            console.log("fileSuccess");

            this.setState({
                status: "Completed",
                isUploading: false
            }, () => {
                this.props.onSuccess();
            });
        });

        ResumableField.on('progress', () => {

            this.setState({
                isUploading: ResumableField.isUploading()
            });

            if ((ResumableField.progress() * 100) < 100) {
                this.setState({
                    status: ResumableField.progress() * 100 + '%',
                    progress: ResumableField.progress() * 100
                });
            } else {
                setTimeout(() => {
                    this.setState({
                        progress: 0
                    })
                }, 1000);
            }

        });

        ResumableField.on('fileError', (file: any, errorCount: any) => {
            console.log("fileError");
            this.setState({
                status: "error",
                isUploading: false
            });
        });

        this.resumable = ResumableField;
    };

    removeFile = (event: any, file: any) => {

        event.preventDefault();

        this.setState({
            file: null
        });

        this.resumable.removeFile(file);
    };

    cancelUpload = () => {
        this.resumable.cancel();
    };

    startUpload = () => {
        this.setState({
            status: "Uploading",
            isUploading: true
        });
        this.resumable.upload();
    };

    render() {

        const originFile = this.state.file;
        let selectedFile = null;
        if (originFile) {
            selectedFile = <div className="thumbnail" key={originFile.name}>
                {originFile.name}
                <a onClick={(event) => this.removeFile(event, originFile)} href="#">[X]</a>
            </div>;
        }

        return (
            <div>
                <label>
                    Choose file
                    <input
                        ref={node => this.uploader = node}
                        type="file"
                        className='btn'
                        name={'file-upload'}
                        accept={"csv"}
                    />
                </label>
                <div className="progress" style={{display: this.state.progress === 0 ? "none" : "block"}}>
                    <div className="progress-bar" style={{width: this.state.progress + '%'}}></div>
                </div>

                {selectedFile}
                <button disabled={this.state.isUploading} className="submit start"
                        onClick={this.startUpload}>Upload
                </button>
                <button disabled={!this.state.isUploading} className="cancel"
                        onClick={this.cancelUpload}>Cancel
                </button>
            </div>
        );
    }
}

