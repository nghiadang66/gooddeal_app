import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../themes/Colors';
import Cart from './Cart';
import { AuthContext } from '../context/AuthContext';

const MainNav = ({ navigation }) => {
    const { jwt } = useContext(AuthContext);

    return (
        <View style={styles.container}>
            <TouchableOpacity 
                style={styles.searchbar}
                onPress={() => {
                    console.log('---go to search screen---');
                }}
            >
                <Icon 
                    name={'search'}
                    style={styles.icon}
                />

                <Text style={styles.text}>Search...</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate(jwt.accessToken ? (jwt.role ==='admin' ? 'Dashboard' : 'Cart') : 'SignIn')}
            >
                <Icon
                    name={jwt.accessToken ? (jwt.role ==='admin' ? 'glasses' : 'cart') : 'log-in'}
                    style={styles.icon1}
                />
                {jwt.accessToken && jwt.role === 'user' && jwt._id ? 
                    (<Cart
                        userId={jwt._id}
                        token={jwt.accessToken}
                    />) :
                    null
                }
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 64,
        padding: 12,
        backgroundColor: Colors.primary,
    },
    searchbar: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        height: 32,
        paddingHorizontal: 6,
        marginHorizontal: 12,
        borderRadius: 16,
        backgroundColor: Colors.white,
    },
    button: {
        marginRight: 12,
    },
    icon: {
        fontSize: 24,
        color: Colors.primary,
        marginRight: 12,
    },
    icon1: {
        fontSize: 36,
        color: Colors.white,
    },
    text: {
        fontSize: 16,
        color: Colors.muted,
    },
});

export default MainNav;