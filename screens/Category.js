import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { listActiveCategories } from '../services/category';
import { listActiveProducts } from '../services/product';
import Slider from '../components/Slider';
import List1 from '../components/List1';
import Filter from '../components/Filter';
import Alert from '../components/Alert';
import Spinner from '../components/Spinner';
import Colors from '../themes/Colors';

const Category = ({ route, navigation }) => {
    const [categories, setCategories] = useState();
    const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
    const [products, setProducts] = useState();
    const [pagination, setPagination] = useState({
        size: 0,
    });
    const [filter, setFilter] = useState({
        search: '',
        rating: '',
        categoryId: route.params.category._id,
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
            categoryId: route.params.category._id,
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
        getCategories();
        setCurrentCategoryIndex(0);
        setPagination({ size: 0, })
        setFilter({
            search: '',
            rating: '',
            categoryId: route.params.category._id,
            minPrice: '',
            maxPrice: '',
            sortBy: 'sold',
            order: 'desc',
            limit: 4,
            page: 1,
        });
    }, [route.params.category]);

    useEffect(() => {
        getProducts();
    }, [filter]);

    const handleSliderPress = (index) => {
        navigation.navigate('Category', {
            category: categories[index],
        });
    }

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
        <>
            {!isLoading && !error && (
                <View style={styles.container}>
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
                        <Text style={styles.result}>
                            {pagination && pagination.size || '0'} results
                        </Text>
                    </View>

                    <Filter filter={filter} setFilter={setFilter} />

                    <View
                        style={[styles.list, (!categories || categories.length == 0) && { flex: 1 }]}
                    >
                        {(isRefreshing && filter.page === 1)
                            ? <Spinner />
                            : (products && products.length > 0)
                                ? (<List1
                                    items={products}
                                    navigation={navigation}
                                    loadMore={loadMore}
                                    isRefreshing={isRefreshing}
                                  />)
                                : null}
                    </View>
                </View>
            )}

            {isLoading && <Spinner />}
            {error && <Alert type={'error'} content={error} />}
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        flex: 1,
    },
    slider: {
        flex: 0.3,
        backgroundColor: Colors.white,
        marginBottom: 6,
    },
    wrapper: {
        margin: 6,
    },
    result: {
        fontSize: 16,
        color: Colors.black,
    },
    list: {
        flex: 0.7,
    },
});

export default Category;