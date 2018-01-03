import {ModelRunParameterSet} from "../../../../shared/models/Generated";
import * as React from "react";
import {UploadFileForm} from "../../../../shared/components/UploadFileForm";
import {Collapse, Alert} from 'reactstrap';
import {longestTimestamp} from "../../../../shared/Helpers";

interface Props {
    parametersToken: string;
    disease: string;
    sets: ModelRunParameterSet[];
}

interface State {
    isOpen: boolean;
}

export class ModelRunParameterSection extends React.Component<Props, State> {

    constructor(props: Props) {
        super();
        this.state = {
            isOpen: props.sets.length == 0
        }
    }

    toggle() {
        this.setState((prevState: State) => {
            return {isOpen: !prevState.isOpen}
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
            <h2 className={"sectionTitle"}>Disease: {this.props.disease}</h2>
            <Alert color={hasSets ? "success" : "warning"}>{alertText}</Alert>
            <button onClick={this.toggle.bind(this)} className={hasSets ? "" : "d-none"}>Upload a new parameter set
                <span className={this.state.isOpen ? "arrowUp" : "arrowDown"}></span>
            </button>

            <Collapse isOpen={this.state.isOpen}>
                <UploadFileForm token={this.props.parametersToken}
                                uploadText={"Choose a file"}
                                enableSubmit={true}
                                successMessage={"Success! You have uploaded a new model run parameter set"}>
                </UploadFileForm>

            </Collapse>
        </div>
    }
}