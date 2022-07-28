import * as React from "react";
import { StyleSheet, Text, View, TextInput, Image, TouchableOpacity, StatusBar, NativeSyntheticEvent, TextInputSubmitEditingEventData } from 'react-native';

const statusBarHeight: number = StatusBar.currentHeight == undefined ? 0 : StatusBar.currentHeight;

interface IProps
{
    onChangeText?(text: string): void,
    onSubmitEditing?(e: NativeSyntheticEvent<TextInputSubmitEditingEventData>): void,
}

interface IState
{
}

class SearchBar extends React.Component<IProps, IState>
{
    constructor(props: IProps)
    {
        super(props);
        this.state = {
        }
    }

    componentDidMount()
    {
        
    }

    render = (): JSX.Element =>
    {
        return (
            <View style={styles.searchBar}>
                <TextInput style={styles.searchBar_input} onChangeText={this.props.onChangeText} placeholder={"Search Pictures"} placeholderTextColor={"white"} onSubmitEditing={this.props.onSubmitEditing}/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    searchBar: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: 100 + statusBarHeight,
        backgroundColor: "blue",
        paddingTop: statusBarHeight,
    },
    searchBar_input: {
        width: "80%",
        height: 60,
        fontFamily: "sans-serif",
        fontSize: 20,
        color: "white",
        paddingLeft: 5,
        backgroundColor: `rgba(255, 255, 255, 0.3)`,
    },
});

export default SearchBar;