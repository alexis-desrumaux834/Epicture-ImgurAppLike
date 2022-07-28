import * as React from "react";
import { StyleSheet, Text, View, TextInput, Image, TouchableOpacity, Button, StyleProp, ViewStyle } from "react-native";
import * as ImagePicker from 'expo-image-picker';

interface IProps {
    getImageCallBack(data: any): void,
    style?: StyleProp<ViewStyle>,
    activeOpacity?: number,
}

interface IState {
}

class UploadFile extends React.Component<IProps, IState>
{
    constructor(props: IProps) {
        super(props);
        this.state = {
        
        };
    }
    
    chooseImage = async () => {
        console.log("Hello !");
        let result: any = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });
        if (result.type !== "image")
            alert("Please choose an image\n\nAllowed extensions: jpg, png, gif");
        
        console.log(result);
        this.props.getImageCallBack(result);
    }

    render = (): JSX.Element => {
        return (
            <TouchableOpacity onPress={this.chooseImage} style={this.props.style} activeOpacity={this.props.activeOpacity}>
                {this.props.children}
            </TouchableOpacity>
        )
    }
}

export default UploadFile