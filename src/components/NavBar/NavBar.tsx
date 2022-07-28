import * as React from "react";
import { StyleSheet, Text, View, TextInput, Image, TouchableOpacity, GestureResponderEvent } from 'react-native';

interface IProps
{
    onClickSearch?(event: GestureResponderEvent): void,
    onClickUpload?(event: GestureResponderEvent): void,
    onClickProfile?(event: GestureResponderEvent): void,
    searchPageSelected: boolean,
    uploadPageSelected: boolean,
    profilePageSelected: boolean,
}

interface IState
{

}

class NavBar extends React.Component<IProps, IState>
{
    constructor(props: IProps)
    {
        super(props);
        this.state = {

        }
    }

    render = (): JSX.Element =>
    {
        return (
            <View style={styles.navBar}>
                <TouchableOpacity onPress={this.props.onClickSearch == undefined ? undefined: this.props.onClickSearch} activeOpacity={1}>
                    <Image style={{...styles.navBar_btn, opacity: this.props.searchPageSelected ? 1 : 0.3}} source={require("./_media/mglass.png")}/>
                </TouchableOpacity>
                <TouchableOpacity onPress={this.props.onClickUpload == undefined ? undefined: this.props.onClickUpload} activeOpacity={1}>
                    <Image style={{...styles.navBar_btn, opacity: this.props.uploadPageSelected ? 1 : 0.3}} source={require("./_media/upload.png")}/>
                </TouchableOpacity>
                <TouchableOpacity onPress={this.props.onClickProfile == undefined ? undefined: this.props.onClickProfile} activeOpacity={1}>
                    <Image style={{...styles.navBar_btn, opacity: this.props.profilePageSelected ? 1 : 0.3}} source={require("./_media/profile.png")}/>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    navBar: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        width: "100%",
        height: 70,
        backgroundColor: "white"
    },
    navBar_btn: {
        width: 50,
        height: 50,
    }
});

export default NavBar;