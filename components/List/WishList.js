import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import Spinner from '../Other/Spinner';
import WishCard from '../Card/WishCard';

const WishList = ({
    navigation,
    type = 'product',
    items = [],
    loadMore = () => {},
    isRefreshing = false,
}) => {
    return (
        <FlatList
            numColumns={3}
            data={items}
            renderItem={({ item }) => (
                <View style={styles.card}>
                    <WishCard
                        navigation={navigation}
                        type={type}
                        item={item}
                    />
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
    },
});

export default WishList;