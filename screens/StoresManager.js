import React, { useState, useEffect, useContext } from "react";
import { View, Text, StyleSheet } from 'react-native';
import { AuthContext } from "../context/AuthContext";
import { listStoresByUser } from '../services/store';

const StoresManager = (props) => {
    const [stores, setStores] = useState([]);
    const [pagination, setPagination] = useState({
        size: 0,
    });
    const [filter, setFilter] = useState({
        search: '',
        sortBy: 'name',
        sortMoreBy: 'rating',
        order: 'asc',
        limit: 6,
        page: 1,
    });
    
    const { jwt } = useContext(AuthContext);

    const getStores = async () => {
        try {
            const data = await listStoresByUser(jwt._id, jwt.accessToken, filter);
            setStores(data.stores);
            setPagination({
                size: data.size,
                pageCurrent: data.filter.pageCurrent,
                pageCount: data.filter.pageCount,
            });
        } catch (err) { }
    }

    useEffect(() => {
        getStores();
    }, [filter]);

    return (
        <View style={styles.container}>
            <Text style={styles.text}>You own {stores.length} stores in page 1.</Text>
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

export default StoresManager;