import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, Image, ImageBackground } from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import { STATIC_URL } from '../../config';
import { getStore } from '../../services/store';
import { BackBtn, CartBtn } from '../Button/HeaderBtn';
import FollowBtn from '../Button/FollowBtn';
import Followers from '../Label/Followers';
import StarRating from '../Other/StarRating';
import Colors from '../../themes/Colors';
import Level from '../Label/Level';

const fetchFuncs = {
    // 'user': getUser,
    'store': getStore,
}

const PerNav = ({ navigation, route, type = 'account' }) => {
    const [item, setItem] = useState({});
    const { jwt, userProfile } = useContext(AuthContext);

    const getItem = () => {
        fetchFuncs[type](route.params.itemId)
            .then(data => {
                setItem(data[type]);
            })
            .catch(error => { });
    }

    useEffect(() => {
        if (type === 'account') setItem(userProfile);
        else getItem();
    }, [route.params, type]);

    return (
        <View style={styles.container}>
            <ImageBackground 
                source={{uri: STATIC_URL + item.cover }} 
                style={styles.cover}
            >
                <View style={styles.wrapper}>
                    {type !== 'account' && (
                        <View style={styles.header}>
                            <View style={styles.headerItem}>
                                <BackBtn navigation={navigation} background={true} />
                            </View>

                            {jwt && jwt.accessToken && (
                                <View style={styles.headerItem}>
                                    <CartBtn navigation={navigation} jwt={jwt} background={true} />
                                </View>
                            )}
                        </View>
                    )}

                    <Image
                        style={styles.avatar}
                        source={{uri: STATIC_URL + item.avatar }}
                    />

                    <View style={styles.profile}>
                        <Text style={styles.name}>{type === 'store' ? item.name : (item.firstname + ' ' + item.lastname)}</Text>

                        <View style={styles.level}>
                            <Text style={styles.point}>{item.point}</Text>
                            <Level type={type === 'account'? 'user' : type} id={item._id} />
                        </View>

                        {type === 'store' && (
                            <>
                                <View style={styles.labelWrapper}>
                                    <View style={styles.label}>
                                        <StarRating stars={item.rating} />
                                    </View>

                                    <View style={styles.label}>
                                        <Text style={{ color: Colors.white }}>|</Text>
                                    </View>
                                    <View style={styles.label}>
                                        <Followers type={type} id={item._id} />
                                    </View>

                                    <View style={styles.label}>
                                        <Text style={{ color: Colors.white }}>|</Text>
                                    </View>
                                    <View style={styles.label}>
                                        <Text style={[styles.isOpen, { color: item.isOpen ? Colors.fun : Colors.danger }]}>
                                            {item.isOpen ? 'open' : 'closed'}
                                        </Text>
                                    </View>
                                </View>

                                {jwt && jwt.accessToken && (
                                    <FollowBtn
                                        type={type}
                                        userId={jwt._id}
                                        token={jwt.accessToken}
                                        itemId={item._id}
                                    />
                                )}
                            </>
                        )}

                    </View>
                </View>
            </ImageBackground>
            
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
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
        height: 160,
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
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-start',
        marginLeft: 24,
        height: 154,
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
    labelWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        marginTop: 6,
    },
    label: {
        marginRight: 12,
    },
    isOpen: {
        fontSize: 14,
    },
    header: {
        position: 'absolute',
        top: 6,
        left: 6,
        zIndex: 9999,
        flex: 1,
        flexDirection: 'row',
    },
    headerItem: {
        marginRight: 6,
    },
});

export default PerNav;