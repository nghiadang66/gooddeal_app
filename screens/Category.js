import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { listActiveCategories } from '../services/category';
import { listActiveProducts } from '../services/product';
import Slider from '../components/Slider';
import Card from '../components/Card';
import Alert from '../components/Alert';
import Spinner from '../components/Spinner';
import Colors from '../themes/Colors';
import Icon from 'react-native-vector-icons/Ionicons';

const Category = ({ route, navigation }) => {
    const [categories, setCategories] = useState();
    const [currentCategoryIndex, setCurrentCategoryIndex] = useState();
    const [products, setProducts] = useState();
    const [pagination, setPagination] = useState();
    const [filter, setFilter] = useState({
        search: '',
        rating: '',
        categoryId: route.params.categoryId,
        minPrice: '',
        maxPrice: '',
        sortBy: 'sold',
        order: 'desc',
        limit: 4,
        page: 1,
    });

    const [error, setError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(true);

    const getCategories = () => {
        setError(false);
        setIsLoading(true);
        listActiveCategories({
            search: '',
            categoryId: route.params.categoryId,
            sortBy: 'name',
            order: 'asc',
            limit: 100,
            page: 1,
        })
            .then(data => {
                setCategories(data.categories);
            })
            .catch(err => {
                setError(true);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }

    const getProducts = () => {
        setError(false);
        setIsRefreshing(true);
        listActiveProducts(filter)
            .then(data => {
                if (data.filter.pageCurrent == 1) {
                    setProducts(data.products);
                }
                else {
                    setProducts([
                        ...products,
                        ...data.products,
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
                setIsRefreshing(false);
            });
    }

    useEffect(() => {
        getProducts();
    }, [filter]);

    useEffect(() => {
        getCategories();
        setCurrentCategoryIndex(0);
        setFilter({
            ...filter,
            page: 1,
            categoryId: route.params.categoryId,
        });
    }, [route.params.categoryId]);

    const handleSliderPress = (index) => navigation.navigate('Category', {
        categoryId: categories[index]._id,
        categoryName: categories[index].name,
    });

    const loadMore = () => {
        if (pagination.pageCurrent < pagination.pageCount) {
            setFilter({
                ...filter,
                page: filter.page + 1,
            }); 
        }
    }

    return (
        <>
            {!isLoading && !error && (
                <>
                    {categories && categories.length > 0 && (
                        <View style={styles.slider}>
                            <Slider
                                items={categories}
                                currentIndex={currentCategoryIndex}
                                handleSliderPress={handleSliderPress}
                                setCurrentindex={setCurrentCategoryIndex}
                            />
                        </View>
                    )}

                    <View style={styles.wrapper}>
                        <Text style={styles.result}>{pagination && pagination.size || '0'} results</Text>

                        <TouchableOpacity
                            style={{
                                backgroundColor: Colors.primary,
                                borderRadius: 6,
                                paddingVertical: 6,
                                paddingHorizontal: 12, 
                            }}
                            onPress={() => {
                                console.log('---open filters---')
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 20,
                                    color: Colors.white,
                                }}
                            >
                                <Icon name='filter'
                                    style= {{
                                        fontSize: 20,
                                        color: Colors.white
                                    }}
                                />
                                {' '}All filters
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View style={[styles.list, (!categories || categories.length == 0) && { flex: 1 }]}>
                        {products && products.length > 0 && (
                            <FlatList
                                numColumns={2}
                                data={products}
                                renderItem={({ item }) => (
                                    <View style={styles.card}>
                                        <Card navigation={navigation} item={item} />
                                    </View>
                                )}
                                keyExtractor={item => item._id}
                                onEndReached={loadMore}
                            />
                        )}

                        {isRefreshing && <Spinner />}
                    </View>
                </>
            )}

            {isLoading && <Spinner />}
            {error && <Alert type={'error'} content={error} />}
        </>
    );
}

const styles = StyleSheet.create({
    slider: {
        flex: 0.3,
        marginBottom: 6,
    },
    wrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginVertical: 6,
        paddingHorizontal: 12,
    },
    result: {
        fontSize: 16,
        color: Colors.muted,
    },
    list: {
        flex: 0.7,
    },
    card: {
        flex: 0.5,
    },
});

export default Category;