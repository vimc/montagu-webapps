import * as React from "react";
import {FormEvent} from "react";
import {Dispatch} from "redux";
import {Alert} from "reactstrap";
import {compose} from "recompose";
import {connect} from 'react-redux';

import {OptionSelector} from "../../OptionSelector/OptionSelector";
import {BurdenEstimateSetTypeCode, CreateBurdenEstimateSet} from "../../../../shared/models/Generated";
import {estimatesActionCreators} from "../../../actions/estimatesActionCreators";
import {ContribAppState} from "../../../reducers/contribAppReducers";

export interface CreateBurdenEstimateSetFormProps {
    groupId: string;
    touchstoneId: string;
    scenarioId: string;
    createBurden: (data: CreateBurdenEstimateSet) => void;
}

export interface CreateBurdenEstimateSetFormState {
    data: CreateBurdenEstimateSet;
    hasSuccess: boolean;
    errors: Error[];
    disabled: boolean;
    validated: boolean;
}

// ToDo: Use Redux-form

export class CreateBurdenEstimateSetFormComponent extends React.Component<CreateBurdenEstimateSetFormProps, CreateBurdenEstimateSetFormState> {

    private successMessage: string = "Success! You have registered how your central estimates were calculated";
    private options = [
        {
            value: "central-single-run",
            text: "Single model run"
        }, {
            value: "central-averaged",
            text: "Averaged across model runs"
        }];

    constructor(props: CreateBurdenEstimateSetFormProps) {
        super(props);
        this.state = {
            data: {
                model_run_parameter_set: null,
                type: {
                    type: null,
                    details: null
                }
            },
            hasSuccess: false,
            errors: [],
            disabled: false,
            validated: false
        };
        this.onTypeChange = this.onTypeChange.bind(this);
        this.onDetailsChange = this.onDetailsChange.bind(this);
        this.clearFormStatus = this.clearFormStatus.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onTypeChange(value: BurdenEstimateSetTypeCode) {
        this.setState( {
            data: {
                model_run_parameter_set: null,
                type: {
                    type: value,
                    details: this.state.data.type.details
                }
            },
            errors: []
        });
    }

    onDetailsChange(e: FormEvent<HTMLInputElement>) {
        const details = (e.target as HTMLInputElement).value;
        this.setState({
            data: {
                model_run_parameter_set: null,
                type: {
                    details: details,
                    type: this.state.data.type.type
                }
            },
            errors: []
        })
    }

    clearFormStatus() {
        this.setState({
            errors: [],
            hasSuccess: false,
            disabled: false
        })
    }

    onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const form = e.target as HTMLFormElement;

        this.setState({
            validated: true
        });

        if (form.checkValidity() === true) {

            this.setState({
                disabled: true
            });

            const data = this.state.data;
            this.props.createBurden(data);
        }
    }

    render(): JSX.Element {

        return <div className={"bg-light p-3"}>
            <h5>First step: register how these central estimates were calculated</h5>
            <form encType="multipart/form-data"
                  onSubmit={this.onSubmit}
                  className={this.state.validated ? "was-validated" : ""}
                  noValidate
            >
                <div className="row">
                    <div className="col">
                        <label>How were these estimates calculated?</label>
                        <OptionSelector
                            name={"typeCode"}
                            defaultOption={"-- Please select one --"}
                            options={this.options} onChange={this.onTypeChange}
                            className="form-control" required={true}
                        />
                        <div className="invalid-feedback">
                            Please choose one
                        </div>
                    </div>
                    <div className="col">
                        <label>Details of how these estimates were calculated</label>
                        <input
                            type="text"
                            className={"form-control"}
                            name="details"
                            required={true}
                            onChange={this.onDetailsChange}
                        />
                        <small className="form-text text-muted">
                            For example, if averaged, what kind of averaging function was used.
                        </small>
                        <div className="invalid-feedback">
                            Please give us some details, a short note is fine
                        </div>
                    </div>
                </div>
                <Alert color="danger" isOpen={this.state.errors.length > 0}>
                    {this.state.errors[0] && this.state.errors[0].message}
                </Alert>
                <Alert color="success" isOpen={this.state.hasSuccess} toggle={this.clearFormStatus}>
                    {this.successMessage}
                </Alert>
                <button type="submit" className="mt-2"
                        disabled={this.state.disabled}>Continue
                </button>
            </form>
        </div>;
    }
}

export const mapDispatchToProps = (dispatch: Dispatch<ContribAppState>): Partial<CreateBurdenEstimateSetFormProps> => {
    return {
        createBurden: (data: CreateBurdenEstimateSet) => dispatch(estimatesActionCreators.createBurden(data))
    }
};

export const CreateBurdenEstimateSetForm = compose(
    connect(state => state, mapDispatchToProps),
)(CreateBurdenEstimateSetFormComponent) as React.ComponentClass<Partial<CreateBurdenEstimateSetFormProps>>;
