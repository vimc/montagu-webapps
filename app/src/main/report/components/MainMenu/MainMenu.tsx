import * as React from "react";
import {ReportingPageWithHeader} from "../ReportingPageWithHeader";
import {reportStore} from "../../stores/ReportStore";
import {IPageWithParent} from "../../../shared/models/Breadcrumb";
import {Page} from "../../../shared/components/PageWithHeader/Page";
import {Card} from "reactstrap";
import Badge from "reactstrap/lib/Badge";

const Typeahead = require('react-bootstrap-typeahead').Typeahead;

const testimage = require("./test.png");
const measles = require("./measles.png");

export class MainMenu extends ReportingPageWithHeader<any> {

    constructor() {
        super();
        this.state = {
            showResults: false
        }
    }

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

    showResults = (e: any) => {
        if (e.target.value.length > 2)
            this.setState({
                showResults: true
            })
        else
            this.setState({
                showResults: false
            })

    };

    toggleResults = (e: any) => {
        this.setState({
            showResults: !this.state.showResults
        })
    };

    render(): JSX.Element {
        return <Page page={this}>

            <div className="container">

                <div className="row">

                    <div className="col-12 col-lg-6">
                        <h2>Search</h2>
                        <p>Tags: <a href="#" color={"light"} className="mr-2 badge badge-info">Category 1</a>
                            <a href="#"className="mr-2 badge badge-info" color={"light"}>Category 2</a>
                            <a href="#" color={"light"} className="mr-2 badge badge-info">Category 3</a>
                            <a href="#" className="mr-2 badge badge-info" color={"light"}>Category 4</a>
                            <a href="#" color={"light"} className="mr-2 badge badge-info">Category 5</a>
                            <a href="#" className="mr-2 badge badge-info" color={"light"}>Category 6</a>
                        </p>
                        <p>Choose a tag to filter by, or just start typing:</p>
                        <div className="mt-2 mr-5">
                            <input className="form-control form-control-lg" type="text"
                                   onChange={this.showResults.bind(this)}/>
                        </div>
                    </div>
                </div>
                <hr style={{marginTop: "60px", borderBottom: "0", borderStyle: "solid !important"}}/>
                <div style={{marginTop: "-34px", paddingRight: "5px", paddingLeft: "5px", textAlign: "center"}}>
                    <div style={{display: "inline", background: "white", zIndex: 9999, padding: "16px"}}>
                        <button className="btn btn-success arrow-down" onClick={this.toggleResults.bind(this)}>View all
                        </button>
                    </div>
                </div>
                <div className={this.state.showResults ? "d-block" : "d-none"}>
                    <div className="row mb-5">
                        <div className="col-4">
                            Sort by: <select className="form-control">
                            <option>Date created</option>
                            <option>Date published</option>
                            <option>Name</option>
                            <option>Last viewed</option>
                            <option>Most viewed</option>
                        </select>
                        </div>
                    </div>
                    <div className="col-12">
                        <ul className="list-unstyled ml-4">
                            <li>
                                <a href="/reports/guidance-201710-DALYs/20171124-110346-15208cac/">A report you're
                                    allowed to see</a>
                                <span className="small ml-1 badge-light badge float-right">created: 28th Sep 2017</span>
                                <span className="small badge-primary badge float-right">Published: 12th Oct 2017</span>

                                <p className="small text-muted">20180205-100037-38487ecc</p>
                            </li>
                            <li className="clearfix"><a
                                href="/reports/internal-2017-201708test-1-coverage/20170829-155605-aec5f8fb/">B
                                report you're allowed to see</a>
                                <span className="small ml-1 badge-light badge float-right">created: 28th Sep 2017</span>
                                <p className="small text-muted">20180205-100037-38487ecc</p>
                            </li>
                            <li className="clearfix"><a
                                href="/reports/internal-2017-201708test-2-coverage/20171115-100248-7ad5e28b/">C
                                report you're allowed to see</a>
                                <span className="small ml-1 badge-light badge float-right">created: 28th Sep 2017</span>
                                <span className="small  badge-primary badge float-right">Published: 12th Oct 2017</span>

                                <p className="small text-muted">20180205-100037-38487ecc</p>
                            </li>
                            <li className="clearfix"><a
                                href="/reports/internal-2017-burden-estimates-template/20180117-165238-676f3fb0/">
                                D report you're allowed to see</a>
                                <span className="small ml-1 badge-light badge float-right">created: 28th Sep 2017</span>
                                <p className="small text-muted">20180205-100037-38487ecc</p>
                            </li>
                            <li className="clearfix"><a
                                href="/reports/201710gavi-coverage-estimates/20180205-100037-38487ecc/">Some report
                                you're allowed to see</a>
                                <span className="small ml-1 badge-light badge float-right">created: 28th Sep 2017</span>
                                <p className="small text-muted">20180205-100037-38487ecc</p>
                            </li>
                            <li>
                                <a href="/reports/guidance-201710-DALYs/20171124-110346-15208cac/">A report you're
                                    allowed to see</a>
                                <span className="small ml-1 badge-light badge float-right">created: 28th Sep 2017</span>
                                <span className="small badge-primary badge float-right">Published: 12th Oct 2017</span>
                                <p className="small text-muted">20180205-100037-38487ecc</p>
                            </li>
                            <li className="clearfix"><a
                                href="/reports/internal-2017-201708test-1-coverage/20170829-155605-aec5f8fb/">B
                                report you're allowed to see</a>
                                <span className="small ml-1 badge-light badge float-right">created: 28th Sep 2017</span>
                                <p className="small text-muted">20180205-100037-38487ecc</p>
                            </li>
                            <li className="clearfix"><a
                                href="/reports/internal-2017-201708test-2-coverage/20171115-100248-7ad5e28b/">C
                                report you're allowed to see</a>

                                <span className="small ml-1 badge-light badge float-right">created: 28th Sep 2017</span>
                                <span className="small badge-primary badge float-right">Published: 12th Oct 2017</span>
                                <p className="small text-muted">20180205-100037-38487ecc</p>
                            </li>
                            <li className="clearfix"><a
                                href="/reports/internal-2017-burden-estimates-template/20180117-165238-676f3fb0/">
                                D report you're allowed to see</a>

                                <span className="small ml-1 badge-light badge float-right">created: 28th Sep 2017</span>
                                <span className="small badge-primary badge float-right">Published: 12th Oct 2017</span>
                                <p className="small text-muted">20180205-100037-38487ecc</p>
                            </li>
                            <li className="clearfix"><a
                                href="/reports/201710gavi-coverage-estimates/20180205-100037-38487ecc/">Some report
                                you're allowed to see</a>

                                <span className="small ml-1 badge-light badge float-right">created: 28th Sep 2017</span>
                                <span className="small badge-primary badge float-right">Published: 12th Oct 2017</span>

                                <p className="small text-muted">20180205-100037-38487ecc</p>
                            </li>


                        </ul>
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

                    <div className="col-12 pr-0 mt-3">
                        <h2>Featured report</h2>
                        <div className="border border-dark rounded-0" style={{height: "100%"}}>
                            <div className="mb-3 mr-5 ml-5 mt-3">
                                <h4 className="mb-3">Impact of measles campaigns 2018 - 2020 under low coverage
                                    assumptions</h4>
                                <p className={"text-muted small"}>20180205-100037-38487ecc/</p>

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