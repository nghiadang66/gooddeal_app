import React, { useState, useEffect, useContext } from "react";
import { View, Text, StyleSheet } from 'react-native';
import { AuthContext } from "../context/AuthContext";
import { listFollowingProducts } from "../services/follow";

const FollowingProduct = (props) => {
    const [products, setProducts] = useState([]);
    const [pagination, setPagination] = useState({
        size: 0,
    });
    const [filter, setFilter] = useState({
        search: '',
        sortBy: '_id',
        order: 'desc',
        limit: 6,
        page: 1,
    });

    const { jwt } = useContext(AuthContext);

    const getProducts = async () => {
        try {
            const data = await listFollowingProducts(jwt._id, jwt.accessToken, filter);
            setProducts(data.products);
            setPagination({
                size: data.size,
                pageCurrent: data.filter.pageCurrent,
                pageCount: data.filter.pageCount,
            });
        } catch (err) { }
    }

    useEffect(() => {
        getProducts();
    }, [filter]);

    return (
        <View style={styles.container}>
            <Text style={styles.text}>There are {products.length} following products in page 1.</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 16,
    },
});

export default FollowingProduct;