import * as React from "react";
import {InternalLink} from "../../../../shared/components/InternalLink";
import {ReportRowRenderProps} from "../ReportsListComponent";
import {Report} from "../../../../shared/models/Generated";

export const NameCell: React.SFC<ReportRowRenderProps> = (props: ReportRowRenderProps) => {

    let name = props.value as string;
    const report = props.original;

    return <div>
        <InternalLink href={`/${report.name}/${report.latest_version}/`}>
            {name}
        </InternalLink>
    </div>
};

export const nameAccessorFunction = (data: Report) => {

    let name = data.name;
    if (data.display_name) {
        name = data.display_name + ` (${name})`
    }
    return name
};