import {Breadcrumb} from "../models/Breadcrumb";
import {clone} from "lodash";
import {PageBreadcrumb} from "../components/PageWithHeader/PageProperties";

export const breadcrumbsModule = {

    getParentsInOrderFromTopToBottom(pageBreadcrumb: PageBreadcrumb): PageBreadcrumb[] {
        let parents: PageBreadcrumb[] = [];
        let currentBreadcrumb = clone(pageBreadcrumb);
        while (currentBreadcrumb != null) {
            parents.unshift(currentBreadcrumb); // adds at the beginning
            currentBreadcrumb = currentBreadcrumb.parent ? currentBreadcrumb.parent : null;
        }
        return parents;
    },

    initialize(pageBreadcrumb: PageBreadcrumb): Breadcrumb[] {
        if (pageBreadcrumb != null) {
            const parents = this.getParentsInOrderFromTopToBottom(pageBreadcrumb);
            return parents.map((p: PageBreadcrumb) => ({
                url: this.url(p),
                name: p.name
            }));
        } else {
            return [];
        }
    },

    url(pageBreadcrumb: PageBreadcrumb): string {
        let url = pageBreadcrumb.urlFragment;
        if (!url) {
            return undefined;
        }
        let p = pageBreadcrumb.parent ? pageBreadcrumb.parent : null;
        while (p != null) {
            const fragment = p.urlFragment;
            if (fragment === undefined) {
                return undefined;
            }
            url = fragment + url;
            p = p.parent ? p.parent : null;
        }
        return url;
    }
};