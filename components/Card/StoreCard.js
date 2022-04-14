import React, { useContext } from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';
import { STATIC_URL } from '../../config';
import Followers from '../Label/Followers';
import Level from '../Label/Level';
import StarRating from '../Other/StarRating';
import Colors from '../../themes/Colors';
import { AuthContext } from '../../context/AuthContext';
import FollowBtn from '../Button/FollowBtn';

const placeholderImage = require('../../assets/images/placeholder.png');
const dimensions = Dimensions.get('screen');

const StoreCard = ({
    navigation,
    item = {},
    horizontalCard = false,
    borderCard = false,
}) => {
    const { jwt } = useContext(AuthContext);
    // const handlePress = () => navigation.navigate('Store', {
    //     storeId: item._id,
    // });

    const handlePress = () => {
        console.log(item.name);
    }

    return (
        <TouchableOpacity
            style={[
                styles.container,
                {
                    borderColor: borderCard ? Colors.primary : Colors.white,
                    borderWidth: 1,
                },
            ]}
            onPress={handlePress}
        >
            <Image
                resizeMode="cover"
                style={[
                    styles.image,
                    { 
                        width: dimensions.width / (horizontalCard ? 2.2 : 2.1),
                        height: dimensions.width / (horizontalCard ? 2.2 : 2.1),
                    },
                ]}
                source={
                    item.avatar  
                    ? { uri: STATIC_URL + item.avatar }
                    : placeholderImage
                }
            />
            <View
                style={[
                    styles.detail,
                    {
                        width: dimensions.width / (horizontalCard ? 2.2 : 2.1),
                    },
                ]}
            >
                <View style={styles.labelContainer}>
                    <View style={styles.labelWrapper}>
                        <View style={styles.labelWrapper}>
                            <Followers type='store' id={item._id} />
                        </View>

                        <View style={styles.labelWrapper}>
                            <Level type='store' id={item._id} />
                        </View>
                    </View>

                    <View style={styles.labelWrapper}>
                        <Text style={[styles.isOpen, { color: item.isOpen ? Colors.fun : Colors.danger }]}>
                            {item.isOpen ? 'open' : 'closed'}
                        </Text>
                    </View>
                </View> 

                <View style={styles.rating}>
                    <StarRating stars={item.rating} />
                </View>

                <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
            </View>
            
            {!item.avatar 
                && <Text
                    style={[
                        styles.alt,
                        {
                            width: dimensions.width / (horizontalCard ? 2.2 : 2.1),
                        },
                    ]}>{item.name}</Text>}

            {jwt && jwt.accessToken && (
                <FollowBtn
                    type='store'
                    userId={jwt._id}
                    token={jwt.accessToken}
                    itemId={item._id}
                />
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        margin: 3,
        borderRadius: 6,
        alignItems: 'center',
        backgroundColor: Colors.white,
        height: dimensions.width * 0.74,
    },
    image: {
        borderTopLeftRadius: 6,
        borderTopRightRadius: 6,
        backgroundColor: Colors.muted,
    },
    detail: {
        flex: 1,
        justifyContent: 'center',
        padding: 6,
        borderBottomLeftRadius: 6,
        borderBottomRightRadius: 6,
        borderTopColor: Colors.shadow,
        borderTopWidth: 1,
    },
    labelContainer: {
        flexDirection:'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6,
    },
    labelWrapper: {
        flexDirection:'row',
        alignItems: 'center',
        marginRight: 3,
    },
    rating: {
        marginBottom: 6,
    },
    name: {
        color: Colors.black,
        fontSize: 20,
    },
    isOpen: {
        fontSize: 14,
    },
    alt: {
        position: 'absolute',
        top: 24,
        textAlign: 'center',
    },
});

export default StoreCard;