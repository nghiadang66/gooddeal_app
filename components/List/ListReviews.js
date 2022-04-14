import React from 'react';
import { FlatList } from 'react-native';
import Spinner from '../Other/Spinner';
import ReviewCard from '../Card/ReviewCard';

const ListReviews = ({
    navigation,
    items = [],
    loadMore = () => {},
    isRefreshing = false,
}) => (
    <FlatList
        data={items}
        renderItem={({ item }) => (
            <ReviewCard
                navigation={navigation}
                item={item}
            />
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

export default ListReviews;