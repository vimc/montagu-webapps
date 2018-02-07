import * as React from "react";
import {ReportingPageWithHeader} from "../ReportingPageWithHeader";
import {reportStore} from "../../stores/ReportStore";
import {IPageWithParent} from "../../../shared/models/Breadcrumb";
import {Page} from "../../../shared/components/PageWithHeader/Page";
import {Button} from "reactstrap";
import {Collapse} from "reactstrap";
import {Card} from "reactstrap";

const Typeahead = require('react-bootstrap-typeahead').Typeahead;

const testimage = require("./test.png");
const measles = require("./measles.png");

export class MainMenu extends ReportingPageWithHeader<any> {
    load(props: undefined) {
        return this.loadParent(props).then(() => {
            return reportStore.fetchReports();
        });
    }

    name() {
        return "Main menu";
    }

    title() {
        return <span></span>;
    }

    urlFragment() {
        return "/";
    }

    parent(): IPageWithParent {
        return null;
    }

    render(): JSX.Element {
        // return <Page page={this}>
        //     <div className="container">
        //
        //         <h2 className="mb-2">Viewing all reports</h2>
        //         <div className="row">
        //             <div className="col-4">
        //                 Search: <input className="form-control" type="text">
        //
        //             </input>
        //             </div>
        //             <div className="col-4">
        //                 Sort by: <select className="form-control">
        //                 <option>Date created</option>
        //                 <option>Date published</option>
        //                 <option>Name</option>
        //                 <option>Most viewed</option>
        //             </select>
        //             </div>
        //         </div>
        //         <div className="row mt-5">
        //             <div className="col-8">
        //                 <ul className="list-unstyled ml-4">
        //                     <li><a href="/reports/201710gavi-coverage-estimates/20180205-100037-38487ecc/">201710gavi-coverage-estimates</a>
        //                         <p className="small text-muted">Published: 12th Oct 2017</p>
        //                 </li><li>
        //                     <a href="/reports/guidance-201710-DALYs/20171124-110346-15208cac/">DALYs Guidance</a>
        //                     <p className="small text-muted">Published: 12th Oct 2017</p></li>
        //                     <li><a href="/reports/internal-2017-201708test-1-coverage/20170829-155605-aec5f8fb/">coverage data from 201708test-1</a>     <p className="small text-muted">Published: 12th Oct 2017</p></li>
        //                     <li><a href="/reports/internal-2017-201708test-2-coverage/20171115-100248-7ad5e28b/">coverage data from 201708test-2</a>     <p className="small text-muted">Published: 12th Oct 2017</p></li>
        //                     <li><a href="/reports/internal-2017-burden-estimates-template/20180117-165238-676f3fb0/">burden estimate template tables</a>     <p className="small text-muted">Published: 12th Oct 2017</p></li>
        //                     <li><a href="/reports/internal-2017-burden-estimates-template-hepb-scenario-specific/20180117-171841-e0127653/">Create scenario-specific burden estimate templates</a>     <p className="small text-muted">Published: 12th Oct 2017</p></li>
        //                     <li><a href="/reports/internal-2017-burden-estimates-template-open-call/20180104-163609-dca5e213/">open call burden estimate templates</a>     <p className="small text-muted">Published: 12th Oct 2017</p></li>
        //                     <li><a href="/reports/internal-2017-demography-childmortality/20171114-152328-da1957c2/">Discussion and methods regarding child mortality rates.</a>     <p className="small text-muted">Published: 12th Oct 2017</p></li>
        //                     <li><a href="/reports/internal-2017-demography-kosovo/20171109-204911-45436ef8/">Methods for creating Kosovo demographic data</a>     <p className="small text-muted">Published: 12th Oct 2017</p></li>
        //                     <li><a href="/reports/internal-2017-demography-marshall/20171109-205347-89919a97/">Methods for creating Marshsall Islands demographic data</a>     <p className="small text-muted">Published: 12th Oct 2017</p></li>
        //                     <li><a href="/reports/internal-2017-demography-over80/20171114-094012-ed43d81c/">Methods and results for over-80 demographics pre-1990</a>     <p className="small text-muted">Published: 12th Oct 2017</p></li>
        //                     <li><a href="/reports/internal-2017-demography-tuvalu/20171109-205800-aa3a35c2/">Methods for creating Tuvalu demographic data</a></li>
        //                     <li><a href="/reports/internal-2017-modup-201210-201510/20171024-092346-210cff84/">internal-2017-modup-201210-201510</a></li>
        //                     <li><a href="/reports/internal-2017-modup-201210-201607/20180109-160958-f46f849c/">internal-2017-modup-201210-201607</a></li>
        //                     <li><a href="/reports/internal-2017-modup-method2/20171027-125517-42e14317/">internal-2017-modup-method2</a></li>
        //                     <li><a href="/reports/internal-2017-modup2-201510gavi-201303gavi/20180112-144941-ad94d715/">Modified update (method 2) for 201510-201303</a></li>
        //                     <li><a href="/reports/internal-2017-modup2-201510gavi-201510gavi/20180125-172527-33f86da5/">Modified update (method 2) for 201510-201510</a></li>
        //                 </ul>
        //             </div>
        //         </div>
        //     </div>
        // </Page>
        return <Page page={this}>

            <div className="container">

                <div className="row">

                    <div className="col-12 col-lg-6">
                        <div className="row">

                            <div className="col-12 col-lg-6">
                                <div className="" style={{marginTop: "22px"}}>
                                    <h2>Search</h2>
                                    <Typeahead minLength={2} options={["DALYs Guidance",
                                        "coverage data from 201708test-1",
                                        "coverage data from 201708test-2",
                                        "burden estimate template tables",
                                        "Create scenario-specific burden estimate templates",
                                        "open call burden estimate templates",
                                        "Discussion and methods regarding child mortality rates",
                                        "Methods for creating Kosovo demographic data",
                                        "Methods for creating Marshsall Islands demographic data"
                                    ]}/>
                                    <a href="#">View all</a>
                                </div>
                            </div>

                            <div className="col-12 col-sm-6 col-lg-4 mt-3">
                                <div className="">
                                    <h2 className="display-4">Browse</h2>
                                    <Card>
                                    <div className="card-body">
                                        <ul className="nav nav-pills flex-column">
                                            <li className="nav-item">
                                                <a className="nav-link active" href="#">Recently viewed</a>
                                            </li>
                                            <li className="nav-item">
                                                <a className="nav-link" href="#">Popular</a>
                                            </li>
                                            <li className="nav-item">
                                                <a className="nav-link" href="#">Guidance</a>
                                            </li>
                                            <li className="nav-item">
                                                <a className="nav-link disabled" href="#">Modified updates</a>
                                            </li>
                                            <li className="nav-item">
                                                <a className="nav-link disabled" href="#">Another Category</a>
                                            </li>
                                        </ul>
                                        <ul className="list-group list-group-flush">
                                            <li className="list-group-item"><a href="#">DALYs Guidance</a></li>
                                            <li className="list-group-item"><a href="#">Small countries guidance</a></li>
                                            <li className="list-group-item"><a href="#">Coverage guidance</a></li>
                                        </ul>
                                    </div>
                                    </Card>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
                <div className="row">
                    {/*<div className="col-12 col-sm-6 col-lg-4 mt-3">*/}
                    {/*<div className="">*/}
                    {/*<div className="card-body">*/}
                    {/*<h5 className="card-title">Categories</h5>*/}
                    {/*<Card>*/}
                    {/*<div className="card-header arrow-up">Guidance</div>*/}
                    {/*<Collapse isOpen={true}>*/}
                    {/*<div className="card-body p-1">*/}
                    {/*<ul className="list-group list-group-flush">*/}
                    {/*<li className="list-group-item"><a href="#">DALYs Guidance</a></li>*/}
                    {/*<li className="list-group-item"><a href="#">Small countries guidance</a></li>*/}
                    {/*<li className="list-group-item"><a href="#">Coverage guidance</a></li>*/}
                    {/*</ul>*/}
                    {/*</div>*/}
                    {/*</Collapse>*/}
                    {/*</Card>*/}
                    {/*<Card>*/}
                    {/*<div className="card-header arrow-down">Modified update</div>*/}
                    {/*<Collapse isOpen={false}>*/}
                    {/*</Collapse>*/}
                    {/*</Card>*/}
                    {/*<Card>*/}
                    {/*<div className="card-header arrow-down">Some other category</div>*/}
                    {/*<Collapse isOpen={false}>*/}
                    {/*</Collapse>*/}
                    {/*</Card>*/}
                    {/*</div>*/}
                    {/*</div>*/}
                    {/*</div>*/}

                    <div className="col-12 pr-0">
                        <h2>Featured report</h2>
                        <div className="border border-dark rounded-0" style={{height: "100%"}}>
                            <div className="mb-3 mr-5 ml-5 mt-3">
                                <h4 className="mb-3">Impact of measles campaigns 2018 - 2020 under low coverage
                                    assumptions</h4>
                                <p><a href="#">See full report</a></p>
                                <img src={measles} className="img-fluid d-block"/>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            <div className="mb-5"></div>
        </Page>;
    }
}