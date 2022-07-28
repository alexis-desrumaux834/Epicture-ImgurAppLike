import * as React from "react";
import { StyleSheet, Text, View, TextInput, Image, TouchableOpacity, StatusBar, Dimensions, ScrollView } from 'react-native';
import axios from "axios";

import NavBar from "../../components/NavBar/NavBar";
import Router, {RouterProps, MainRouterProps} from "../../components/Router/Router";

import {ImgurData, ImgurPicture} from "../../utils/Imgur/ImgurInterfaces";

const URL: Array<string> = ["Home", "Profile"];

const statusBarHeight: number = StatusBar.currentHeight == undefined ? 0 : StatusBar.currentHeight;

enum Cat
{
    FAVORITES,
    UPLOADED,
}

interface IProps extends RouterProps
{
    imgurData: ImgurData;
}

interface IState
{
    avatarUrl: string;
    selectedCat: Cat;
    favoritesArray: Array<ImgurPicture>;
    uploadedPicturesArray: Array<ImgurPicture>;
}

class ProfilePage extends React.Component<IProps, IState>
{
    constructor(props: IProps)
    {
        super(props);
        this.state = {
            avatarUrl: "",
            selectedCat: Cat.FAVORITES,
            favoritesArray: [],
            uploadedPicturesArray: [],
        }
    }

    componentDidMount()
    {
        this.didMountAsync();
    }

    didMountAsync = async(): Promise<void> =>
    {
        this.getAvatar();
        this.getFavorites();
        this.getUploadedPictures();
    }

    newPicture = (img: any): ImgurPicture =>
    {
        let picture: ImgurPicture = {
            width: 0,
            id: "",
            height: 0,
            type: "",
        };

        picture.id = img.id;
        picture.width = img.width;
        picture.height = img.height;
        picture.type = img.type;
        return picture;
    }

    getUploadedPictures = async(): Promise<void> =>
    {
        let url: string = "https://api.imgur.com/3/account/me/images";
        var config: any = {
          method: 'get',
          url: url,
          headers: { 
            'Authorization': `Bearer ${this.props.imgurData.accessToken}`,
          }
        };
        try {
            let res: any = await axios(config);
            if ("data" in res == true && "success" in res.data == true && res.data.success == true && "data" in res.data == true) {
                let array: Array<ImgurPicture> = [];
                for (let i = 0; i != res.data.data.length; i += 1) {
                    array.push(this.newPicture(res.data.data[i]));
                }
                this.setState({uploadedPicturesArray: array});
            }
        } catch (error) {
            console.log(error);   
        }
    }

    getFavorites = async() =>
    {
        let url: string = "https://api.imgur.com/3/account/" + this.props.imgurData.account_username +"/gallery_favorites/";
        var config: any = {
          method: 'get',
          url: url,
          headers: { 
            'Authorization': `Bearer ${this.props.imgurData.accessToken}`
          }
        };
        try {
            let res: any = await axios(config);
            let array: Array<ImgurPicture> = [];
            for (let i = 0; i != res.data.data.length; i += 1) {
                for (let j = 0; j != res.data.data[i].images.length; j += 1) {
                    let fav: ImgurPicture = {width: 0, height: 0, id: "", type: ""};
                    fav.id = res.data.data[i].images[j].id;
                    fav.width = res.data.data[i].images[j].width;
                    fav.height = res.data.data[i].images[j].height;
                    fav.type = res.data.data[i].images[j].type;
                    array.push(fav);
                }
            }
            this.setState({favoritesArray: array});
        } catch (error) {
            console.log(error);
        }
    }

    getAvatar = async() =>
    {
        let url: string = "https://api.imgur.com/3/account/" + this.props.imgurData.account_username + "/avatar";
        var config: any = {
          method: 'get',
          url: url,
          headers: { 
            'Authorization': `Bearer ${this.props.imgurData.accessToken}`
          }
        };
        try {
            let res: any = await axios(config)
            console.log(res);
            if (res.data.success && res.data.success == true) {
                this.setState({avatarUrl: res.data.data.avatar});
            }
        }
        catch (error) {
            console.log(error);
        }

    }

    getPictureJSX = (img: ImgurPicture, style: any): JSX.Element =>
    {
        if (img.type == "image/gif") {
            return (
                <Image style={style} source={{uri: "https://i.imgur.com/" + img.id + ".gif"}}/>
            )
        }
        return ( 
            <Image style={style} source={{uri: "https://i.imgur.com/" + img.id + ".jpg"}}/>
        )
    }

    calcNewHeight = (widthPicture: number, heightPicture: number, widthTarget: number): number =>
    {
        let newHeight: number = 0;

        newHeight = (heightPicture * widthTarget) / widthPicture;
    
        return newHeight;
    }

    displayColumnPictures = (arr: Array<ImgurPicture>): JSX.Element =>
    {
        let arrayLeftSide: Array<{jsx: JSX.Element, img: ImgurPicture}> = [];
        let arrayRightSide: Array<{jsx: JSX.Element, img: ImgurPicture}> = [];
        let switcher: number = 0;

        arr.forEach((img: ImgurPicture, index: number) => {
            let newHeight: number = this.calcNewHeight(img.width, img.height, (Dimensions.get("window").width - ((Dimensions.get("window").width * 6.66) / 100)) / 2);
            let newStyle: any = {width: "100%", height: newHeight, paddingBottom: 20};

            if (switcher == 0) {
                arrayLeftSide.push({jsx: this.getPictureJSX(arr[index], newStyle), img: img});
                switcher = 1;
            }
            else if (switcher == 1) {
                arrayRightSide.push({jsx: this.getPictureJSX(arr[index], newStyle), img: img});
                switcher = 0;
            }
        });
        return (
            <View style={styles.profile_body_picturesBody_gallery}>
                <View style={styles.profile_body_picturesBody_gallery_column}>
                    {arrayLeftSide.map((element: {jsx: JSX.Element, img: ImgurPicture}, index: number) => {
                        return (
                            <TouchableOpacity
                            key={index}
                            style={{width: "100%", marginTop: 20}}
                            activeOpacity={1}
                            >
                                {element.jsx}
                            </TouchableOpacity>
                        )
                    })}
                </View>
                <View style={styles.profile_body_picturesBody_gallery_column}>
                    {arrayRightSide.map((element: {jsx: JSX.Element, img: ImgurPicture}, index: number) => {
                        return (
                            <TouchableOpacity
                            key={index}
                            style={{width: "100%", marginTop: 20}}
                            activeOpacity={1}
                            >
                                {element.jsx}
                            </TouchableOpacity>
                        )
                    })}
                </View>
            </View>
        )   
    }

    displayUploadedPictures = (): JSX.Element =>
    {
        return (
            <View style={styles.profile_body_picturesBody}>
                <Text style={styles.profile_body_picturesBody_txt}>
                    Uploaded Pictures
                </Text>
                {this.displayColumnPictures(this.state.uploadedPicturesArray)}
            </View>
        )
    }

    displayFavorites = (): JSX.Element =>
    {
        return (
            <View style={styles.profile_body_picturesBody}>
                <Text style={styles.profile_body_picturesBody_txt}>
                    Favorites
                </Text>
                {this.displayColumnPictures(this.state.favoritesArray)}
            </View>
        )
    }

    displayPictures = (): JSX.Element =>
    {
        if (this.state.selectedCat == Cat.FAVORITES)
            return this.displayFavorites();
        else if (this.state.selectedCat == Cat.UPLOADED)
            return this.displayUploadedPictures();
        else
            return <></>
    }

    displayAvatar = (): JSX.Element =>
    {
        if (this.state.avatarUrl !== "") {
            return (
                <Image style={styles.profile_body_infosSection_img} source={{uri: this.state.avatarUrl}}/>
            )
        }
        return (
            <></>
        )
    }

    render = (): JSX.Element =>
    {
        return (
            <View style={styles.root}>
                <View style={styles.profile}>
                    <View style={styles.profile_statusBar}/>
                    <View style={styles.profile_body}>
                        <ScrollView>
                            <View style={styles.profile_body_infosSection}>
                                {this.displayAvatar()}
                                <Text style={styles.profile_body_infosSection_txt}>
                                    {this.props.imgurData.account_username}
                                </Text>
                            </View>
                            <View style={styles.profile_body_btnSection}>
                                <TouchableOpacity style={{width: "30%"}} activeOpacity={0.3} onPress={() => this.setState({selectedCat: Cat.FAVORITES})}>
                                    <View style={{...styles.profile_body_btnSection_btn, backgroundColor: "yellow"}}>
                                        <Text style={{...styles.profile_body_btnSection_btn_txt, color: "black"}}>
                                            Favorites
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity style={{width: "30%"}} activeOpacity={0.3} onPress={() => this.setState({selectedCat: Cat.UPLOADED})}>
                                    <View style={{...styles.profile_body_btnSection_btn, backgroundColor: "blue"}}>
                                        <Text style={{...styles.profile_body_btnSection_btn_txt, color: "white"}}>
                                            Uploaded
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                            {this.displayPictures()}
                        </ScrollView>
                    </View>
                </View>
                <View style={styles.navBar}>
                    <NavBar
                    onClickSearch={() => this.props.goTo(["Home", "ImgurHome"], {imgurData: this.props.imgurData})}
                    onClickUpload={() => this.props.goTo(["Home", "Upload"], {imgurData: this.props.imgurData})}
                    searchPageSelected={false}
                    uploadPageSelected={false}
                    profilePageSelected={true}
                    />
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
    },
    profile: {
        width: "100%",
        height: "100%",
    },
    profile_statusBar: {
        width: "100%",
        height: statusBarHeight,
        backgroundColor: "blue",
    },
    profile_body: {
        width: "100%",
        height: Dimensions.get("window").height - statusBarHeight - 70,
    },
    profile_body_infosSection: {
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: 30,
    },
    profile_body_infosSection_img: {
        width: 100,
        height: 100,
        resizeMode: "contain",
    },
    profile_body_infosSection_txt: {
        marginTop: 20,
        fontFamily: "sans-serif",
        fontSize: 25,
        fontWeight: "bold",
        color: "black",
    },
    profile_body_btnSection: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around",
        width: "100%",
        marginTop: 30,
    },
    profile_body_btnSection_btn: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: 50,
        borderRadius: 15,
    },
    profile_body_btnSection_btn_txt: {
        fontFamily: "sans-serif",
        fontSize: 15,
    },
    profile_body_picturesBody: {
        width: "100%",
        marginTop: 30,
    },
    profile_body_picturesBody_txt: {
        marginLeft: 20,
        fontFamily: "sans-serif",
        fontSize: 20,
        color: "black",
        fontWeight: "bold",
    },
    profile_body_picturesBody_gallery: {
        marginTop: 30,
        width: "100%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around",
    },
    profile_body_picturesBody_gallery_column: {
        width: "45%",
    },
    navBar: {
        width: "100%",
        position: "absolute",
        bottom: 0,
    }
});

const Profile = (props: MainRouterProps): JSX.Element =>
{
    return (
        <Router
            {...props}
            currentComponent={ProfilePage}
            currentUrl={URL}
            subpaths={[]}
        />
    )
}

export default Profile;