import React, { useContext } from 'react';
import { View, Text, StyleSheet, Image, ImageBackground } from 'react-native';
import Colors from '../themes/Colors';
import Level from './Level';
import Icon from 'react-native-vector-icons/Ionicons';
import { AuthContext } from '../context/AuthContext';
import { STATIC_URL } from '../config';

const AccountNav = ({ navigation }) => {
    const { jwt, userProfile } = useContext(AuthContext);

    return (
        <View style={styles.container}>
            <ImageBackground 
                source={{uri: STATIC_URL + userProfile.cover }} 
                style={styles.cover}
            >
                <View style={styles.wrapper}>
                    <Image
                        style={styles.avatar}
                        source={{uri: STATIC_URL + userProfile.avatar }}
                    />

                    <View style={styles.profile}>
                        <Text style={styles.name}>{userProfile.firstname + ' ' + userProfile.lastname}</Text>
                        <View style={styles.level}>
                            <Text style={styles.point}>{userProfile.point}</Text>
                            <Level type='user' id={userProfile._id} />
                        </View>
                        
                    </View>
                </View>
            </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: 160,
        backgroundColor: Colors.muted,
    },
    wrapper: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 12,
        backgroundColor: Colors.shadow,
    },
    cover: {
        resizeMode: 'cover',
        width: '100%',
        height: '100%',
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderColor: Colors.white,
        borderWidth: 3,
        opacity: 1,
    },
    profile: {
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingVertical: 6,
        paddingHorizontal: 12,
        margin: 12,
        borderRadius: 6,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.white,
    },
    level: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    icon: {
        fontSize: 20,
        color: Colors.white,
        marginRight: 3,
    },
    point: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.white,
        marginRight: 6,
    },
});

export default AccountNav;