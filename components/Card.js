import React from 'react';
import { StyleSheet, TouchableOpacity, Image, Text } from 'react-native';
import { STATIC_URL } from '../config';
import Colors from '../themes/Colors';

const placeholderImage = require('../assets/images/placeholder.png');

const Card = ({ navigation, type='product', item = {} }) => {
    // const handlePress = () => navigation.navigate('Detail', {
    //     movieId: item.id,
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
        height: 200,
    },
    image: {
        width: 150, 
        height: 200,
        borderRadius: 20,
    },
    detail: {
        position: 'absolute',
        width: 150,
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
        width: 150,
        top: 24,
        textAlign: 'center',
    },
});

export default Card;