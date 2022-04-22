import React from 'react';
import { TouchableHighlight, StyleSheet } from 'react-native';
import CountCart from '../Label/CountCart';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../../themes/Colors';

const HeaderBtn = ({ background = false, isCart = false, onPress = () => {}, icon = '', jwt }) => (
    <TouchableHighlight
        underlayColor={Colors.light}
        style={[styles.button, background && { backgroundColor: Colors.light }]}
        onPress={onPress}
    >
        <>
            <Icon name={icon} style={styles.icon} />
            {isCart && (
                <CountCart
                    userId={jwt._id}
                    token={jwt.accessToken}
                />
            )}
        </>
    </TouchableHighlight>
);

const styles = StyleSheet.create({
    button: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: {
        fontSize: 24,
        color: Colors.white,
    },
});

export default HeaderBtn;