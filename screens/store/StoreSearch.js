import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import useUpdateEffect from '../../hooks/useUpdateEffect';
import { listSellingProductsByStore } from '../../services/product';
import Search from '../../components/Other/Search';
import Alert from '../../components/Other/Alert';
import Spinner from '../../components/Other/Spinner';
import List from '../../components/List/List'; 
import Filter from '../../components/Filter/Filter';
import Colors from '../../themes/Colors';

const StoreSearch = ({ navigation, route }) => {
    const [products, setProducts] = useState([]);
    const [keyword, setKeyword] = useState('');
    const [pagination, setPagination] = useState({ size: 0 });
    const [filter, setFilter] = useState({
        search: keyword,
        rating: '',
        minPrice: 0,
        maxPrice: '',
        sortBy: 'sold',
        order: 'desc',
        categoryId: '',
        limit: 4,
        page: 1,
    });
    const [error, setError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const typingTimeoutRef = useRef(null);

    const getProducts = () => {
        setError(false);
        if (filter.page === 1) setIsLoading(true);
        else setIsRefreshing(true);
        listSellingProductsByStore(filter, route.params.storeId)
            .then(data => {
                if (data.filter.pageCurrent === 1) {
                    setProducts(data.products);
                } else {
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
                setIsLoading(false);
                setIsRefreshing(false);
            });
    }

    useEffect(() => {
        getProducts();
    }, [filter, route.params.storeId]);

    useUpdateEffect(() => {
        setFilter({
            ...filter,
            search: keyword,
            page: 1,
        });
    }, [keyword]);

    const onChangeText = (search) => {
        setKeyword(search);
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }
        typingTimeoutRef.current = setTimeout(() => setFilter({
            ...filter,
            search: search,
            page: 1,
        }), 600);
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
            <View style={styles.container}>
                <Search
                    onChangeText={onChangeText}
                    value={keyword}
                />

                <Filter filter={filter} setFilter={setFilter} />

                {!isLoading && !error && (
                    <>
                        <Text style={styles.result}>{pagination.size} results</Text>
                        <View style={styles.list}>
                            {products && products.length > 0 && 
                                <List
                                    navigation={navigation}
                                    type={'product'}
                                    items={products}
                                    loadMore={loadMore}
                                    isRefreshing={isRefreshing}
                                />}
                        </View>
                    </>
                )}
                {isLoading && <Spinner />}
                {error && <Alert type={'error'} />}
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        flex: 1,
    },
    searchBarContainer: {
        backgroundColor: 'transparent',
        borderTopWidth: 0,
        borderBottomWidth: 0,
        padding: 12,
    },
    inputContainer: {
        height: 32,
        borderRadius: 16,
        backgroundColor: Colors.white,
    },
    input: {
        height: 32,
        marginLeft: 0,
    },
    iconSearch: {
        fontSize: 24,
        color: Colors.primary,
    },
    pickerContainer: {
        width: 124,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: Colors.white,
        borderWidth: 1,
        borderTopRightRadius: 16,
        borderBottomRightRadius: 16,
        overflow: 'hidden',
    },
    picker: {
        width: 124,
        height: 32,
        color: Colors.white,
        backgroundColor: Colors.primary,
    },
    itemPicker: { 
        height: 32,
    },
    result: {
        fontSize: 16,
        color: Colors.black,
        marginLeft: 2,
    },
    list: {
        flex: 1,
    },
});

export default StoreSearch;