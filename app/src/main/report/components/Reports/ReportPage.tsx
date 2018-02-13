import * as React from "react";
import {reportActions} from "../../actions/ReportActions";
import {ReportingPageWithHeader} from "../ReportingPageWithHeader";
import {ReportDetails} from "./ReportDetails";
import {reportStore} from "../../stores/ReportStore";
import {PageProperties} from "../../../shared/components/PageWithHeader/PageWithHeader";
import {appSettings} from "../../../shared/Settings";
import {MainMenu} from "../MainMenu/MainMenu";
import {ReportPageTitle} from "./ReportPageTitle";
import {Page} from "../../../shared/components/PageWithHeader/Page";
import {Version} from "../../../shared/models/reports/Report";
import Card from "reactstrap/lib/Card";

export interface ReportPageProps {
    report: string;
    version: string;
}

const imgSrc = require("./fig1.png");

const imgSrc2 = require("./fig2.png");

const imgSrc3 = require("./fig3.png");

export class ReportPage extends ReportingPageWithHeader<ReportPageProps> {
    constructor(props: PageProperties<ReportPageProps>) {
        super(props);
        this.changeVersion = this.changeVersion.bind(this);
        this.state = {
            main: true,
            changelog: false,
            published: false
        }
    }

    load(props: ReportPageProps): Promise<Version> {
        return this.loadParent(props).then(() => {
            reportActions.setCurrentReport(props.report);
            return reportStore.fetchVersions().then(() => {
                reportActions.setCurrentVersion(props.version);
                return reportStore.fetchVersionDetails();
            });
        });
    }

    changeVersion(version: string): Promise<Version> {
        const params = this.props.location.params;
        const report = params.report;
        this.props.router.redirectTo(`${appSettings.publicPath}/${report}/${version}/`, false);
        return this.load({
            report: report,   // same report as in old URL
            version: version  // new version from function argument
        });
    }

    parent() {
        return new MainMenu();
    }

    title() {
        return <ReportPageTitle/>;
    }


    toggle() {
        this.setState({
            published: !this.state.published
        })
    }

    name() {
        const params = this.props.location.params;
        return `${params.report} (${params.version})`;
    }

    urlFragment() {
        const params = this.props.location.params;
        return `${params.report}/${params.version}/`;
    }

    nav() {
        this.setState({
            main: false,
            changelog: false
        })
    }

    changelog() {
        this.setState({
            main: false,
            changelog: true
        })
    }


    render(): JSX.Element {
        return <Page page={this}>
            <div className="">
                <div className="row flex-xl-nowrap">
                    <div className={"col-12 d-block d-sm-none"}>
                        <div className={"nav-collapsed"}>
                            <button className={"btn btn-link bd-search-docs-toggle float-right"}>
                                <svg xmlns="http://www.w3.org/2000/svg"
                                     viewBox="0 0 30 30" width="30" height="30"
                                     focusable="false"><title>Menu</title>
                                    <path stroke="currentColor" stroke-width="2"
                                          stroke-linecap="round" stroke-miterlimit="10"
                                          d="M4 7h22M4 15h22M4 23h22"></path>
                                </svg>
                            </button>
                            <div className={"clearfix"}></div>
                        </div>
                    </div>
                    <div className="d-none d-sm-block col-12 col-md-4 col-xl-2"
                         style={{borderRight: "1px solid rgba(0,0,0,.1)"}}>
                        <nav className="bd-links collapse show">
                            <ul className="nav flex-column">
                                <li className="nav-item">
                                    <a className={this.state.main ? "nav-link active" : "nav-link"} href="#">Report</a>
                                </li>
                                <li className="nav-item" onClick={this.nav.bind(this)}>
                                    <a className={!this.state.main && !this.state.changelog ? "nav-link active" : "nav-link"}
                                       href="#">Downloads</a>
                                </li>
                                <li className={"nav-item"}
                                    onClick={this.changelog.bind(this)}>
                                    <a className={this.state.changelog ? "nav-link active" : "nav-link"} href="#">Changelog</a>
                                </li>
                            </ul>

                            <hr/>
                            <div className="col-12">
                                <label className="font-weight-bold" htmlFor="report-version-switcher">Version</label>
                                <select className="form-control form-control-sm mb-3" id="report-version-switcher">
                                    <option value="20170226-233438-db34dc39">Sun Feb 26 2017, 23:34</option>
                                    <option value="20170224-000213-afd20506">Fri Feb 24 2017, 00:02</option>
                                </select>

                                <div className={`toggle btn btn-secondary ${this.state.published ? "" : "d-none"}`}
                                     onClick={this.toggle.bind(this)}
                                     style={{width: "114px", height: "34px"}}>
                                    <div className="toggle-group">
                                        <label className="btn badge-published toggle-on">Published</label>
                                        <span className="toggle-handle btn btn-light"></span>
                                    </div>
                                </div>
                                <div className={`${this.state.published ? "d-none" : ""} toggle btn btn-secondary off`}
                                     style={{width: "114px", height: "34px"}} onClick={this.toggle.bind(this)}>
                                    <div className="toggle-group">
                                        <label className="btn btn-warning active toggle-off"
                                               style={{color: "white"}}>Internal</label>
                                        <span className="toggle-handle btn btn-light"></span></div>
                                </div>
                                {this.state.published ? <div>
                                    <div className={"mt-3 font-weight-bold"}>Published</div>
                                    <p style={{fontSize: "14px"}}>8th November 2017</p></div> : ""}
                            </div>
                        </nav>
                    </div>
                    <div className="col-12 col-md-8 pl-md-5 pt-5 pt-sm-0">
                        {this.state.main && !this.state.changelog ?
                            <ReportDetails onChangeVersion={this.changeVersion}/>
                            : !this.state.main && !this.state.changelog ?
                                <div>

                                    <Card className={"mb-3"}>
                                        <div className={"card-header dark arrow-down"}>
                                            Global Cumulative Sum of Future Deaths Averted, Estimated Actual
                                            benchmarked against projected LTSG.
                                        </div>
                                        <div className={"card-body d-none"}>
                                            <img src={imgSrc}/>
                                            <h6 className={"font-weight-bold"}>Download</h6>
                                            <ul>
                                                <li>
                                                    <a href="#">
                                                        figure1_modelversion2012.png
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#">
                                                        figure1_modelversion2012_data.csv
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#">
                                                        figure1_modelversion2012_meta_data.csv
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                    </Card>

                                    <Card className={"mb-3"}>
                                        <div className={"card-header dark arrow-down"}>
                                            Vaccination impact in top 10 countries, using Estimated Actual coverage
                                            data.
                                        </div>
                                        <div className={"card-body d-none"}>
                                            <img src={imgSrc2}/>
                                            <h6 className={"font-weight-bold"}>Download</h6>
                                            <ul>
                                                <li>
                                                    <a href="#">
                                                        figure2_modelversion2012.png
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#">
                                                        figure2_modelversion2012_data.csv
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#">
                                                        figure2_modelversion2012_meta_data.csv
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                    </Card>

                                    <Card className={"mb-3"}>
                                        <div className={"card-header dark arrow-up"}>
                                            Global Future Deaths Averted by antigen, Estimated Actual benchmarked
                                            against projected LTSG.
                                        </div>
                                        <div className={"card-body"}>
                                            <img src={imgSrc3}/>
                                            <h6 className={"font-weight-bold"}>Download</h6>
                                            <ul>
                                                <li>
                                                    <a href="#">
                                                        figure3_modelversion2012.png
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#">
                                                        figure3_modelversion2012_data.csv
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#">
                                                        figure3_modelversion2012_meta_data.csv
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                    </Card>

                                    <div className={"card mb-5"}>
                                        <div className={"card-header arrow-down"}>
                                            Sources
                                        </div>
                                        <div className={"card-body d-none"}>
                                            <h6 className="font-weight-bold">External resources</h6>
                                            <ul className="">
                                                <li><a href="#">child-mortality.Rmd</a></li>
                                                <li><a href="#">cm2017.csv</a></li>
                                            </ul>
                                            <h6 className="font-weight-bold">Data</h6>
                                            <ul className={""}>
                                                <li>db_data
                                                    <div>
                                                        <a href={"#"} className="mr-2">csv</a>/<a className="ml-2"
                                                                                                  href={"#"}>rds</a>
                                                    </div>
                                                </li>
                                                <li>db_stat_data
                                                    <div>
                                                        <a href={"#"} className="mr-2">csv</a>/<a className="ml-2"
                                                                                                  href={"#"}>rds</a>
                                                    </div>
                                                </li>
                                                <li>db_source
                                                    <div>
                                                        <a href={"#"} className="mr-2">csv</a>/<a className="ml-2"
                                                                                                  href={"#"}>rds</a>
                                                    </div>
                                                </li>
                                                <li>db_dataset
                                                    <div>
                                                        <a href={"#"} className="mr-2">csv</a>/<a className="ml-2"
                                                                                                  href={"#"}>rds</a>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div> :
                                <div>
                                    <Card>
                                        <div className={"card-body"}>
                                            <ul className={"list-group list-group-flush ml-3"}>
                                                <li className={"list-group-item"}>
                                                    <label className="font-weight-bold">Tue Feb 14th 2017, 14:22</label>
                                                    <p>Update intro to make it more accurate</p>
                                                </li>
                                                <li className={"list-group-item"}>
                                                    <label className="font-weight-bold">Mon Feb 13th 2017, 18:46</label>
                                                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                                                        eiusmod
                                                        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
                                                        minim
                                                        veniam, quis nostrud exercitation ullamco laboris nisi ut
                                                        aliquip ex ea
                                                        commodo consequat. Duis aute irure dolor in reprehenderit in
                                                        voluptate
                                                        velit esse cillum dolore eu fugiat nulla pariatur. Excepteur
                                                        sint
                                                        occaecat cupidatat non proident, sunt in culpa qui officia
                                                        deserunt
                                                        mollit anim id est laborum. </p>
                                                </li>
                                                <li className={"list-group-item"}>
                                                    <label className="font-weight-bold">Fri Feb 10th 2017,
                                                        10:03 </label>
                                                    <p>First version</p>
                                                </li>
                                            </ul>
                                        </div>
                                    </Card>
                                </div>
                        }
                    </div>
                </div>
            </div>
        </Page>;
    }
}