import React from 'react';
import { TouchableHighlight, StyleSheet } from 'react-native';
import CountCart from '../Label/CountCart';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../../themes/Colors';

const BackBtn = ({ navigation, background = false, color = 'white' }) => <HeaderBtn icon='arrow-back' background={background} color={color} onPress={() => navigation.goBack()} />
const SignInBtn = ({ navigation, background = false, color = 'white' }) => <HeaderBtn icon='log-in' background={background} color={color} onPress={() => navigation.navigate('SignIn')} />
const DashboardBtn = ({ navigation, background = false, color = 'white' }) => <HeaderBtn icon='glasses' background={background} color={color} onPress={() => navigation.navigate('Dashboard')} />
const CartBtn = ({ navigation, jwt, background = false, color = 'white' }) => <HeaderBtn icon='cart' jwt={jwt} isCart={true} background={background} color={color} onPress={() => navigation.navigate('Cart')} />

const HeaderBtn = ({ background = false, color = 'white', isCart = false, onPress = () => {}, icon = '', jwt }) => (
    <TouchableHighlight
        underlayColor={Colors.light}
        style={[styles.button, background && { backgroundColor: Colors.light }]}
        onPress={onPress}
    >
        <>
            <Icon name={icon} style={[styles.icon, { color: Colors[color] }]} />
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
        // color: Colors.white,
    },
});

export { BackBtn, SignInBtn, CartBtn, DashboardBtn, HeaderBtn };