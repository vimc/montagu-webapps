import * as React from "react";
import {UploadFileForm} from "../../../../shared/components/UploadFileForm";
import {helpers} from "../../../../shared/Helpers";
import {Alert} from "reactstrap";
import {BurdenEstimateSet, ErrorInfo, Result} from "../../../../shared/models/Generated";
import {CreateBurdenEstimateSetForm} from "./CreateBurdenEstimateSetForm";
import {checkFileExtensionIsCSV} from "../../../../shared/validation/FileValidationHelpers";
import {ReactResumableJs} from "./NewUploadForm";

export interface UploadBurdenEstimatesFormComponentProps {
    touchstoneId: string;
    scenarioId: string;
    groupId: string;
    estimateSet: BurdenEstimateSet | null;
    canUpload: boolean;
    canCreate: boolean;
}

interface State {
    hasUploadSuccess: boolean;
    errors: ErrorInfo[]

}

export class UploadBurdenEstimatesForm extends React.Component<UploadBurdenEstimatesFormComponentProps, State> {
    private uploadSuccessMessage = "Success! You have uploaded a new set of burden estimates";

    constructor() {
        super();
        const result = helpers.ingestQueryStringAndReturnResult();
        this.state = {
            hasUploadSuccess: result != null && (result as Result).status == "success",
            errors: result ? result.errors : []
        }
    }

    onDismiss() {
        this.setState({
            errors: []
        })
    }

    render() {
        const hasError = this.state.errors.length > 0;

        const createForm = this.props.canCreate && !this.props.canUpload && !this.state.hasUploadSuccess ?
            <CreateBurdenEstimateSetForm groupId={this.props.groupId}
                                         touchstoneId={this.props.touchstoneId}
                                         scenarioId={this.props.scenarioId}/>
            : null;

        return <div>
            <Alert color="danger" isOpen={hasError} toggle={this.onDismiss.bind(this)}>
                <p className="render-whitespace">
                    {this.state.errors[0] && this.state.errors[0].message}
                </p>
                 Please correct the data and re-upload.
            </Alert>
            <Alert color="success" isOpen={this.state.hasUploadSuccess}>
                {this.uploadSuccessMessage}
            </Alert>

            {createForm}
            {this.renderUploadForm()}
        </div>;
    }

    renderUploadForm(): JSX.Element {
        if (this.props.canUpload) {
            const {groupId, touchstoneId, scenarioId, estimateSet} = this.props;
            const redirectUrl = encodeURIComponent(helpers.getCurrentLocation());
            const url = `/modelling-groups/${groupId}/responsibilities/${touchstoneId}/${scenarioId}/estimate-sets/${estimateSet.id}/`;

            return <div className={"bg-light p-3"}>
                <h5>Second step: upload a CSV containing your central estimates</h5>

                <ReactResumableJs onSuccess={null} url={`http://localhost:8080/v1/modelling-groups/${groupId}/responsibilities/${touchstoneId}/${scenarioId}/estimate-sets/1/actions/postchunk/`}
                                  bearerToken={"H4sIAAAAAAAAAKVU23KrOBD8oj0FIr492jhgZIxtHG56SSEJA7bAxFzF169w7LOVVHIqu_ukqtFI3dMzPRGHCdZJuk3hwekN2Urh7FfEYU89YwhKyLckM3d75BupqcIW-bAKfasPvVlNuDE20oKYwEpwKpcY0AKn7Zuvzk5YcWu6ggXyNzXJ3ASpt_gZeXKDFJgQPSkC5cNdhYHN8OpDjAv8FoORwIMF1pkUem5v5pAF3r5cs7YhwGI407jg8yFO9ZkcgKQXZ_2JwzuO3hU4I5Xg0lB_0ZuZnIh_cnSQK8ExFXX2pjrUJvjqbimwa8TlnGQzmQiOVIEF1Z13Dtms_ITBMegY4SOFZExCh1tMJsDlInYa8h5vqW8xkm9q5NkFVQUHvb3_6bZYgZLI58jTzqb-BY9lAfdcXgWCawjcoQ8NzVweeJQ9tMDeoHlXht4oNz3KRV_a7ZktTYcmJLeuyG2bocehJwtO_2j7H99V1Btl4k1BQMKQ2n2h9Xx8cDaVDTROQMWELowodoE9TRo0fOj6E_yvcv6VXsow1_B_1Ex56NvsG6x379z_-a7OodcBmAHBI0HA-alXhL8QI7d5vdd7m1VXzDurAsHptw5_mOGPPls0JLf_7KEVZETX-Kd5vuEYaZvefSD2hvH7_oZ_09moRO31MJsk_YTpD5iCc_qjebn70_hRv4S3xV7Szt_m5wJX2T_2wMC1xfosEXq9cwdIxpn94CzisthxRmlkrL_tvxwlAbAEX7fA_iIJlH0tfJsPegjdrsgbHemKteggcs9Q27tQc27v3SeiGuPNiyNvlkYvTrBdSb8yxWj3fa3QtdPF8uJp11vWaWd12napGJtF-YrGqIz9o2c-Nc0JSnBHNgvlr9fpwQ5yDZ52GW6MZ8jny2WBMu3YbI5lfVjmky7zjDIYjzXeeFp3jqJt5pu-30fXK5Xm01yexIer3JXpmlLLnktONwcOLyeXiMC3ad6Fu6162tftYldUWdTU1sQSKe1UcyLcjXeR2ZS8WaG4QedlIKXZy2hXRBFHL3oBq96_kG5du-VlVcUdv9D5Je8UK3RHtncJ7DwCT-FbuGMLl5X9MfYPvN6eXk8r63wu9mFFNESzJFGe177aPC_2Smr4jruJq-ykTN341cNqHm7DcRwuZmOgoVFkTdhmpAKQzIh5JPHfEbYJNucGAAA"}/></div>
        } else {
            return null;
        }
    }
}