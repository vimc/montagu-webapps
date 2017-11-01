import {ChooseGroupPage} from "../../../main/contrib/components/ChooseGroup/ChooseGroupPage";
import {ChooseActionPage} from "../../../main/contrib/components/ChooseAction/ChooseActionPage";
import {NavigationTests, PageNavigationExpectation} from "../../shared/components/NavigationTests";
import {ContribForgottenPasswordPage} from "../../../main/contrib/components/ContribForgottenPasswordPage";
import {ContribNoRouteFoundPage} from "../../../main/contrib/components/ContribNoRouteFoundPage";
import {LoadingPage} from "../../../main/contrib/components/LoadingPage";
import {TouchstoneHelp} from "../../../main/contrib/components/TouchstoneHelp";
import {ContribLoginPage} from "../../../main/contrib/components/Login/ContribLoginPage";
import {UploadBurdenEstimatesPage} from "../../../main/contrib/components/Responsibilities/BurdenEstimates/UploadBurdenEstimatesPage";
import {DownloadCoveragePage} from "../../../main/contrib/components/Responsibilities/Coverage/DownloadCoveragePage";
import {DownloadDemographicsPage} from "../../../main/contrib/components/Responsibilities/Demographics/DownloadDemographicsPage";
import {ResponsibilityOverviewPage} from "../../../main/contrib/components/Responsibilities/Overview/ResponsibilityOverviewPage";
import {mockLocation} from "../../mocks/mocks";

class ContribNavigationTests extends NavigationTests {
    pages(): PageNavigationExpectation[] {
        return [
            {page: new ChooseActionPage()},
            {page: new ChooseGroupPage()},
            {page: new ContribForgottenPasswordPage()},
            {page: new ContribLoginPage(), affectsBreadcrumbs: false},
            {page: new ContribNoRouteFoundPage(), urlCanBeNull: true},
            {
                page: new DownloadCoveragePage({
                    location: mockLocation({
                        groupId: "gId",
                        touchstoneId: "tId",
                        scenarioId: "sId"
                    })
                })
            },
            {
                page: new DownloadDemographicsPage({
                    location: mockLocation({
                        groupId: "gId",
                        touchstoneId: "tId"
                    })
                })
            },
            {page: new LoadingPage(), affectsBreadcrumbs: false},
            {
                page: new ResponsibilityOverviewPage({
                    location: mockLocation({
                        groupId: "gId",
                        touchstoneId: "tId"
                    })
                })
            },
            {page: new TouchstoneHelp()},
            {
                page: new UploadBurdenEstimatesPage({
                    location: mockLocation({
                        groupId: "gId",
                        touchstoneId: "tId",
                        scenarioId: "sId"
                    })
                })
            }
        ];
    }
}

describe("Contrib navigation", () => {
    new ContribNavigationTests().addTestsToMocha();
});