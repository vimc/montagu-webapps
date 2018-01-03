import * as React from "react";
import {UploadFileForm} from "../../../../shared/components/UploadFileForm";
import { Collapse } from 'reactstrap';

interface ModelRunParametersUploadFormProps {
    groupId: string;
    touchstoneId: string;
    disease: string;
    token: string;
}

interface ModelRunParametersUploadFormState{
    isOpen: boolean;
}

export class UploadModelRunParametersForm extends React.Component<ModelRunParametersUploadFormProps, ModelRunParametersUploadFormState> {

    render() {

        return <Collapse isOpen={this.state.isOpen}>
            <UploadFileForm token={this.props.token}
                            uploadText={"Choose a file"}
                            enableSubmit={true}
                            successMessage={"Success! You have uploaded a new model run parameter set"}>
            </UploadFileForm>

        </Collapse>;
    }
}