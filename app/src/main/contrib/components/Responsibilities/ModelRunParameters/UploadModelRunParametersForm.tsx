import * as React from "react";
import {UploadFileForm} from "../../../../shared/components/UploadFileForm";

interface ModelRunParametersUploadFormProps {
    groupId: string;
    touchstoneId: string;
    diseases: string[];
    token: string;
}

interface ModelRunParametersUploadFormState {
    diseaseSelected: boolean;
    descriptionSelected: boolean;
}

export class UploadModelRunParametersForm extends React.Component<ModelRunParametersUploadFormProps, ModelRunParametersUploadFormState> {

    constructor(props: ModelRunParametersUploadFormProps) {
        super();
        this.state = {
            diseaseSelected: props.diseases.length == 1,
            descriptionSelected: false
        };
    }

    handleDiseaseChange(e: React.MouseEvent<HTMLSelectElement>) {
        this.setState({
            diseaseSelected: (e.target as HTMLSelectElement).value.length > 0
        });
    }

    handleDescriptionChange(e: React.MouseEvent<HTMLInputElement>) {
        this.setState({
            descriptionSelected: (e.target as HTMLInputElement).value.length > 1
        });
    }

    render() {

        const multipleDiseases = this.props.diseases.length > 1;

        let diseaseInput = null;
        let diseaseHelperText = "";

        if (multipleDiseases) {
            const diseases = this.props.diseases.map((disease) =>
                <option key={disease} value={disease}>{disease}</option>);

            diseaseInput = <div className="form-group">
                <select name="disease" className="form-control" onChange={this.handleDiseaseChange.bind(this)}>
                    <option value="">-- Select a disease --</option>
                    {diseases}
                </select>
            </div>;

            diseaseHelperText = "to know which disease these are for, and";
        }
        else {
            diseaseInput = <input type="hidden" name="disease" value={this.props.diseases[0]}/>
        }

        return <div>
            <p>On this page you can upload a new set of model run parameters. We need {diseaseHelperText} a human
                readable description for you to easily identify them when uploading burden estimates.</p>
            <UploadFileForm token={this.props.token}
                            uploadText={"Choose a new model run parameter set"}
                            enableSubmit={this.state.descriptionSelected && this.state.diseaseSelected}
                            successMessage={"Success! You have uploaded a new model run parameter set"}>
                {diseaseInput}
                <div className="form-group">
                    <label>Human readable name or description of this set:</label>
                    <input type="text" className="form-control" name="description"
                           onChange={this.handleDescriptionChange.bind(this)}/>
                </div>
            </UploadFileForm>

        </div>;
    }
}