import * as React from "react";
import { connectToStores } from "../../../../shared/alt";
import { AdminPageWithHeader } from "../../AdminPageWithHeader";
import {doNothing, helpers} from "../../../../shared/Helpers";
import {UserTitle, UserTitleProps} from "./UserTitle";
import {UserDetailsContent} from "./UserDetailsContent";
import {userActions} from "../../../actions/UserActions";
import {userStore} from "../../../stores/UserStore";
import {IPageWithParent} from "../../../../shared/models/Breadcrumb";
import {ViewAllUsersPage} from "../List/ViewAllUsersPage";

export interface UserDetailsPageProps {
    username: string;
}

export class ViewUserDetailsPage extends AdminPageWithHeader<UserDetailsPageProps> {
    load() {
        userStore.fetchUsers().catch(doNothing).then(() => {
            userActions.setCurrentUser(helpers.hyphensToDots(this.props.location.params.username));
            super.load();
        });
    }

    name(): string {
        return "User details";
    }

    title(): JSX.Element {
        return <Title />;
    }

    urlFragment(): string {
        const s = userStore.getState();
        return `${s.currentUsername}/`;
    }

    parent(): IPageWithParent {
        return new ViewAllUsersPage();
    }

    renderPageContent(): JSX.Element {
        return <UserDetailsContent />;
    }
}

const Title = connectToStores(class extends UserTitle {
    renderContent(props: UserTitleProps) {
        return <h1>{ props.user.name }</h1>;
    }
});