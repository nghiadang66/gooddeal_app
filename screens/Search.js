import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableHighlight, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { listActiveProducts } from '../services/product';
import { getlistStores } from '../services/store';
import { getlistUsers } from '../services/user';
import { SearchBar } from 'react-native-elements';
import List from '../components/List'; 
import Filter from '../components/Filter';
import Alert from '../components/Alert';
import Spinner from '../components/Spinner';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../themes/Colors';

const Search = ({ navigation }) => {
    const [products, setProducts] = useState();
    const [stores, setStores] = useState();
    const [users, setUsers] = useState();

    const [keyword, setKeyword] = useState('');
    const [option, setOption] = useState('product');

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

                setStores();
                setUsers();
            })
            .catch(err => {
                setError(true);
            })
            .finally(() => {
                setIsLoading(false);
                setIsRefreshing(false);
            });
    }

    const getStores = () => {
        getlistStores(filter)
            .then(data => {
                if (data.filter.pageCurrent == 1) {
                    setStores(data.stores);
                }
                else {
                    setStores([
                        ...stores,
                        ...data.stores,
                    ]);
                }
                setPagination({
                    size: data.size,
                    pageCurrent: data.filter.pageCurrent,
                    pageCount: data.filter.pageCount,
                });

                setProducts();
                setUsers();
            })
            .catch(err => {
                setError(true);
            })
            .finally(() => {
                setIsLoading(false);
                setIsRefreshing(false);
            });
    }

    const getUsers = () => {
        getlistUsers(filter)
            .then(data => {
                if (data.filter.pageCurrent == 1) {
                    setUsers(data.users);
                }
                else {
                    setUsers([
                        ...users,
                        ...data.users,
                    ]);
                }
                setPagination({
                    size: data.size,
                    pageCurrent: data.filter.pageCurrent,
                    pageCount: data.filter.pageCount,
                });

                setProducts();
                setStores();
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
        setFilter({
            ...filter,
            page: 1,
        });
    }, [option])

    useEffect(() => {
        setError(false);
        if (filter.page == 1) setIsLoading(true);
        else setIsRefreshing(true);

        if (option === 'product') getProducts();
        else if (option === 'store') getStores();
        else if (option === 'user') getUsers();

        return () => {
            setProducts();
            setStores();
            setUsers();
          };
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
                    inputStyle={styles.input}
                    searchIcon={<Icon 
                        name={'search'}
                        style={styles.iconSearch}
                    />}
                />

                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={option}
                        style={styles.picker}
                        itemStyle={styles.itemPicker}
                        dropdownIconColor={Colors.white}
                        dropdownIconRippleColor={Colors.light}
                        mode='dropdown'
                        prompt='Select search option'
                        onValueChange={(itemValue, itemIndex) => setOption(itemValue)}
                    >
                        <Picker.Item label="product" value="product" />
                        <Picker.Item label="store" value="store" />
                        <Picker.Item label="user" value="user" />
                    </Picker>
                </View>
            </View>
            
            {!isLoading && !error && (
                <View style={styles.resultsContainer}>
                    <Filter filter={filter} setFilter={setFilter} />
                    
                    <Text style={styles.result}>{pagination.size} results</Text>

                    <View style={styles.list}>
                        {option === 'product' && products && products.length > 0 && 
                            <List
                                navigation={navigation}
                                type='product'
                                items={products}
                                loadMore={loadMore}
                                isRefreshing={isRefreshing}
                            />}
                        {option === 'store' && stores && stores.length > 0 && 
                            <List
                                navigation={navigation}
                                type='store'
                                items={stores}
                                loadMore={loadMore}
                                isRefreshing={isRefreshing}
                            />}
                        {option === 'user' && users && users.length > 0 && 
                            <List
                                navigation={navigation}
                                type='user'
                                items={users}
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
        padding: 0,
    },
    inputContainer: {
        height: 32,
        borderTopLeftRadius: 16,
        borderBottomLeftRadius: 16,
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
    resultsContainer: {
        position: 'relative',
        flex: 1,
    },
    result: {
        fontSize: 16,
        color: Colors.black,
        marginTop: 6,
    },
    list: {
        flex: 1,
    },
});

export default Search;