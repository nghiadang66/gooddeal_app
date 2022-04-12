import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, Dimensions, StyleSheet } from 'react-native';
import { STATIC_URL } from '../config';
import Spinner from './Spinner';

const placeholderImage = require('../assets/images/placeholder.png');
const dimensions = Dimensions.get('screen');

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
            style={{ flex: 1, }}
            numColumns={3}
            data={items}
            renderItem={({ item }) => (
                <View style={styles.card}>
                    <TouchableOpacity
                        style={styles.btn}
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
                </View>
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
        flex: 0.33333,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    btn: {
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

export default WishList;