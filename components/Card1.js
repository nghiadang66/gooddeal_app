import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';
import { getNumberOfFollowersForProduct } from '../services/follow';
import { STATIC_URL } from '../config';
import { formatPrice } from '../helper/formatPrice';
import StarRating from './StarRating';
import Colors from '../themes/Colors';
import Icon from 'react-native-vector-icons/Ionicons';

const placeholderImage = require('../assets/images/placeholder.png');
const dimensions = Dimensions.get('screen');
const dimensionsWidth = Math.round(dimensions.width / 2.1);
const dimensionsHeight = 342;

const Card1 = ({ navigation, type='product', item = {} }) => {
    const [followers, setFollowers] = useState(0);

    const getFollowers = async () => {
        try {
            const data = await getNumberOfFollowersForProduct(item._id);
            setFollowers(data.count);
        } catch (e) {
            setFollowers(0);
        }
    }

    useEffect(() => {
        getFollowers();
    }, [item._id]);

    // const handlePress = () => navigation.navigate('Product', {
    //     productId: item._id,
    // });

    const handlePress = () => {
        console.log(item.name);
    }

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={handlePress}
        >
            <Image
                resizeMode="cover"
                style={styles.image}
                source={
                    type === 'product'
                    ? item.listImages  
                        ? { uri: STATIC_URL + item.listImages[0] }
                        : placeholderImage
                    : item.avatar
                        ? { uri: STATIC_URL + item.avatar }
                        : placeholderImage
                }
            />
            <View style={styles.detail}>
                <View style={styles.followers}>
                    <View style={styles.followersWrapper}>
                        <Icon name='heart' style={styles.followersIcon} />
                        <Text style={styles.followersText}>{' '}{followers}</Text>
                    </View>
                    <View style={{ flex: 1 }}></View>
                </View>

                <View style={styles.rating}>
                    <StarRating stars={item.rating} />
                </View>

                <Text style={styles.name} numberOfLines={2}>{item.name}</Text>

                <View style={styles.price}>
                    <Text style={styles.oldPrice}>
                        <Text style={[styles.unit, styles.oldPrice]}>đ</Text>
                        {item.price && formatPrice(item.price.$numberDecimal)}
                    </Text>
                    <Text style={styles.newPrice}>
                    <Text style={[styles.unit, styles.newPrice]}>đ</Text>
                        {item.promotionalPrice && formatPrice(item.promotionalPrice.$numberDecimal)}
                    </Text>
                </View>
            </View>
            
            {type === 'product' && !item.listImages && <Text style={styles.alt}>{item.name}</Text>}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        margin: 6,
        alignItems: 'center',
        height: dimensionsHeight,
        backgroundColor: Colors.white,
        borderRadius: 6,
    },
    image: {
        width: dimensionsWidth, 
        height: dimensionsWidth,
        borderTopLeftRadius: 6,
        borderTopRightRadius: 6,
        backgroundColor: Colors.muted,
        borderColor: Colors.white,
        borderWidth: 1,
    },
    detail: {
        flex: 1,
        width: dimensionsWidth,
        padding: 6,
        borderBottomLeftRadius: 6,
        borderBottomRightRadius: 6,
    },
    followers: {
        flexDirection:'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    followersWrapper : {
        flexDirection:'row',
        alignItems: 'center',
        backgroundColor: Colors.pink,
        paddingVertical: 3,
        paddingHorizontal: 6,
        borderRadius: 3,
    },
    followersIcon: {
        fontSize: 12,
        color: Colors.white,
    },
    followersText: {
        fontSize: 12,
        color: Colors.white,
    },
    rating: {
        marginBottom: 6,
    },
    name: {
        color: Colors.black,
        fontSize: 14,
    },
    price: {
        justifyContent: 'flex-start',
        marginBottom: 6,
    },
    unit: {
        textDecorationLine: 'underline',
    },
    oldPrice: {
        fontSize: 16,
        color: Colors.muted,
        textDecorationLine: 'line-through',
    },
    newPrice: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.primary,
    },
    alt: {
        position: 'absolute',
        width: dimensionsWidth,
        top: 24,
        textAlign: 'center',
    },
});

export default Card1;