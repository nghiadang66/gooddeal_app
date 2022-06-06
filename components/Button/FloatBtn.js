import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import Colors from '../../themes/Colors';
import Icon from 'react-native-vector-icons/Ionicons';

const FloatBtn = ({onPress = () => {}, icon = 'add', position = 'bottom'}) => (
    <TouchableOpacity
        style={[styles.floatBtn, styles[position]]}
        onPress={onPress}
    >
        <Icon name={icon} style={styles.icon} />
    </TouchableOpacity>
);

const styles= StyleSheet.create({
    floatBtn: {
        position: 'absolute',                                   
        
        zIndex: 9999,
        justifyContent: 'center',
        alignItems: 'center',
        width: 60,
        height: 60,
        borderRadius: 30,     
        backgroundColor: Colors.primary,
    },
    top: {
        top: 120,
        right: 10,
    },
    bottom: {
        bottom: 10,
        right: 10,
    },
    icon: {
        fontSize: 24,
        color: Colors.white
    },
});

export default FloatBtn;