import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableHighlight, StyleSheet } from 'react-native';
import { listActiveProducts } from '../services/product';
import { SearchBar } from 'react-native-elements';
import List from '../components/List'; 
import Filter from '../components/Filter';
import Alert from '../components/Alert';
import Spinner from '../components/Spinner';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../themes/Colors';

const Search = ({ navigation}) => {
    const [products, setProducts] = useState();

    const [keyword, setKeyword] = useState('');

    const [pagination, setPagination] = useState({
        size: 0,
    });
    const [filter, setFilter] = useState({
        search: keyword,
        rating: '',
        minPrice: '',
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
        if (filter.page == 1) setIsLoading(true);
        else setIsRefreshing(true);
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
                setIsLoading(false);
                setIsRefreshing(false);
            });
    }

    useEffect(() => {
        getProducts();
    }, [filter]);

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
            <View style={styles.header}>
                <TouchableHighlight
                    underlayColor={Colors.light}
                    style={styles.backBtn}
                    onPress={() => navigation.goBack()}
                >
                    <Icon name='arrow-back' style={styles.backIcon} />
                </TouchableHighlight>

                <SearchBar
                    placeholder="Search..."
                    onChangeText={onChangeText}
                    value={keyword}
                    containerStyle={styles.searchBarContainer}
                    inputContainerStyle={styles.inputContainer}
                    searchIcon={<Icon 
                        name={'search'}
                        style={styles.iconSearch}
                    />}
                />
            </View>
            
            {!isLoading && !error && (
                <View style={styles.resultsContainer}>
                    <Filter filter={filter} setFilter={setFilter} />

                    <View style={styles.resultsWrapper}>
                        <Text style={styles.result}>{pagination.size} results</Text>
                    </View>

                    <View style={styles.list}>
                        {products && products.length > 0 && 
                            <List
                                navigation={navigation}
                                type='product'
                                items={products}
                                loadMore={loadMore}
                                isRefreshing={isRefreshing}
                            />}
                    </View>
                </View>
            )}
            
            {isLoading && <Spinner />}
            {error && <Alert type={'error'} />}
        </>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.primary,
        height: 64,
        paddingVertical: 12,
        paddingHorizontal: 12,
    },
    backBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backIcon: {
        fontSize: 24,
        color: Colors.white,
    },
    searchBarContainer: {
        flex: 1,
        backgroundColor: Colors.primary,
        borderTopWidth: 0,
        borderBottomWidth: 0,
    },
    inputContainer: {
        height: 32,
        paddingHorizontal: 6,
        marginRight: 12,
        borderRadius: 16,
        backgroundColor: Colors.white,
    },
    iconSearch: {
        fontSize: 24,
        color: Colors.primary,
    },
    resultsContainer: {
        position: 'relative',
        flex: 1,
    },
    resultsWrapper: {
        margin: 6,
    },
    result: {
        fontSize: 16,
        color: Colors.black,
    },
    list: {
        flex: 1,
    },
});

export default Search;