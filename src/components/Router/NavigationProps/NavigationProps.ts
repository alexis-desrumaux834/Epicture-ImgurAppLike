import { ClassType } from "react";

export interface SubPath
{
    path: string,
    Component(props: MainRouterProps): JSX.Element,
}

export interface MainRouterProps
{
    goToUrl: Array<string>,
    props?: any,
    goTo?(url: Array<string>, props: any): void,
}

export interface NavigationProps
{
    goToUrl: Array<string>,
    currentUrl: Array<string>,
    currentComponent: { new(...args: any[]): any; },
    props?: any,
    subpaths: Array<SubPath>,
    goTo?(url: Array<string>, props: any): void,
}

export interface RouterProps
{
    goTo(url: Array<string>, props: any): void,
}