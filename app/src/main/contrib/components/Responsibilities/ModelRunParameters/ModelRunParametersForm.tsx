import * as React from "react";
import { compose, branch, renderComponent} from "recompose";
import { connect } from 'react-redux';
import { Dispatch } from "redux";
import {Alert} from "reactstrap";

import {CustomFileInput} from "../../../../shared/components/CustomFileInput";
import {runParametersActionCreators} from "../../../actions/runParametersActionCreators";
import {ContribAppState} from "../../../reducers/contribAppReducers";
import {ValidationError} from "../../../../shared/components/Login/ValidationError";
import {ErrorInfo} from "../../../../shared/models/Generated";
import {FormValidationErrors} from "../../../../shared/components/ReduxForm/ReduxFormValidationError";

export interface ModelRunParametersFormProps {
    disease: string;
    errors: ErrorInfo[];
    uploadSet: (data: FormData) => void;
    uploading: boolean;
    success: boolean;
}

export interface ModelRunParametersFormState {
    fileInputKey: Date;
}

export class ModelRunParametersFormComponent extends React.Component<ModelRunParametersFormProps, ModelRunParametersFormState> {

    constructor() {
        super();
        this.state = {
            fileInputKey: new Date()
        };
        this.resetForm = this.resetForm.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    componentWillReceiveProps(nextProps: ModelRunParametersFormProps) {
        if (!nextProps.uploading) {
            this.resetForm();
        }
    }

    resetForm() {
        this.setState({
            // this is to trick React into re-rendering the file input when the form has been successfully submitted
            // see https://github.com/erikras/redux-form/issues/769
            fileInputKey: new Date()
        });
    }

    onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const data = new FormData(form);
        this.props.uploadSet(data);
    }

    render(): JSX.Element {
        return <div>
            <h4>Upload a new set of parameters:</h4>
            <form encType="multipart/form-data"
                  onSubmit={this.onSubmit}
                  noValidate
            >
                <input type={"hidden"} name={"disease"} value={this.props.disease}/>
                <CustomFileInput required={true} key={this.state.fileInputKey.toISOString()}>
                    Choose file
                </CustomFileInput>
                <FormValidationErrors errors={this.props.errors}/>
                <Alert color="success" isOpen={this.props.success}>
                    Success! You have uploaded a new parameter set
                </Alert>
                <button type="submit" className="mt-2" disabled={this.props.uploading}>
                    Upload
                </button>
            </form>
        </div>
    }
}

export const mapStateToProps = (state: ContribAppState, props: Partial<ModelRunParametersFormProps>): Partial<ModelRunParametersFormProps> => {
    return {
        disease: props.disease,
        errors: state.runParameters.errors,
        uploading: state.runParameters.uploading,
        success: state.runParameters.success
    }
};

export const mapDispatchToProps = (dispatch: Dispatch<ContribAppState>): Partial<ModelRunParametersFormProps> => {
    return {
        uploadSet: (data: FormData) => dispatch(runParametersActionCreators.uploadSet(data))
    }
};

export const ModelRunParametersForm = compose(
    connect(mapStateToProps, mapDispatchToProps),
)(ModelRunParametersFormComponent) as React.ComponentClass<Partial<ModelRunParametersFormProps>>;
