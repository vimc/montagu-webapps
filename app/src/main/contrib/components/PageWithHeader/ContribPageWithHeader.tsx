import * as React from "react";
import { ContribLogout } from "../Login/Logout";
import { PageWithHeader } from "../../../shared/components/PageWithHeader/PageWithHeader";
const logo: string = require("../../../shared/resources/banner-orange.png");

export abstract class ContribPageWithHeader<TLocationProps> extends PageWithHeader<TLocationProps> {
    header() {
        return <ContribLogout />;
    }

    siteTitle() {
        return "Modellers' contribution portal";
    }

    logoURL() {
        return logo;
    }

    headerStyle(): any {
        return {
            backgroundColor: "#ffb34f",
            color: "black"
        };
    }
}