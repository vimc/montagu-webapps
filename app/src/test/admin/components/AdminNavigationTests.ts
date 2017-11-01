import {NavigationTests, PageNavigationExpectation} from "../../shared/components/NavigationTests";
import {AdminForgottenPasswordPage} from "../../../main/admin/components/AdminForgottenPasswordPage";
import {AdminLoginPage} from "../../../main/admin/components/AdminLoginPage";
import {AdminNoRouteFoundPage} from "../../../main/admin/components/AdminNoRouteFoundPage";
import {MainMenu} from "../../../main/admin/components/MainMenu/MainMenu";
import {ViewAllModellingGroupsPage} from "../../../main/admin/components/ModellingGroups/List/ViewAllModellingGroupsPage";
import {GroupAdminPage} from "../../../main/admin/components/ModellingGroups/SingleGroup/Admin/GroupAdminPage";
import {ViewModellingGroupDetailsPage} from "../../../main/admin/components/ModellingGroups/SingleGroup/Details/ViewModellingGroupDetailsPage";
import {ResetPasswordPage} from "../../../main/admin/components/Users/Account/ResetPasswordPage";
import {ViewAllUsersPage} from "../../../main/admin/components/Users/List/ViewAllUsersPage";
import {ViewUserDetailsPage} from "../../../main/admin/components/Users/SingleUser/ViewUserDetailsPage";

class AdminNavigationTests extends NavigationTests {
    pages(): PageNavigationExpectation[] {
        return [
            {page: new AdminForgottenPasswordPage()},
            {page: new AdminLoginPage(), affectsBreadcrumbs: false},
            {page: new AdminNoRouteFoundPage(), urlShouldBeNull: true},
            {page: new GroupAdminPage()},
            {page: new MainMenu()},
            {page: new ResetPasswordPage()},
            {page: new ViewAllModellingGroupsPage()},
            {page: new ViewAllUsersPage()},
            {page: new ViewModellingGroupDetailsPage()},
            {page: new ViewUserDetailsPage()}
        ];
    }
}

describe("Admin navigation", () => {
    new AdminNavigationTests().addTestsToMocha();
});