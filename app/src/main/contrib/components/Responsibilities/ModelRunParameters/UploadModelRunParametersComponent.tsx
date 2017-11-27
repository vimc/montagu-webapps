import * as React from "react"
import {UploadForm} from "../../../../shared/components/UploadForm";

export interface UploadModelRunParametersFormProps {
    groupId: string;
    scenarioId: string;
}

export class UploadModelRunParametersForm extends React.Component<UploadModelRunParametersFormProps, undefined> {

    render() {
        return <UploadForm
            token={"faketoken"}
            uploadText="Choose a model run parameter set"
            canUpload={true}
            fields={[{name: "description", label: "A descriptive name to identify this set", type: "text"}]}
            disabledText="No model run parameter sets can be added"/>;
    }
}