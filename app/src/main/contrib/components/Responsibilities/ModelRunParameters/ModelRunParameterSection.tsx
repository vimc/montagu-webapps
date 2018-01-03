import {ModelRunParameterSet} from "../../../../shared/models/Generated";
import * as React from "react";
import {Alert, Collapse} from 'reactstrap';
import {longestTimestamp} from "../../../../shared/Helpers";
import {Form} from "../../../../shared/components/Form";
import {CustomFileInput} from "../../../../shared/components/CustomFileInput";

interface Props {
    url: string;
    disease: string;
    sets: ModelRunParameterSet[];
}

interface State {
    fileInputKey: Date;
}

export class ModelRunParameterSection extends React.Component<Props, State> {

    constructor() {
        super();
        this.state = {
            fileInputKey: new Date()
        }
    }

    onSuccess(){
        this.setState({
            // this is to trick React into re-rendering the file input when the form has been successfully submitted
            // see https://github.com/erikras/redux-form/issues/769
            fileInputKey: new Date()
        })
    }

    render(): JSX.Element {

        let alertText = `You have not uploaded any model run parameter sets for ${this.props.disease}`;

        const hasSets = this.props.sets.length > 0;

        if (hasSets) {
            const lastUploaded = this.props.sets[0];
            alertText = `You last uploaded a model run parameter set on ${longestTimestamp(new Date(lastUploaded.uploaded_on))}`
        }

        return <div>
            <h2 className="sectionTitle mb-0">Disease: {this.props.disease}</h2>
            <hr className="mt-1"/>
            <Alert color="warning">{alertText}</Alert>

            <Form url={this.props.url} submitText={"Upload"}
                  successMessage={"Success! You have uploaded a new model run parameter set"}
                  successCallback={this.onSuccess.bind(this)}
                  data={null}>
                <input type={"hidden"} name={"description"} value={""}/>
                <input type={"hidden"} name={"disease"} value={this.props.disease}/>
                <CustomFileInput required={true} key={this.state.fileInputKey.toISOString()}>Choose file</CustomFileInput>
            </Form>
        </div>
    }
}