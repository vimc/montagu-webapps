import { RouteMap, Router } from "simple-react-router";
// Pages
import { ResponsibilityOverviewPage } from "./Responsibilities/Overview/ResponsibilityOverviewPage";
import { ChooseActionPage } from "./ChooseAction/ChooseActionPage";
import { LoadingPage } from "./LoadingPage";
import { DownloadCoveragePage } from "./Responsibilities/Coverage/DownloadCoveragePage";
import { ContribLoginPage } from "./Login/ContribLoginPage";
import { ContribNoRouteFoundPage } from "./ContribNoRouteFoundPage";
import { appSettings } from "../../shared/Settings";
import { ChooseGroupPage } from "./ChooseGroup/ChooseGroupPage";
import { DownloadDemographicsPage } from "./Responsibilities/Demographics/DownloadDemographicsPage";

interface RoutingProperties {
    loggedIn: boolean;
    loaded: boolean;
}

export class ContribRouter extends Router<RoutingProperties> {
    getRoutes(_map: RouteMap, props: RoutingProperties) {
        const { loggedIn, loaded } = props;
        const map: RouteMap = function (urlFragment: string, component: ComponentConstructor<any, any>) {
            _map(appSettings.publicPath + urlFragment, component);
        };

        if (loggedIn) {
            if (loaded) {
                map('/', ChooseGroupPage);
                map('/:groupId/', ChooseActionPage);
                map('/:groupId/responsibilities/:touchstoneId', ResponsibilityOverviewPage);
                map('/:groupId/responsibilities/:touchstoneId/coverage/:scenarioId', DownloadCoveragePage);
                map('/:groupId/responsibilities/:touchstoneId/demographics', DownloadDemographicsPage);
                map('*', ContribNoRouteFoundPage);
            } else {
                map("*", LoadingPage);
            }
        } else {
            map('*', ContribLoginPage);
        }
    }
}