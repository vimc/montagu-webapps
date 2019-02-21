import * as React from "react";
import ReactRadioButtonGroup, {RadioButtonOption} from "react-radio-button-group";
import {FC} from "react";

interface Props {
    value: string;
    onSelectFormat: (format: string) => void;
}

export const FormatControl: FC<Props> = (props: Props) => {

    const formats: RadioButtonOption[] = [
        {value: "long", label: "Long"},
        {value: "wide", label: "Wide"},
    ];

    return <ReactRadioButtonGroup
        name="format"
        options={formats}
        value={props.value}
        onChange={props.onSelectFormat}
        groupClassName="col"
        itemClassName="form-check-label form-check-inline"
        inputClassName="form-check-input"
        labelClassName="mb-0"
    />;

};