import React, { useState, useEffect, useContext } from "react";
import { View, StyleSheet } from 'react-native';
import { AuthContext } from "../context/AuthContext";
import { listFollowingProducts, listFollowingStores } from "../services/follow";
import WishList from '../components/List/WishList';
import { useIsFocused } from "@react-navigation/core";

const fetchFuncs = {
    'product': listFollowingProducts,
    'store': listFollowingStores,
}

const Following = ({ navigation, type }) => {
    const isFocused = useIsFocused();

    const [option, setOptions] = useState('product');
    const [items, setItems] = useState([]);
    const [pagination, setPagination] = useState({
        size: 0,
    });
    const [filter, setFilter] = useState({
        search: '',
        sortBy: '_id',
        order: 'desc',
        limit: 9,
        page: 1,
    });
    const [isRefreshing, setIsRefreshing] = useState(false);

    const { jwt } = useContext(AuthContext);

    const getItems = async () => {
        setIsRefreshing(true);
        try {
            const data = await fetchFuncs[option](jwt._id, jwt.accessToken, filter);
            if (data.filter.pageCurrent === 1) {
                setItems(data[option+'s']);
            }
            else {
                setItems([...products, ...data[option+'s']]);
            }
            setPagination({
                size: data.size,
                pageCurrent: data.filter.pageCurrent,
                pageCount: data.filter.pageCount,
            });
        } catch (err) { }
        setIsRefreshing(false);
    }

    useEffect(() => {
        getItems();
    }, [filter, jwt]);

    useEffect(() => {
        setOptions(type);
        if (isFocused) {
            setFilter({
                search: '',
                sortBy: '_id',
                order: 'desc',
                limit: 9,
                page: 1,
            });
        }
    }, [isFocused, type]);

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
            {items && items.length > 0 && (
                <WishList
                    navigation={navigation}
                    type={option}
                    items={items}
                    loadMore={loadMore}
                    isRefreshing={isRefreshing}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 5,
    },
});

export default Following;