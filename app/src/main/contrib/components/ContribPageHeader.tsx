import * as React from "react";
import {PageHeaderNew} from "../../shared/components/PageWithHeader/PageHeaderNew";
import * as logo from "./logo.png"

export const ContribPageHeader: React.SFC<undefined> = () => (
    <PageHeaderNew logo={logo} siteTitle={"Modellers' contribution portal"} />
)