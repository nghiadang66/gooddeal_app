import React from 'react';
import { Text, TouchableOpacity, Image, Dimensions, StyleSheet } from 'react-native';
import { STATIC_URL } from '../../config';

const placeholderImage = require('../../assets/images/placeholder.png');
const dimensions = Dimensions.get('screen');

const WishCard = ({
    navigation,
    type = 'product',
    item = {},
}) => {
    const onPress = type === 'product' ? 
        () => navigation.navigate('Product', {
            productId: item._id,
        }) :
        () => navigation.navigate('Store', {
            storeId: item._id,
            itemId: item._id,
        });

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={onPress}
        >
            <Image
                resizeMode="cover"
                style={styles.image}
                source={
                    type === 'product' ?
                        item.listImages ?
                            { uri: STATIC_URL + item.listImages[0] } :
                            placeholderImage :
                        item.avatar ?
                            { uri: STATIC_URL + item.avatar } :
                            placeholderImage
                }
            />
            {!item.listImages && !item.avatar && <Text style={styles.name}>{item.name}</Text>}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        alignItems: 'center',
        margin: 2,
        borderRadius: 20,
        width: dimensions.width / 3.2,
        height: dimensions.width / 2,
    },
    image: {
        borderRadius: 20,
        width: dimensions.width / 3.2,
        height: dimensions.width / 2,
    },
    name: {
        position: 'absolute',
        width: 100,
        top: 10,
        textAlign: 'center',
    },
});

export default WishCard;