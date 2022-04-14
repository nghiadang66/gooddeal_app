import React, { useContext } from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';
import { STATIC_URL } from '../../config';
import { formatPrice } from '../../helper/formatPrice';
import Followers from '../Label/Followers';
import StarRating from '../Other/StarRating';
import Colors from '../../themes/Colors';
import { AuthContext } from '../../context/AuthContext';
import FollowBtn from '../Button/FollowBtn';

const placeholderImage = require('../../assets/images/placeholder.png');
const dimensions = Dimensions.get('screen');

const ProductCard = ({
    navigation,
    item = {},
    horizontalCard = false,
    borderCard = false,
}) => {
    const { jwt } = useContext(AuthContext);
    const handlePress = () => navigation.navigate('Product', {
        productId: item._id,
    });

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
                    item.listImages  
                    ? { uri: STATIC_URL + item.listImages[0] }
                    : placeholderImage
                }
            />
            <View
                style={[
                    styles.detail,
                    { width: dimensions.width / (horizontalCard ? 2.2 : 2.1) },
                ]}
            >
                <View style={styles.labelContainer}>
                    <View style={styles.labelWrapper}>
                        <Followers type='product' id={item._id} />
                    </View>

                    <View style={styles.labelWrapper}>
                        <Text style={styles.sold}>Sold {item.sold}</Text>
                    </View>
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
            
            {!item.listImages &&
                <Text
                    style={[
                        styles.alt,
                        { width: dimensions.width / (horizontalCard ? 2.2 : 2.1) },
                    ]}
                >
                    {item.name}
                </Text>}

            {jwt && jwt.accessToken && (
                <FollowBtn
                    type='product'
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
        alignItems: 'center',
        backgroundColor: Colors.white,
        margin: 3,
        borderRadius: 6,
        height: dimensions.width * 0.88,
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
        marginRight: 3,
    },
    rating: {
        marginBottom: 6,
    },
    name: {
        color: Colors.black,
        fontSize: 14,
    },
    sold: {
        fontSize: Colors.muted,
        fontSize: 14,
    },
    price: {
        justifyContent: 'flex-start',
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
        top: 24,
        textAlign: 'center',
    },
});

export default ProductCard;