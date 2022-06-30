import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import ProductCard from '../Card/ProductCard';
import StoreCard from '../Card/StoreCard';
import UserCard from '../Card/UserCard';
import Spinner from '../Other/Spinner';
import Colors from '../../themes/Colors';

const List = ({
    navigation,
    type = 'product',
    title = '',
    items = [],
    loadMore = () => {},
    isRefreshing = false,
    horizontal = false,
    border = false,
}) => (
    <View style={styles.container}>
        {title ? <Text style={styles.title}>{title}</Text> : null}
        <FlatList
            horizontal={horizontal}
            numColumns={horizontal ? 1 : 2}
            data={items}
            renderItem={({ item }) => (
                <View style={[styles.card, !horizontal && { flex: 0.5 }]}>
                    {type === 'product' &&
                        <ProductCard
                            navigation={navigation}
                            item={item}
                            horizontalCard={horizontal}
                            borderCard={border}
                        />}

                    {(type === 'store' || type === 'vendor') &&
                        <StoreCard
                            navigation={navigation}
                            item={item}
                            type={type}
                            horizontalCard={horizontal}
                            borderCard={border}
                        />}

                    {type === 'user' &&
                        <UserCard
                            navigation={navigation}
                            item={item}
                            horizontalCard={horizontal}
                            borderCard={border}
                        />}

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
    </View>
);

const styles = StyleSheet.create({
    container: {
        marginVertical: 12,
        marginHorizontal: 3,
    },
    title: {
        color: Colors.primary,
        fontSize: 20,
        fontWeight: 'bold',
        paddingHorizontal: 12,
        marginBottom: 6,
    },
    card: {
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default List;