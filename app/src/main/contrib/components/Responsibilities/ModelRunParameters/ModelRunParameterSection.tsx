import {ModelRunParameterSet} from "../../../../shared/models/Generated";
import * as React from "react";
import {UploadFileForm} from "../../../../shared/components/UploadFileForm";
import {Collapse} from 'reactstrap';

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
        return <div>
            <button onClick={this.toggle.bind(this)} className={this.props.sets.length > 0 ? "" : "d-none"}>Upload a new parameter set
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