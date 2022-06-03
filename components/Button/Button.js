import React from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";
import Colors from "../../themes/Colors";

const Button = ({ type='primary', title='Button', outline=false, onPress=()=>{} }) => {
    return (
        <TouchableOpacity style={[styles.button.primary, styles.button[type], outline && styles.outline]} onPress={onPress}>
            <Text style={[styles.text.primary, styles.text[type], outline && styles.outlineText[type]]}>{title}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        primary: {
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 12,
            paddingHorizontal: 32,
            borderWidth: 2,
            borderRadius: 4,
            lineHeight: 3,
            backgroundColor: Colors.primary,
            borderColor: Colors.primary,
        },
        danger: {
            borderWidth: 2,
            borderColor: Colors.danger,
            borderStyle: 'solid',
            backgroundColor: Colors.white,
        },
        pinky: {
            backgroundColor: Colors.pink,
            borderColor: Colors.pink,
        },
    },
    text: {
        primary: {
            fontSize: 18,
            fontWeight: 'bold',
            color: Colors.white,
        },
        danger: {
            color: Colors.danger,
        },
    },
    outline: {
        backgroundColor: Colors.white,
    },
    outlineText: {
        primary: {
            color: Colors.primary,
        },
        pinky: {
            color: Colors.pink,
        },
    },
});

export default Button;