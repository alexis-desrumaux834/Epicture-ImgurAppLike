import * as React from "react";

import {NavigationProps, RouterProps, SubPath, MainRouterProps} from "./NavigationProps/NavigationProps";

interface IRouterProps extends NavigationProps
{
}

interface IRouterState
{
    Component: JSX.Element,
}

class Router extends React.Component<IRouterProps, IRouterState>
{
    constructor(props: IRouterProps)
    {
        super(props);
        this.state = {
            Component: <></>,
        };
    }
    
    componentDidMount()
    {
        const Component: JSX.Element = this.getPage(this.props.goToUrl, this.props.props);

        this.setState({
            Component: Component,
        });
    }

    getNextPage = (nextUrl: Array<string>, props: any): JSX.Element =>
    {
        let Component: JSX.Element = <></>
        let path: string = nextUrl[this.props.currentUrl.length];

        this.props.subpaths.forEach((subpath: SubPath, index: number) => {
            if (path == subpath.path) {
                Component = <subpath.Component goToUrl={nextUrl} goTo={this.goTo} props={props}/>;
                return;
            }
        });
        return (Component)
    }

    getPage = (nextUrl: Array<string>, props: any): JSX.Element =>
    {
        let check: number = 0;
        
        if (nextUrl.length >= this.props.currentUrl.length) {
            this.props.currentUrl.forEach((path: string, index: number) => {
                if (path == nextUrl[index])
                    check += 1;
            });
        }

        if (check == this.props.currentUrl.length) {
            if (this.props.currentUrl.length == nextUrl.length) {
                let Component: any = this.props.currentComponent;
                return (
                    <Component {...this.props.props} goTo={this.goTo}/>
                )
            } else {
                return (this.getNextPage(nextUrl, props));
            }
        }
        if (this.props.goTo !== undefined)
            this.props.goTo(nextUrl, props);
        return <></>;
    }

    goTo = (url: Array<string>, props: any): void =>
    {
        const Component: JSX.Element = this.getPage(url, props);

        this.setState({
            Component: Component,
        });
    }

    render = (): JSX.Element =>
    {
        return this.state.Component;
    }
}



export {RouterProps, MainRouterProps}
export default Router;