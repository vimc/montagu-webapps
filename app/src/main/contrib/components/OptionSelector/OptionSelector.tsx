import * as React from "react";

export interface Option {
    value: string;
    text: string;
}

export interface OptionList {
    defaultOption: string;
    options: Option[];
    onChange: (value: string) => void;
    className?: string;
    name: string;
    required: boolean;
}

export class OptionSelector extends React.Component<OptionList, undefined> {
    render() {
        const options = this.props.options.map(option =>
            <option key={option.value} value={option.value}>
                {option.text}
            </option>
        );
        let defaultOption: JSX.Element = null;
        if (this.props.defaultOption) {
            defaultOption = <option key={null} value="">{this.props.defaultOption}</option>;
        }

        return <select onChange={this.onChange} className={this.props.className}
                       name={this.props.name} required={this.props.required}>
                {defaultOption}
                {options}
            </select>;
    }

    onChange = (event: React.FormEvent<HTMLSelectElement>) => {
        this.props.onChange(event.currentTarget.value);
    }
}