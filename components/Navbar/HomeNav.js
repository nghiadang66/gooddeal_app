import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../../themes/Colors';
import { AuthContext } from '../../context/AuthContext';
import HeaderBtn from '../Button/HeaderBtn';

const HomeNav = ({ navigation, isMain = true }) => {
    const { jwt } = useContext(AuthContext);

    return (
        <View style={[styles.container, !isMain && { paddingLeft: 0, paddingRight: 36, }]}
        >
            {!isMain && (
                <HeaderBtn icon='arrow-back' onPress={() => navigation.goBack()} />
            )}
            <TouchableOpacity 
                style={styles.searchbar}
                onPress={() => navigation.navigate('Search')}
            >
                <Icon 
                    name={'search'}
                    style={styles.iconSearch}
                />

                <Text style={styles.textSearch}>Search...</Text>
            </TouchableOpacity>

            {jwt && jwt.accessToken ? (
                <>
                    {jwt.role === 'admin' ? (
                        <HeaderBtn icon='glasses' onPress={() => navigation.navigate('Dashboard')} />
                    ) : (
                        <HeaderBtn icon='cart' jwt={jwt} isCart={true} onPress={() => navigation.navigate('Cart')} />
                    )}
                </>
            ) : (
                <HeaderBtn icon='log-in' onPress={() => navigation.navigate('SignIn')} />
            )}

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        height: 64,
        paddingVertical: 12,
        paddingHorizontal: 24,
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
        paddingHorizontal: 6,
    },
    iconSearch: {
        fontSize: 24,
        color: Colors.primary,
        marginRight: 12,
    },
    textSearch: {
        fontSize: 16,
        color: Colors.muted,
    },
    iconBtn: {
        fontSize: 36,
        color: Colors.white,
    },
});

export default HomeNav;