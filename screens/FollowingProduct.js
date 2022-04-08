import React, { useState, useEffect, useContext } from "react";
import { View, StyleSheet } from 'react-native';
import { AuthContext } from "../context/AuthContext";
import { listFollowingProducts } from "../services/follow";
import WishList from '../components/WishList';
import { useIsFocused } from "@react-navigation/core";

const FollowingProduct = ({ navigation }) => {
    const isFocused = useIsFocused();

    const [products, setProducts] = useState([]);
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

    const getProducts = async () => {
        setIsRefreshing(true);
        try {
            const data = await listFollowingProducts(jwt._id, jwt.accessToken, filter);
            if (data.filter.pageCurrent === 1) {
                setProducts(data.products);
            }
            else {
                setProducts([...products, ...data.products]);
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
        getProducts();
    }, [filter, jwt]);

    useEffect(() => {
        if (isFocused) {
            setFilter({
                search: '',
                sortBy: '_id',
                order: 'desc',
                limit: 9,
                page: 1,
            });
        }
    }, [isFocused]);

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
            {products && products.length > 0 && (
                <WishList
                    navigation={navigation}
                    type='product'
                    items={products}
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

export default FollowingProduct;