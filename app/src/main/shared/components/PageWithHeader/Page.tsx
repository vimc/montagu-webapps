import * as React from "react";
import {PageHeader} from "./PageHeader";
import {PageArticle} from "./PageArticle";
import {PageParts} from "../../../shared/components/PageWithHeader/PageWithHeader";
import ButtonDropdown from "reactstrap/lib/ButtonDropdown";
import DropdownToggle from "reactstrap/lib/DropdownToggle";
import DropdownMenu from "reactstrap/lib/DropdownMenu";
import DropdownItem from "reactstrap/lib/DropdownItem";

const Typeahead = require('react-bootstrap-typeahead').Typeahead;

interface PageProps {
    page: PageParts;
}

export class Page extends React.Component<PageProps, undefined> {

    render(): JSX.Element {
        const page = this.props.page;
        return <div>
            <PageHeader siteTitle={page.siteTitle()} header={page.header()} postHeader={page.postHeader()}/>

            <div style={{
                backgroundColor: "#e9ecef",
                padding: "10px",
                borderTop: "1px solid white"
            }}>
                <div className="mr-2 d-inline-block">
                <ButtonDropdown isOpen={false}>
                <DropdownToggle caret color="success">
                    Guidance
                </DropdownToggle>
                    <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                        <a className="dropdown-item" href="#">DALYs Guidance</a>
                        <a className="dropdown-item" href="#">Small countries guidance</a>
                        <a className="dropdown-item" href="#">Coverage guidance</a>
                    </div>
            </ButtonDropdown>
                </div>
                <div className="mr-2 d-inline-block">
                <ButtonDropdown isOpen={false}>
                    <DropdownToggle caret color="success">
                        Modified updates
                    </DropdownToggle>

                </ButtonDropdown>
            </div>
                <div className="float-right">
                <h5 style={{
                    paddingRight: "10px",
                    display: "inline-block"
                }}>Search reports:</h5>
                <Typeahead minLength={2} options={["DALYs Guidance",
                    "coverage data from 201708test-1",
                    "coverage data from 201708test-2",
                    "burden estimate template tables",
                    "Create scenario-specific burden estimate templates",
                    "open call burden estimate templates",
                    "Discussion and methods regarding child mortality rates",
                    "Methods for creating Kosovo demographic data",
                    "Methods for creating Marshsall Islands demographic data"
                ]}/><button className="btn-success btn rounded-0">GO</button>
                    <div><div className="float-right">-- or -- </div><br/><a className="float-right" href="#">View all</a></div>
                </div>

                <div className="clearfix"></div>
            </div>
            {/*<div style={{*/}
                {/*backgroundColor: "#e9ecef",*/}
                {/*padding: "10px",*/}
                {/*borderTop: "1px solid white"*/}
            {/*}}>*/}
               {/**/}
            {/*</div>*/}
            <PageArticle title={page.title()} hideTitle={page.hideTitle()}>
                {this.props.children}
            </PageArticle>
        </div>;
    }
}