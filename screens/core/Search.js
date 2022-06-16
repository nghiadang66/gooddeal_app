import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { listActiveProducts } from '../../services/product';
import { getlistStores } from '../../services/store';
import { getlistUsers } from '../../services/user';
import { SearchBar } from 'react-native-elements';
import { BackBtn } from '../../components/Button/HeaderBtn';
import List from '../../components/List/List'; 
import Filter from '../../components/Filter/Filter';
import Alert from '../../components/Other/Alert';
import Spinner from '../../components/Other/Spinner';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../../themes/Colors';

const fetchFuncs = {
    'product': listActiveProducts,
    'store': getlistStores,
    'user': getlistUsers,
}

const filters = {
    'product': {
        rating: '',
        minPrice: 0,
        maxPrice: '',
        sortBy: 'sold',
        order: 'desc',
        categoryId: '',
        limit: 4,
        page: 1,
    },
    'store': {
        sortBy: 'rating',
        sortMoreBy: 'point',
        isActive: 'true',
        order: 'desc',
        limit: 4,
        page: 1,
    },
    'user': {
        sortBy: 'point',
        role: 'customer',
        order: 'desc',
        limit: 4,
        page: 1,
    },
}

const Search = ({ navigation }) => {
    const [results, setResults] = useState();

    const [keyword, setKeyword] = useState('');
    const [option, setOption] = useState('product');
    const [pagination, setPagination] = useState({ size: 0 });
    const [filter, setFilter] = useState(filters[option]);

    const [error, setError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const typingTimeoutRef = useRef(null);

    const getFilter = () => {
        setPagination({ size: 0 });
        setFilter({
            search: keyword,
            ...filters[option]
        });
    }

    const getResults = () => {
        setError(false);
        if (filter.page === 1) setIsLoading(true);
        else setIsRefreshing(true);
        fetchFuncs[option](filter)
            .then(data => {
                // console.log(data);
                if (data.filter.pageCurrent === 1) {
                    setResults(data[option+'s']);
                } else {
                    setResults([
                        ...results,
                        ...data[option+'s'],
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
        getFilter();
    }, [option])

    useEffect(() => {
        getResults();
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
                <BackBtn navigation={navigation} />
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
                        mode='dialog'
                        prompt='Select search option'
                        onValueChange={(itemValue, itemIndex) => setOption(itemValue)}
                    >
                        <Picker.Item label="product" value="product" />
                        <Picker.Item label="store" value="store" />
                        <Picker.Item label="user" value="user" />
                    </Picker>
                </View>
            </View>
            <View style={styles.resultsContainer}>
                {option === 'product' && (
                    <Filter filter={filter} setFilter={setFilter} />
                )}
                {!isLoading && !error && (
                    <>
                        <Text style={styles.result}>{pagination.size} results</Text>
                        <View style={styles.list}>
                            {results && results.length > 0 && 
                                <List
                                    navigation={navigation}
                                    type={option}
                                    items={results}
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
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.primary,
        height: 64,
        paddingVertical: 12,
        paddingHorizontal: 12,
    },
    searchBarContainer: {
        flex: 1,
        backgroundColor: Colors.primary,
        borderTopWidth: 0,
        borderBottomWidth: 0,
        padding: 0,
        marginLeft: 6,
    },
    inputContainer: {
        height: 32,
        borderTopLeftRadius: 16,
        borderBottomLeftRadius: 16,
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
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
    resultsContainer: {
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

export default Search;