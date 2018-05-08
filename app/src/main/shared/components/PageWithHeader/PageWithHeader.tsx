import * as React from "react";
import {History, Location} from "history";
import {Router, match} from 'react-router';

export interface PageParts {
    siteTitle(): string;
    title(): JSX.Element;
    hideTitle(): boolean;
    children?: JSX.Element;
}

export interface PageBreadcrumb {
    name: string;
    urlFragment: string;
    parent: PageBreadcrumb;
}

export interface PageProperties<T, Q={}> {
    location: Location;
    router: Router;
    match: match<T>;
    history: History;
    createBreadcrumbs?: (pageBreadcrumb: PageBreadcrumb) => void;
    onLoad?: (props?: T, query?: Q) => void;
}