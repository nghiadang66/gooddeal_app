import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { listReviews } from '../../services/review';
import ListReviews from '../../components/List/ListReviews';
import RatingFilter from '../../components/Filter/RatingFilter';
import Alert from '../../components/Other/Alert';
import Spinner from '../../components/Other/Spinner';
import Colors from '../../themes/Colors';

const ReviewsAndRating = ({ navigation, route }) => {
    const [reviews, setReviews] = useState();
    const [pagination, setPagination] = useState({
        size: 0,
    });
    const [filter, setFilter] = useState({
        productId: route.params.productId,
        storeId: route.params.storeId,
        userId: route.params.userId,
        rating: '',
        sortBy: 'rating',
        order: 'desc',
        limit: 4,
        page: 1,
    });

    const [error, setError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const getReviews = () => {
        setError(false);
        if (filter.page === 1) setIsLoading(true);
        else setIsRefreshing(true);
        listReviews(filter)
            .then(data => {
                if (data.filter.pageCurrent === 1) {
                    setReviews(data.reviews);
                } else {
                    setReviews([
                        ...reviews,
                        ...data.reviews,
                    ]);
                }
                setPagination({
                    size: data.size,
                    pageCurrent: data.filter.pageCurrent,
                    pageCount: data.filter.pageCount,
                });
            })
            .catch(err => {
                setError(true);
            })
            .finally(() => {
                setIsLoading(false);
                setIsRefreshing(false);
            });
    }

    useEffect(() => {
        if (!filter.productId && !filter.storeId) return;
        getReviews();
    }, [filter]);

    useEffect(() => {
        setFilter({
            productId: route.params.productId,
            storeId: route.params.storeId,
            userId: route.params.userId,
            rating: '',
            sortBy: 'rating',
            order: 'desc',
            limit: 4,
            page: 1,
        });
    }, [route.params.productId, route.params.storeId, route.params.userId]);

    const loadMore = () => {
        if (isRefreshing) return;
        if (pagination.pageCurrent < pagination.pageCount) {
            setFilter({
                ...filter,
                page: filter.page + 1,
            }); 
        }
    }

    return (
        <View style={styles.container}>
            <RatingFilter filter={filter} setFilter={setFilter} />
            
            {!isLoading && !error && (
                <>
                    <Text style={styles.result}>{pagination.size} results</Text>
                    {reviews && reviews.length > 0 && (
                        <View style={styles.list}>
                            <ListReviews
                                navigation={navigation}
                                items={reviews}
                                loadMore={loadMore}
                                isRefreshing={isRefreshing}
                            />
                        </View>
                    )}
                </>
            )}

            {isLoading && <Spinner />}
            {error && <Alert type={'error'} />}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        flex: 1,
    },
    result: {
        fontSize: 16,
        color: Colors.black,
        marginTop: 6,
        marginLeft: 2,
    },
    list: {
        flex: 1,
    },
});

export default ReviewsAndRating;