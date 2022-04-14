import React from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";
import Colors from "../../themes/Colors";

const Button = ({ type='primary', title='Button', onPress=()=>{} }) => {
    return (
        <TouchableOpacity style={[styles.button.primary, styles.button[type]]} onPress={onPress}>
            <Text style={[styles.text.primary, styles.text[type]]}>{title}</Text>
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
            borderRadius: 4,
            lineHeight: 3,
            backgroundColor: Colors.primary,
        },
        danger: {
            borderWidth: 2,
            borderColor: Colors.danger,
            borderStyle: 'solid',
            backgroundColor: Colors.white,
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
        }
    }
});

export default Button;