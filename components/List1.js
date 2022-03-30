import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import Card1 from '../components/Card1';
import Spinner from './Spinner';

const List1 = ({ type = 'product', items=[], navigation, loadMore = () => {}, isRefreshing = false,  }) => (
    <FlatList
        numColumns={2}
        data={items}
        renderItem={({ item }) => (
            <View style={styles.card}>
                <Card1 navigation={navigation} item={item} type={type} />
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

const styles = StyleSheet.create({
    card: {
        flex: 0.5,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default List1;