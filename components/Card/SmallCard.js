import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { STATIC_URL } from '../../config';
import Colors from '../../themes/Colors';

const placeholderImage = require('../../assets/images/placeholder.png');

const SmallCard = ({
    navigation,
    type = 'product',
    item = {},
    unlink = false,
}) => {
    const handlePress = () => navigation.navigate(
        type === 'product' ?
            'Product' :
            type === 'store' ?
                'Store' :
                'User',
        type === 'product' ?
            { productId: item._id } :
            type === 'store' ?
                { storeId: item._id, itemId: item._id } :
                { userId: item._id, itemId: item._id },
    );

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={unlink ? ()=>{} : handlePress}
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
            <View style={styles.detail}>
                <Text style={styles.name} numberOfLines={1}>
                    {type === 'user' ?
                        item.firstname + ' ' + item.lastname : 
                        item.name}
                </Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap:'wrap',
        margin: 3,
        alignItems: 'center',
    },
    image: {
        backgroundColor: Colors.muted,
        width: 52,
        height: 52,
        borderRadius: 26,
        borderWidth: 2,
        borderColor: Colors.muted,
    },
    detail: {
        flex: 1,
        padding: 6,
    },
    name: {
        color: Colors.black,
        fontSize: 20,
    },
});

export default SmallCard;