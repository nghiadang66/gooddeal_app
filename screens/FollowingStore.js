import React, { useState, useEffect, useContext } from "react";
import { View, Text, StyleSheet } from 'react-native';
import { AuthContext } from "../context/AuthContext";
import { listFollowingStores } from "../services/follow";

const FollowingStore = (props) => {
    const [stores, setStores] = useState([]);
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

    const getStores = async () => {
        try {
            const data = await listFollowingStores(jwt._id, jwt.accessToken, filter);
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
            <Text style={styles.text}>There are {stores.length} following stores.</Text>
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

export default FollowingStore;