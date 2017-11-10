import * as React from "react";
import { PageWithHeader } from "../../shared/components/PageWithHeader/PageWithHeader";
import { ReportingLogout } from "./Login/Logout";
const logo: string = require("../../shared/resources/banner-green.png");

export abstract class ReportingPageWithHeader<TLocationProps> extends PageWithHeader<TLocationProps> {
    header() {
        return <ReportingLogout />;
    }

    siteTitle() {
        return "Reporting portal";
    }

    logoURL() {
        return logo;
    }

    headerStyle(): any {
        return {
            backgroundColor: "#dbffd9",
            color: "black"
        };
    }
}