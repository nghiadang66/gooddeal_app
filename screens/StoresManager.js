import React, { useState, useEffect, useContext } from "react";
import { View, Text, StyleSheet } from 'react-native';
import { AuthContext } from "../context/AuthContext";
import { listStoresByUser } from '../services/store';
import List from '../components/List/List';
import Alert from '../components/Other/Alert';
import Spinner from '../components/Other/Spinner';
import Colors from '../themes/Colors';
import FloatBtn from "../components/Button/FloatBtn";
import { useIsFocused } from "@react-navigation/core";

const StoresManager = ({ navigation }) => {
    const isFocused = useIsFocused();

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
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState(false);
    
    const { jwt } = useContext(AuthContext);

    const getStores = () => {
        setError(false);
        if (filter.page === 1) setIsLoading(true);
        else setIsRefreshing(true);
        listStoresByUser(jwt._id, jwt.accessToken, filter)
            .then(data => {
                if (data.filter.pageCurrent === 1)
                    setStores(data.stores);
                else 
                    setStores([
                        ...stores,
                        ...data.stores,
                    ]);
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
        getStores();
    }, [filter, isFocused]);

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
            <FloatBtn
                onPress={() => navigation.navigate('CreateStore')}
            />
            {!isLoading && !error && (
                <>
                    <Text style={styles.result}>{pagination.size} results</Text>
                    <View style={styles.list}>
                        {stores && stores.length > 0 && 
                            <List
                                navigation={navigation}
                                type={'vendor'}
                                items={stores}
                                loadMore={loadMore}
                                isRefreshing={isRefreshing}
                            />}
                    </View>
                </>
            )}
            
            {isLoading && <Spinner />}
            {error && <Alert type={'error'} />}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
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

export default StoresManager;