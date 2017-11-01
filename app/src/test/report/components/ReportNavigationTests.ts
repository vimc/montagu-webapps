import {NavigationTests, PageNavigationExpectation} from "../../shared/components/NavigationTests";
import {ReportingForgottenPasswordPage} from "../../../main/report/components/ReportingForgottenPasswordPage";
import {ReportingLoginPage} from "../../../main/report/components/ReportingLoginPage";
import {ReportingNoRouteFoundPage} from "../../../main/report/components/ReportingNoRouteFoundPage";
import {MainMenu} from "../../../main/report/components/MainMenu/MainMenu";
import {VersionInfoPage} from "../../../main/report/components/Versions/VersionInfoPage";
import {ViewVersionsPage} from "../../../main/report/components/Versions/ViewVersionsPage";
import {mockLocation} from "../../mocks/mocks";

class ReportNavigationTests extends NavigationTests {
    pages(): PageNavigationExpectation[] {
        return [
            {page: new ReportingForgottenPasswordPage()},
            {page: new ReportingLoginPage(), affectsBreadcrumbs: false},
            {page: new ReportingNoRouteFoundPage(), urlShouldBeNull: true},
            {page: new MainMenu()},
            {
                page: new VersionInfoPage({
                    location: mockLocation({
                        report: "some report",
                        version: "some version"
                    })
                })
            },
            {
                page: new ViewVersionsPage({
                    location: mockLocation({
                        name: "some report"
                    })
                })
            },
        ];
    }
}

describe("Report navigation", () => {
    new ReportNavigationTests().addTestsToMocha();
});