import * as React from "react";
import { StyleSheet, Text, View, TextInput, Image, TouchableOpacity, Dimensions, StatusBar, ScrollView } from 'react-native';
import axios from "axios";

import NavBar from "../../components/NavBar/NavBar";
import Router, {RouterProps, MainRouterProps} from "../../components/Router/Router";
import UploadFile from "./_components/UploadFile/UploadFile";

import {ImgurData, ImgurPicture} from "../../utils/Imgur/ImgurInterfaces";

const URL: Array<string> = ["Home", "Upload"];

const statusBarHeight: number = StatusBar.currentHeight == undefined ? 0 : StatusBar.currentHeight;

interface Picture
{
    width: number,
    height: number,
    uri: string,
}

interface IProps extends RouterProps
{
    imgurData: ImgurData;
}

interface IState
{
    uploaded: boolean;
    uploadedPicture: Picture;
    uploadedPictures: Array<ImgurPicture>;
}

class UploadPage extends React.Component<IProps, IState>
{
    constructor(props: IProps)
    {
        super(props);
        this.state = {
            uploaded: false,
            uploadedPictures: [],
            uploadedPicture: {width: 0, height: 0, uri: ""},
        }
    }

    componentDidMount()
    {
        this.didMountAsync();
    }

    didMountAsync = async(): Promise<void> =>
    {
        await this.getUploadedPictures();
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
                this.setState({uploadedPictures: array});
            }
        } catch (error) {
            
        }
    }

    getPictureJSX = (i: number, style: any): JSX.Element =>
    {
        let index: number = i;

        if (this.state.uploadedPictures[index].type == "image/gif") {
            return (
                <Image style={style} source={{uri: "https://i.imgur.com/" + this.state.uploadedPictures[index].id + ".gif"}}/>
            )
        }
        return ( 
            <Image style={style} source={{uri: "https://i.imgur.com/" + this.state.uploadedPictures[index].id + ".jpg"}}/>
        )
    }

    calcNewHeight = (widthPicture: number, heightPicture: number, widthTarget: number): number =>
    {
        let newHeight: number = 0;

        newHeight = (heightPicture * widthTarget) / widthPicture;
    
        return newHeight;
    }

    displayUploadedPictures = (): JSX.Element =>
    {
        let arrayLeftSide: Array<{jsx: JSX.Element, img: ImgurPicture}> = [];
        let arrayRightSide: Array<{jsx: JSX.Element, img: ImgurPicture}> = [];
        let switcher: number = 0;

        this.state.uploadedPictures.forEach((img: ImgurPicture, index: number) => {
            let newHeight: number = this.calcNewHeight(img.width, img.height, (Dimensions.get("window").width - ((Dimensions.get("window").width * 6.66) / 100)) / 2);
            let newStyle: any = {width: "100%", height: newHeight, paddingBottom: 20};

            if (switcher == 0) {
                arrayLeftSide.push({jsx: this.getPictureJSX(index, newStyle), img: img});
                switcher = 1;
            }
            else if (switcher == 1) {
                arrayRightSide.push({jsx: this.getPictureJSX(index, newStyle), img: img});
                switcher = 0;
            }
        });
        return (
            <View style={styles.upload_body_uploadedSection_gallery}>
                <View style={styles.upload_body_uploadedSection_gallery_column}>
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
                <View style={styles.upload_body_uploadedSection_gallery_column}>
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

    displayPicture = (): JSX.Element =>
    {
        if (this.state.uploaded == false) {
            return (
                <View style={{...styles.upload_body_pictureSection_center, height: 200}}>
                    
                </View>
            )
        }
        return (
            <View style={{...styles.upload_body_pictureSection_center}}>
                <Image source={{uri: this.state.uploadedPicture.uri}} style={{width: "100%", height: this.calcNewHeight(this.state.uploadedPicture.width, this.state.uploadedPicture.height, (Dimensions.get("window").width * 60) / 100)}}/>
            </View>
        )
    }

    callBack_setImage = (data: any): void =>
    {
        this.setState(prevState => {
            return {
                uploadedPicture: {
                    width: data.width,
                    uri: data.uri,
                    height: data.height,
                },
                uploaded: true,
            }
        });
    }

    render = (): JSX.Element =>
    {
        return (
            <View style={styles.root}>
                <View style={styles.upload}>
                    <View style={styles.upload_statusBar}/>
                    <View style={styles.upload_body}>
                        <ScrollView>
                            <View style={styles.upload_body_pictureSection}>
                                {this.displayPicture()}
                            </View>
                            <View style={styles.upload_body_uploadSection}>
                                <UploadFile getImageCallBack={this.callBack_setImage} style={{width: 150}} activeOpacity={0.3}>
                                    <View style={styles.upload_body_uploadSection_btn}>
                                        <Text style={styles.upload_body_uploadSection_btn_txt}>
                                            Upload
                                        </Text>
                                    </View>
                                </UploadFile>
                            </View>
                            <View style={styles.upload_body_uploadedSection}>
                                <Text style={styles.upload_body_uploadedSection_title}>
                                    Uploaded Pictures:
                                </Text>
                                {this.displayUploadedPictures()}
                            </View>
                        </ScrollView>
                    </View>
                </View>
                <View style={styles.navBar}>
                    <NavBar
                    onClickSearch={() => this.props.goTo(["Home", "ImgurHome"], {imgurData: this.props.imgurData})}
                    onClickProfile={() => this.props.goTo(["Home", "Profile"], {imgurData: this.props.imgurData})}
                    searchPageSelected={false}
                    uploadPageSelected={true}
                    profilePageSelected={false}
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
    upload: {
        width: "100%",
        height: "100%",
    },
    upload_statusBar: {
        width: "100%",
        height: statusBarHeight,
        backgroundColor: "blue",
    },
    upload_body: {
        width: "100%",
        height: Dimensions.get("window").height - statusBarHeight - 70,
    },
    upload_body_pictureSection: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 30,
    },
    upload_body_pictureSection_center: {
        width: "60%",
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: "black",
        borderRadius: 3,
    },
    upload_body_uploadSection: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        width: "100%",
        marginTop: 30,
    },
    upload_body_uploadSection_btn: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: 50,
        backgroundColor: "blue",
    },
    upload_body_uploadSection_btn_txt: {
        fontFamily: "sans-serif",
        fontSize: 15,
        color: "white",
    },
    upload_body_uploadedSection: {
        width: "100%",
        marginTop: 30,
    },
    upload_body_uploadedSection_title: {
        marginLeft: 20,
        fontFamily: "sans-serif",
        fontSize: 20,
        color: "black",
        fontWeight: "bold",
    },
    upload_body_uploadedSection_gallery: {
        marginTop: 30,
        width: "100%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around",
    },
    upload_body_uploadedSection_gallery_column: {
        width: "45%",
    },
    navBar: {
        width: "100%",
        position: "absolute",
        bottom: 0,
    }
})

const Upload = (props: MainRouterProps): JSX.Element =>
{
    return (
        <Router
            {...props}
            currentUrl={URL}
            currentComponent={UploadPage}
            subpaths={[]}
        />
    )
}

export default Upload;