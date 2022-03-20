import React from "react";
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import Colors from "../themes/Colors";

const Link = ({ title='this is a link', onPress=()=>{}, fontSize=16 }) => {
    return (
        <TouchableOpacity onPress={onPress}>
            <Text style={[styles.link, { fontSize: fontSize }]}>
                {title}
            </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    link: {
        color: Colors.primary,
        textDecorationLine: 'underline',
        textDecorationStyle: 'solid',
        textDecorationColor: Colors.primary,
    },
});

export default Link;