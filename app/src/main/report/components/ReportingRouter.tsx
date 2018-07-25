import * as React from "react";
import { Route, Switch, Redirect } from 'react-router-dom';
import { ConnectedRouter } from 'react-router-redux';
import {History} from "history";

// Pages
import {ReportsListPage} from "./ReportsList/ReportsListPage";
import {ReportingNoRouteFoundPage} from "./ReportingNoRouteFoundPage";
import {ReportingLoginPage} from "./ReportingLoginPage";
import {ReportPage} from "./Reports/ReportPage";
import {ReportingForgottenPasswordPage} from "./ReportingForgottenPasswordPage";
import {ReportingPageHeader} from "./ReportingPageHeader";

interface ReportRouterProps {
    loggedIn: boolean;
    history: History;
}

export const ReportingRouter : React.StatelessComponent<ReportRouterProps> = (props: ReportRouterProps) => {

    const loggedIn = <Switch>
        <Route exact path="/" component={ReportsListPage}/>
        <Route exact path="/:report/:version/" component={ReportPage} />
        <Route component={ReportingNoRouteFoundPage} />
    </Switch>;

    const notLoggedIn = <Switch>
        <Route exact path="/forgotten-password/" component={ReportingForgottenPasswordPage} />
        <Route component={ReportingLoginPage}/>
    </Switch>;

    const routes = props.loggedIn ?  loggedIn : notLoggedIn;

    return <ConnectedRouter history={props.history}>
        <div>
            <ReportingPageHeader/>
            {routes}
        </div>
    </ConnectedRouter>;
}
