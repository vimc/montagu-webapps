import * as React from "react";
import { PageWithHeader } from "../../shared/components/PageWithHeader/PageWithHeader";
import { AdminLogout } from "./Login/Logout";
const logo: string = require("../../shared/resources/banner-blue.png");

export abstract class AdminPageWithHeader<TLocationProps> extends PageWithHeader<TLocationProps> {
    header() {
        return <AdminLogout />;
    }

    siteTitle() {
        return "Admin portal";
    }

    logoURL() {
        return logo;
    }

    headerStyle(): any {
        return {
            backgroundColor: "#b8ced9",
            color: "black"
        };
    }
}