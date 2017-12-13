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
import { ContribForgottenPasswordPage } from "./ContribForgottenPasswordPage";
import { TouchstoneHelp } from "./TouchstoneHelp";
import { UploadBurdenEstimatesPage } from "./Responsibilities/BurdenEstimates/UploadBurdenEstimatesPage";
import { ResponsibilityGuidanceModelInputs } from "./Responsibilities/Guidance/ResponsibilityGuidanceModelInputs";
import { ResponsibilityGuidanceModelOutputs } from "./Responsibilities/Guidance/ResponsibilityGuidanceModelOutputs";
import { ResponsibilityGuidanceNeonatalMortality } from "./Responsibilities/Guidance/Demographics/ResponsibilityGuidanceNeonatalMortality";
import { ResponsibilityGuidanceMarshallIslands } from "./Responsibilities/Guidance/Demographics/ResponsibilityGuidanceMarshallIslands";
import { ResponsibilityGuidanceOver80 } from "./Responsibilities/Guidance/Demographics/ResponsibilityGuidanceOver80";
import { ResponsibilityGuidanceKosovo } from "./Responsibilities/Guidance/Demographics/ResponsibilityGuidanceKosovo";
import { ResponsibilityGuidanceTuvalu } from "./Responsibilities/Guidance/Demographics/ResponsibilityGuidanceTuvalu";
import {ModelRunParametersPage} from "./Responsibilities/ModelRunParameters/ModelRunParametersPage";

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

        map('/forgotten-password/', ContribForgottenPasswordPage);

        if (loggedIn) {
            if (loaded) {
                map('/', ChooseGroupPage);
                map('/:groupId/', ChooseActionPage);
                map('/:groupId/responsibilities/:touchstoneId', ResponsibilityOverviewPage);
                map('/:groupId/responsibilities/:touchstoneId/coverage/:scenarioId', DownloadCoveragePage);
                map('/:groupId/responsibilities/:touchstoneId/burdens/:scenarioId', UploadBurdenEstimatesPage);
                map('/:groupId/responsibilities/:touchstoneId/demographics', DownloadDemographicsPage);
                map('/:groupId/responsibilities/:touchstoneId/model-run-parameters', ModelRunParametersPage);
                map('/help/touchstones/', TouchstoneHelp);
                map('/help/model-inputs/', ResponsibilityGuidanceModelInputs);
                map('/help/model-outputs/', ResponsibilityGuidanceModelOutputs);
                map('/help/neonatal-mortality/', ResponsibilityGuidanceNeonatalMortality);
                map('/help/marshall-islands/', ResponsibilityGuidanceMarshallIslands);
                map('/help/over80/', ResponsibilityGuidanceOver80);
                map('/help/kosovo/', ResponsibilityGuidanceKosovo);
                map('/help/tuvalu/', ResponsibilityGuidanceTuvalu);
                map('*', ContribNoRouteFoundPage);
            } else {
                map("*", LoadingPage);
            }
        } else {
            map('*', ContribLoginPage);
        }
    }
}