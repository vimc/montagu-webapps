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
        return <Page page={this}>
            <div>
                <h4>Find a report:</h4>
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
            <div className="container">

                <div className="row">


                    <div className="col-12 col-lg-6">
                        <div className="mb-3 mr-5 ml-5 mt-3">
                        <h4 className="mb-3">Modified update 2017 of future impact with impact metrics v12 (2015)</h4>
                        <img src={testimage} className="img-fluid"/>
                        </div>
                    </div>


                    <div className="col-12 col-sm-6 col-lg-4 mt-3">
                        <div className="">
                            <div className="card-body">
                            <h5 className="card-title">Categories</h5>
                                <Card>
                                    <div className="card-header arrow-up">Guidance</div>
                                    <Collapse isOpen={true}>
                                            <div className="card-body p-1">
                                                <ul className="list-unstyled">
                                                    <li className=" "><a href="#">DALYs Guidance</a></li>
                                                    <li className=" "><a href="#">Small countries guidance</a></li>
                                                    <li className=" "><a href="#">Coverage guidance</a></li>
                                                </ul>
                                            </div>
                                    </Collapse>
                                </Card>
                                <Card>
                                <div className="card-header arrow-down">Modified update</div>
                                <Collapse isOpen={false}>
                                </Collapse>
                                </Card>
                                <Card>
                                    <div className="card-header arrow-down">Some other category</div>
                                    <Collapse isOpen={false}>
                                    </Collapse>
                                </Card>
                            </div>
                        </div>
                    </div>

                    <div className="col-12 col-sm-6 col-lg-4 mt-3 circle">
                        <div className="card-body">
                                <h5 className="card-title">Recently viewed</h5>
                                <h6 className="card-subtitle mb-2 text-muted">Your last visited reports</h6>
                            <div className="">
                                <ul className="list-unstyled">
                                    <li className=" "><a href="#">DALYs Guidance</a></li>
                                    <li className=" "><a href="#">open call burden estimate templates</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="col-12 col-sm-6 col-lg-4 mt-3 rounded-circle">
                        <div className="card-body">
                            <h5 className="card-title">Popular</h5>
                            <h6 className="card-subtitle mb-2 text-muted">The most visited reports</h6>
                            <div className="">
                            <ul className="list-group list-group-flush">
                                <li className="list-group-item"><a href="#">burden estimate template tables</a></li>
                                <li className=" "><a href="#">open call burden estimate templates</a></li>
                                <li className=" "><a href="#">Methods for creating Kosovo demographic data</a></li>
                                <li className=" "><a href="#">coverage data from 201708test-2</a></li>
                            </ul>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            <div className="mb-5"></div>
        </Page>;
    }
}