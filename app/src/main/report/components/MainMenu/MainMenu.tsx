import * as React from "react";
import {ReportingPageWithHeader} from "../ReportingPageWithHeader";
import {ReportList} from "../Reports/ReportList";
import {IPageWithParent} from "../../../shared/models/Breadcrumb";
import {ReportingPageHeader} from "../ReportingPageHeader";
import {Search} from "./Search";

export class MainMenu extends ReportingPageWithHeader<undefined> {

    name() {
        return "Main menu";
    }

    title() {
        return <span>Choose a report to view</span>;
    }

    urlFragment() {
        return "/";
    }

    parent(): IPageWithParent {
        return null;
    }

    render(): JSX.Element {
        return <div>
            <ReportingPageHeader siteTitle={this.siteTitle()}/>
            <div className={"container"}>
                <div className="row mt-5 mb-4">
                    <div className="col-6">
                        <Search/>
                    </div>
                </div>
                <hr/>
                <div className={"row mt-5"}>
                    <div className={"col-12"}>
                        <ReportList/>
                    </div>
                </div>
            </div>
        </div>;
    }
}