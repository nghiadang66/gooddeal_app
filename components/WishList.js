import React from 'react';
import { Text, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { STATIC_URL } from '../config';
import Spinner from './Spinner';

const placeholderImage = require('../assets/images/placeholder.png');

const WishList = ({
    navigation,
    type = 'product',
    items = [],
    loadMore = () => {},
    isRefreshing = false,
}) => {
    // const handlePress = (item) => navigation.navigate(type === 'product' ? 'Product' : 'Store', 
    //     type === 'product' ? {
    //         productId: item._id,
    //     } : {
    //         storeId: item._id,
    //     });

    const handlePress = (item) => {
        console.log(item.name);
    }

    return (
        <FlatList
            numColumns={3}
            data={items}
            renderItem={({ item }) => (
                <TouchableOpacity
                    style={styles.card}
                    onPress={() => handlePress(item)}
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
            )}
            keyExtractor={item => item._id}
            onEndReached={loadMore}
            onEndReachedThreshold={0.2}
            refreshing={isRefreshing}
            ListFooterComponent={() => {
                if (isRefreshing) return <Spinner />;
                return null;
            }}
        />
    );
}

const styles = StyleSheet.create({
    card: {
        padding: 5,
        position: 'relative',
        alignItems: 'center',
        height: 200,
        marginBottom: 5,
    },
    image: {
        width: 120, 
        height: 200,
        borderRadius: 20,
    },
    name: {
        position: 'absolute',
        width: 100,
        top: 10,
        textAlign: 'center',
    },
});

export default WishList;