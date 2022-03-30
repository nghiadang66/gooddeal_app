import React from 'react';
import { Text, Image, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';
import { STATIC_URL } from '../config';
import Colors from '../themes/Colors';

const placeholderImage = require('../assets/images/placeholder.png');
const dimensions = Dimensions.get('screen');
const imageWidth = Math.round(dimensions.width / 2.5);
const imageHeight = Math.round(Math.round(dimensions.width / 2.5) * 1.5);

const Card = ({ navigation, type='product', item = {} }) => {
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
            <Text style={styles.detail}>
                {type === 'product'
                    ? 'Sold ' + item.sold + '+'
                    : item.name}
            </Text>
            {type === 'product' && !item.listImages && <Text style={styles.alt}>{item.name}</Text>}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        paddingHorizontal: 6,
        marginVertical: 6,
        alignItems: 'center',
        height: imageHeight,
    },
    image: {
        width: imageWidth, 
        height: imageHeight,
        borderRadius: 20,
    },
    detail: {
        position: 'absolute',
        width: imageWidth,
        bottom: 0,
        padding: 6,
        margin: 0,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        textAlign: 'center',
        color: Colors.white,
        backgroundColor: Colors.shadow,
    },
    alt: {
        position: 'absolute',
        width: imageWidth,
        top: 24,
        textAlign: 'center',
    },
});

export default Card;