import * as React from "react";
import { StyleSheet, Text, View, TextInput, Image, TouchableOpacity, Dimensions, StatusBar, ScrollView } from 'react-native';
import axios from "axios";

import SearchBar from "./_components/SearchBar/SearchBar";
import NavBar from "../../components/NavBar/NavBar";
import Router, {RouterProps, MainRouterProps} from "../../components/Router/Router";

import {ImgurData, ImgurPicture, ImgurGallery} from "../../utils/Imgur/ImgurInterfaces";

import Picture from "./Picture/Picture";

const URL: Array<string> = ["Home", "ImgurHome"];

const statusBarHeight: number = StatusBar.currentHeight == undefined ? 0 : StatusBar.currentHeight;


interface IProps extends RouterProps
{
    imgurData: ImgurData;
}

interface IState
{
    searchInputValue: string;
    galleryArray: Array<ImgurGallery>;
    mounted: boolean;
}

class ImgurHomePage extends React.Component<IProps, IState>
{
    constructor(props: IProps)
    {
        super(props);
        this.state = {
            searchInputValue: "",
            galleryArray: [],
            mounted: false,
        }
    }

    componentDidMount()
    {
        this.getMainGalllery();
    }

    getPictureJSX = (i: number, style: any): JSX.Element =>
    {
        let index: number = i;

        if (this.state.galleryArray[index].image.type == "image/gif") {
            return (
                <Image style={style} source={{uri: "https://i.imgur.com/" + this.state.galleryArray[index].image.id + ".gif"}}/>
            )
        }
        return ( 
            <Image style={style} source={{uri: "https://i.imgur.com/" + this.state.galleryArray[index].image.id + ".jpg"}}/>
        )
    }

    newGalleryNoImages = (data: any): ImgurGallery =>
    {
        let gallery: ImgurGallery = {
            account_id: 0,
            comment_count: 0,
            datetime: 0,
            downs: 0,
            favorite: false,
            id: "",
            title: "",
            ups: 0,
            views: 0,
            image: {
                width: 0,
                height: 0,
                id: "",
                type: "",
            }
        };

        gallery.account_id = data.id,
        gallery.comment_count = data.comment_count,
        gallery.datetime = data.datetime,
        gallery.downs = data.downs,
        gallery.favorite = data.favorite,
        gallery.id = data.id,
        gallery.image = {
            width: data.width,
            id: data.id,
            height: data.height,
            type: data.type,
        }
        gallery.title = data.title,
        gallery.ups = data.ups,
        gallery.views = data.views
        return gallery;      
    }

    newGallery = (data: any): ImgurGallery =>
    {
        let gallery: ImgurGallery = {
            account_id: 0,
            comment_count: 0,
            datetime: 0,
            downs: 0,
            favorite: false,
            id: "",
            title: "",
            ups: 0,
            views: 0,
            image: {
                width: 0,
                height: 0,
                id: "",
                type: "",
            }
        };

        gallery.account_id = data.id,
        gallery.comment_count = data.comment_count,
        gallery.datetime = data.datetime,
        gallery.downs = data.downs,
        gallery.favorite = data.favorite,
        gallery.id = data.id,
        gallery.image = {
            width: data.images[0].width,
            id: data.images[0].id,
            height: data.images[0].height,
            type: data.images[0].type,
        }
        gallery.title = data.title,
        gallery.ups = data.ups,
        gallery.views = data.views
        return gallery;
    }

    getMainGalllery = async() =>
    {
        let url: string = "https://api.imgur.com/3/gallery/hot/viral/0.json";
        var config: any = {
          method: 'get',
          url: url,
          headers: { 
            'Authorization': `Client-ID ${this.props.imgurData.account_id}`,
          }
        };
        try {
            let res: any = await axios(config)
            if (res.data.success && res.data.success == true) {
                let galleryArray: Array<ImgurGallery> = [...this.state.galleryArray];
                for (let i = 0; i != res.data.data.length; i += 1) {
                    if (res.data.data[i].images !== undefined) {
                        galleryArray.push(this.newGallery(res.data.data[i]));
                    }
                    else {
                        galleryArray.push(this.newGalleryNoImages(res.data.data[i]));
                    }
                }
                this.setState({galleryArray: galleryArray, mounted: true});
            }
        }
        catch (error) {
            console.log(error);
        }
    }

    formatInputValue = (value: string): string =>
    {
        let formatValue: string = value.replace(/\s+/g, ' ').trim();
        let newValue: string = "";

        for (let i = 0; i != formatValue.length; i += 1) {
            if (formatValue[i] == ' ')
                newValue += '+';
            else
                newValue += formatValue[i];
        }
        return newValue;

    }

    getSearchByQGallery = async(): Promise<void> =>
    {
        let searchValue: string = this.formatInputValue(this.state.searchInputValue);
        let url: string = `https://api.imgur.com/3/gallery/search/viral/all/0?q=${searchValue}`;
        var config: any = {
          method: 'get',
          url: url,
          headers: { 
            'Authorization': `Client-ID ${this.props.imgurData.account_id}`,
          }
        };
        try {
            let res: any = await axios(config);
            if (res.data.success && res.data.success == true) {
                let galleryArray: Array<ImgurGallery> = [];
                for (let i = 0; i != res.data.data.length; i += 1) {
                    if (res.data.data[i].images !== undefined) {
                        galleryArray.push(this.newGallery(res.data.data[i]));
                    }
                    else {
                        galleryArray.push(this.newGalleryNoImages(res.data.data[i]));
                    }
                }
                this.setState({galleryArray: galleryArray, mounted: true});
            }
        } catch (error) {
            console.log(error);
        }
    }

    handleSearchBarInput = (text: string): void =>
    {
        this.setState({searchInputValue: text});
    }

    calcNewHeight = (width: number, height: number): number =>
    {
        let columnWidth: number = 0;
        let newHeight: number = 0;

        columnWidth = (Dimensions.get("window").width - ((Dimensions.get("window").width * 6.66) / 100)) / 2;
        newHeight = (height * columnWidth) / width;
    
        return newHeight;
    }

    getArraySideJSXElement = (array: Array<{jsx: JSX.Element, gallery: ImgurGallery}>, index: number): JSX.Element =>
    {
        return array[index].jsx;
    }

    manageSideBlock = (): JSX.Element =>
    {
        let arrayLeftSide: Array<{jsx: JSX.Element, gallery: ImgurGallery}> = [];
        let arrayRightSide: Array<{jsx: JSX.Element, gallery: ImgurGallery}> = [];
        let switcher: number = 0;

        this.state.galleryArray.forEach((gallery: ImgurGallery, index: number) => {
            let newHeight: number = this.calcNewHeight(gallery.image.width, gallery.image.height);
            let newStyle: any = {width: "100%", height: newHeight, paddingBottom: 20};

            if (switcher == 0) {
                arrayLeftSide.push({jsx: this.getPictureJSX(index, newStyle), gallery: gallery});
                switcher = 1;
            }
            else if (switcher == 1) {
                arrayRightSide.push({jsx: this.getPictureJSX(index, newStyle), gallery: gallery});
                switcher = 0;
            }
        });
        return (
            <View style={styles.imgurHome_picturesBlock}>
                <View style={styles.imgurHome_picturesBlock_leftSideBlock}>
                    {arrayLeftSide.map((element: {jsx: JSX.Element, gallery: ImgurGallery}, index: number) => {
                        return (
                            <TouchableOpacity
                            onPress={() => this.props.goTo([...URL, "Picture"], {imgurData: this.props.imgurData, gallery: element.gallery})}
                            key={index}
                            style={{width: "100%", marginTop: 20}}
                            activeOpacity={1}
                            >
                                {this.getArraySideJSXElement(arrayLeftSide, index)}
                            </TouchableOpacity>
                        )
                    })}
                </View>
                <View style={styles.imgurHome_picturesBlock_rightSideBlock}>
                    {arrayRightSide.map((element: {jsx: JSX.Element, gallery: ImgurGallery}, index: number) => {
                        return (
                            <TouchableOpacity
                            onPress={() => this.props.goTo([...URL, "Picture"], {imgurData: this.props.imgurData, gallery: element.gallery})}
                            key={index}
                            style={{width: "100%", marginTop: 20}}
                            activeOpacity={1}
                            >
                                {this.getArraySideJSXElement(arrayRightSide, index)}
                            </TouchableOpacity>
                        )
                    })}
                </View>
            </View>
        )
    }

    displayPictures = (): JSX.Element =>
    {
        if (!this.state.mounted)
            return <></>
        return (
            <ScrollView style={styles.imgurHome_scrollView}>
                {this.manageSideBlock()}
            </ScrollView>
        )
    }

    render = (): JSX.Element =>
    {
        return (
            <View style={styles.root}>
                <View style={styles.imgurHome}>
                    <SearchBar onChangeText={this.handleSearchBarInput} onSubmitEditing={() => this.getSearchByQGallery()}/>
                    {this.displayPictures()}
                </View>
                <View style={styles.navBar}>
                    <NavBar
                    onClickUpload={() => this.props.goTo(["Home", "Upload"], {imgurData: this.props.imgurData})}
                    onClickProfile={() => this.props.goTo(["Home", "Profile"], {imgurData: this.props.imgurData})}
                    searchPageSelected={true}
                    uploadPageSelected={false}
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
    imgurHome: {
        width: "100%",
        height: "100%",
    },
    navBar: {
        width: "100%",
        position: "absolute",
        bottom: 0,
    },
    imgurHome_scrollView: {

    },
    imgurHome_picturesBlock: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        width: "100%",
    },
    imgurHome_picturesBlock_leftSideBlock: {
        width: "45%",
    },
    imgurHome_picturesBlock_rightSideBlock: {
        width: "45%",
    },
});

const ImgurHome = (props: MainRouterProps) =>
{
    return (
        <Router
            {...props}
            currentUrl={URL}
            currentComponent={ImgurHomePage}
            subpaths={[
                {path: "Picture", Component: Picture}
            ]}
        />
    )
}

export default ImgurHome;

