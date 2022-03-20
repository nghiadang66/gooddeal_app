import React from "react";
import { View, Text, StyleSheet } from 'react-native';
import Colors from "../themes/Colors";

const Alert = ({ type='error', content='Server Error!' }) => {
    return (
        <View style={styles.container}>
            <Text style={[styles.alert, styles[type]]}>{content}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    alert: {
        fontSize: 16,
    },
    error: {
        color: Colors.danger,
    },
    success: {
        color: Colors.success,
    },
});

export default Alert;