import * as React from "react";
import { StyleSheet, Text, View, TextInput, Image, TouchableOpacity } from 'react-native';

import Router, {RouterProps, MainRouterProps} from "../components/Router/Router";
import WebView from "react-native-webview";

import {ImgurData} from "../utils/Imgur/ImgurInterfaces";

import ImgurHome from "./ImgurHome/ImgurHome";
import Upload from "./Upload/Upload";
import Profile from "./Profile/Profile";

const URL: Array<string> = ["Home"];

interface IProps extends RouterProps
{
}

interface IState
{
    showWebView: boolean;
}

class HomePage extends React.Component<IProps, IState>
{
    constructor(props: IProps)
    {
        super(props);
        this.state = {
            showWebView: false,
        };
    }

    toogleShowWebViewBtn = (): void =>
    {
        this.setState(prevState => {
            return {
                showWebView: true,
            }
        });
    }

    getValue = (searchStr: string, str: string): string =>
    {
        let i: number = 0;
        let keyStr: string = "";
        let value: string = "";
        let nextKeyIndex: number = 0;

        for (i = 0; i != str.length && str.substr(i, searchStr.length) != searchStr; i += 1);
        if (i == str.length)
            return "";
        nextKeyIndex = str.indexOf('&', i);
        if (nextKeyIndex == -1)
            nextKeyIndex = str.length;
        keyStr = str.substring(i, nextKeyIndex);
        i = keyStr.indexOf('=') + 1;
        value = keyStr.substring(i);
        return value;
    }

    onNavigationStateChange = (webViewState: any): void =>
    {
        let accessToken: string = this.getValue("access_token=", webViewState.url);
        if (accessToken == "")
            return;
        let refreshToken: string = this.getValue("refresh_token=", webViewState.url);
        let expires: string = this.getValue("expires_in=", webViewState.url);
        let account_id: string = this.getValue("account_id=", webViewState.url);
        let account_username: string = this.getValue("account_username=", webViewState.url);

        let imgurData: ImgurData = {
            accessToken: accessToken,
            refreshToken: refreshToken,
            expire: expires,
            state: "",
            account_id: account_id,
            account_username: account_username,
        };
        console.log(imgurData);
        this.setState({showWebView: false});
        this.props.goTo(["Home", "ImgurHome"], {imgurData: imgurData});
    }

    displayWebView = (): JSX.Element =>
    {
        return (
            <WebView
                source={{uri: "https://api.imgur.com/oauth2/authorize?client_id=b9927e520e0e732&response_type=token&state=accepted"}}
                onNavigationStateChange={this.onNavigationStateChange}
                javaScriptEnabled = {true}
                domStorageEnabled = {true}
            />
        )
    }

    displayLogin = (): JSX.Element =>
    {
        if (this.state.showWebView)
            return this.displayWebView();
        return (
            <View style={styles.root}>
                <TouchableOpacity activeOpacity={0.7} onPress={() => this.toogleShowWebViewBtn()}>
                    <View style={styles.login_btn}>
                        <Text style={styles.login_btn_txt}>
                            Se connecter
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

    render = (): JSX.Element =>
    {
        return this.displayLogin();
    }
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
    },
    login_btn: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "blue",
        padding: 10,
    },
    login_btn_txt: {
        color: "white",
    }
});


const Home = (props: MainRouterProps): JSX.Element =>
{
    return (
        <Router
            {...props}
            currentUrl={URL}
            currentComponent={HomePage}
            subpaths={[
                {path: "ImgurHome", Component: ImgurHome},
                {path: "Upload", Component: Upload},
                {path: "Profile", Component: Profile}]
            }
        />
    )
}

export default Home;