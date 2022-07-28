import * as React from "react";
import { StyleSheet, Text, View, TextInput, Image, TouchableOpacity, Dimensions, StatusBar, ScrollView} from 'react-native';
import axios from "axios";

import NavBar from "../../../components/NavBar/NavBar";
import Router, {RouterProps, MainRouterProps} from "../../../components/Router/Router";

import {ImgurData, ImgurGallery, ImgurPicture, ImgurPictureFavorited} from "../../../utils/Imgur/ImgurInterfaces";

const URL: Array<string> = ["Home", "ImgurHome", "Picture"];

const statusBarHeight: number = StatusBar.currentHeight == undefined ? 0 : StatusBar.currentHeight;

enum Vote
{
    UP,
    DOWN,
    VETO,
}

interface IProps extends RouterProps
{
    imgurData: ImgurData;
    gallery: ImgurGallery;
}

interface IState
{
    favorited: boolean,
    accountFavorites: Array<ImgurPictureFavorited>,
    vote: Vote,
}

class PicturePage extends React.Component<IProps, IState>
{
    constructor(props: IProps)
    {
        super(props);
        this.state = {
            favorited: false,
            accountFavorites: [],
            vote: Vote.VETO,
        }
    }

    componentDidMount()
    {
        this.didMountAsync();
    }

    componentDidUpdate(prevProps: IProps, prevState: IState)
    {
        if (this.props.gallery.favorite !== prevProps.gallery.favorite)
            this.setState({favorited: this.props.gallery.favorite});
    }
    
    didMountAsync = async(): Promise<void> =>
    {
        await this.getFavorites();
        this.setState({favorited: this.isPictureFavorited(this.props.gallery.id)});
    }

    isPictureFavorited = (id: string): boolean =>
    {
        let check: boolean = false;
        this.state.accountFavorites.map((element: ImgurPictureFavorited, index: number) => {
            if (element.id == id) {
                check = true;
            }
        });
        return check;
    }

    getFavorites = async(): Promise<void> =>
    {
        let url: string = `https://api.imgur.com/3/account/${this.props.imgurData.account_username}/favorites/`;
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
                let favorited: Array<ImgurPictureFavorited> = [];
                for (let i = 0; i != res.data.data.length; i += 1) {
                    favorited.push({id: res.data.data[i].id, favorite: res.data.data[i].favorite});
                }
                this.setState({accountFavorites: favorited});
            }

        } catch (error) {
            console.log(error);
        }
    }

    favoritePicture = async(): Promise<void> =>
    {
        let url: string = `https://api.imgur.com/3/album/${this.props.gallery.id}/favorite`;
        var config: any = {
          method: 'post',
          url: url,
          headers: { 
            'Authorization': `Bearer ${this.props.imgurData.accessToken}`,
          }
        };
        try {
            let res: any = await axios(config);
            if ("data" in res == true && "success" in res.data == true && res.data.success == true)
                this.setState(prevState => {return {favorited: !prevState.favorited}});
        } catch (error) {
            console.log(error);
        }
    }

    displayOpacityVote = (vote: Vote): number =>
    {
        if (vote == Vote.UP) {
            if (this.state.vote == Vote.UP || this.state.vote == Vote.VETO) {
                return 1;
            } else {
                return 0.3;
            }
        }
        else {
            if (this.state.vote == Vote.DOWN || this.state.vote == Vote.VETO) {
                return 1;
            } else {
                return 0.3;
            }
        }
    }

    sendVote = async(voteKey: string): Promise<void> => {
        let newVote: Vote = Vote.VETO;
        let key: string = "";

        if (voteKey == "up") {
            if (this.state.vote == Vote.VETO || this.state.vote == Vote.DOWN) {
                key = voteKey;
                newVote = Vote.UP;
            } else {
                key = "veto";
                newVote = Vote.VETO;
            }
        } else if (voteKey == "down") {
            if (this.state.vote == Vote.VETO || this.state.vote == Vote.UP) {
                key = voteKey;
                newVote = Vote.DOWN
            } else {
                key = "veto";
                newVote = Vote.VETO;
            }
        }

        let url: string = `https://api.imgur.com/3/gallery/${this.props.gallery.account_id}/vote/${key}`;
        var config: any = {
          method: 'post',
          url: url,
          headers: { 
            'Authorization': `Bearer ${this.props.imgurData.accessToken}`,
          }
        };
        try {
            let res: any = await axios(config);
            if ("data" in res == true && "success" in res.data == true && res.data.success == true)
                this.setState({vote: newVote});
        } catch (error) {
            console.log(error);
        }
    }

    calcNewHeight = (widthPicture: number, heightPicture: number, widthTarget: number): number =>
    {
        let newHeight: number = 0;

        newHeight = (heightPicture * widthTarget) / widthPicture;
    
        return newHeight;
    }

    displayLike = (): JSX.Element =>
    {
        if (this.state.favorited) {
            return (
                <Image style={styles.picture_topNavBar_btn_img} source={require("./_media/like.png")}/>
            )
        } else {
            return (
                <Image style={styles.picture_topNavBar_btn_img} source={require("./_media/like_empty.png")}/>
            )
        }
    }

    getUrlPicture = (img: ImgurPicture): string =>
    {
        if (img.type == "image/gif") {
            return "https://i.imgur.com/" + img.id + ".gif";
        } else
            return "https://i.imgur.com/" + img.id + ".jpg";
    }

    render = (): JSX.Element =>
    {
        return (
            <View style={styles.root}>
                <View style={styles.picture}>
                    <View style={styles.picture_topNavBar}>
                        <View style={styles.picture_topNavBar_center}>
                            <TouchableOpacity onPress={() => this.props.goTo(["Home", "ImgurHome"], {imgurData: this.props.imgurData})} activeOpacity={1}>
                                <Image style={styles.picture_topNavBar_btn_img} source={require("./_media/left-arrow.png")}/>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={this.favoritePicture}>
                                {this.displayLike()}
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.picture_body}>
                        <ScrollView style={styles.picture_body_scroll}>
                            <View style={styles.picture_body_pictureSection}>
                                <Image
                                style={{width: "60%", height: this.calcNewHeight(this.props.gallery.image.width, this.props.gallery.image.height, (Dimensions.get("window").width * 60) / 100)}}
                                source={{uri: this.getUrlPicture(this.props.gallery.image)}}
                                />
                            </View>
                            <View style={styles.picture_body_titleSection}>
                                <View style={styles.picture_body_titleSection_center}>
                                    <Text style={styles.picture_body_titleSection_center_txt}>
                                        {this.props.gallery.title}
                                    </Text>
                                </View>
                            </View>
                            <View style={styles.picture_body_opinionSection}>
                                <View style={styles.picture_body_opinionSection_center}>
                                    <TouchableOpacity onPress={() => this.sendVote("up")} style={{width: "47%"}} activeOpacity={0.8}>
                                        <View style={{...styles.picture_body_opinionSection_center_btn, backgroundColor: "green", opacity: this.displayOpacityVote(Vote.UP)}}>
                                            <Text style={styles.picture_body_opinionSection_center_btn_txt}>+</Text>
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => this.sendVote("down")} style={{width: "47%"}} activeOpacity={0.8}>
                                        <View style={{...styles.picture_body_opinionSection_center_btn, backgroundColor: "red",opacity: this.displayOpacityVote(Vote.DOWN)}}>
                                            <Text style={styles.picture_body_opinionSection_center_btn_txt}>-</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={styles.picture_body_sendSection}>
                                <TouchableOpacity style={{width: "60%"}} activeOpacity={0.8}>
                                    <View style={styles.picture_body_sendSection_btn}>
                                        <Text style={styles.picture_body_sendSection_btn_txt}>Send</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                </View>
                <View style={styles.navBar}>
                    <NavBar
                    searchPageSelected={true}
                    uploadPageSelected={false}
                    profilePageSelected={false}
                    onClickSearch={() => this.props.goTo(["Home", "ImgurHome"], {imgurData: this.props.imgurData})}
                    onClickUpload={() => this.props.goTo(["Home", "Upload"], {imgurData: this.props.imgurData})}
                    onClickProfile={() => this.props.goTo(["Home", "Profile"], {imgurData: this.props.imgurData})}
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
    picture: {
        width: "100%",
        height: "100%",
    },
    picture_body: {
        width: "100%",
        height: Dimensions.get("window").height - (70 + statusBarHeight) - 70,
    },
    picture_body_scroll: {
        width: "100%",
    },
    picture_body_pictureSection: {
        width: "100%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 30,
    },
    picture_body_titleSection: {
        width: "100%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 30,
    },
    picture_body_titleSection_center: {
        width: "70%",
    },
    picture_body_titleSection_center_txt: {
        color: "black",
        fontSize: 15,
        fontFamily: "sans-serif",
        fontWeight: "400",
    },
    picture_body_opinionSection: {
        width: "100%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 30,
    },
    picture_body_opinionSection_center: {
        width: "60%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
    },
    picture_body_opinionSection_center_btn: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: 30,
    },
    picture_body_opinionSection_center_btn_txt: {
        color: "white",
        fontFamily: "sans-serif",
        fontSize: 25,
    },
    picture_body_sendSection: {
        width: "100%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 20,
    },
    picture_body_sendSection_btn: {
        width: "100%",
        height: 40,
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "blue",
    },
    picture_body_sendSection_btn_txt: {
        fontFamily: "sans-serif",
        fontSize: 15,
        color: "white",
    },
    picture_topNavBar: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: 70 + statusBarHeight,
        backgroundColor: "blue",
        paddingTop: statusBarHeight,
    },
    picture_topNavBar_center: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "80%",
        height: 70,
    },
    picture_topNavBar_btn_img: {
        width: 40,
        height: 40,
    },
    navBar: {
        width: "100%",
        position: "absolute",
        bottom: 0,
    },
});

const Picture = (props: MainRouterProps) =>
{
    return (
        <Router
            {...props}
            currentComponent={PicturePage}
            currentUrl={URL}
            subpaths={[]}
        />
    )
}

export default Picture;

