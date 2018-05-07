import * as React from "react";

import {PageArticle} from "../../../shared/components/PageWithHeader/PageArticle";
import {PageBreadcrumb, PageProperties} from "../../../shared/components/PageWithHeader/PageWithHeader";
import { ButtonLink } from "../../../shared/components/ButtonLink";
import {compose} from "recompose";
import {BreadcrumbInitializer} from "../../../shared/components/Breadcrumbs/BreadcrumbsInitializer";

const menuStyles = require("./MainMenu.css");

export class MainMenuComponent extends React.Component<PageProperties<undefined>> {

    static title: string = "Main menu";

    static breadcrumb() : PageBreadcrumb {
        return {
            name: MainMenuComponent.title,
            urlFragment: "/",
            parent: null
        }
    }

    render() :JSX.Element {
        return <PageArticle title={MainMenuComponent.title}>
            <div>
                Please select which area of Montagu you would like to manage:
                <ol className={ menuStyles.menu }>
                    <li>
                        <ButtonLink href="/modelling-groups/">Modelling groups</ButtonLink>
                    </li>
                    <li>
                        <ButtonLink href="/touchstones/">Touchstones</ButtonLink>
                    </li>
                    <li>
                        <ButtonLink href="/users/">Users and permissions</ButtonLink>
                    </li>
                </ol>
            </div>
        </PageArticle>;
    }
}

export const MainMenu = compose(BreadcrumbInitializer)(MainMenuComponent) as
    React.ComponentClass<Partial<PageProperties<undefined>>>;
