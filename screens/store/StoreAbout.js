import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, StyleSheet } from 'react-native';
import { getStore as getStoreAPi } from '../../services/store';
import { humanReadableDate } from '../../helper/humanReadable';
import Alert from '../../components/Other/Alert';
import Spinner from '../../components/Other/Spinner';
import Colors from '../../themes/Colors';

const StoreAbout = ({ navigation, route }) => {
    const [store, setStore] = useState({});

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);

    const getStore = () => {
        setError(false);
        setIsLoading(true);
        getStoreAPi(route.params.storeId)
            .then(data => {
                setStore(data.store);
            })
            .catch((error) => {
                setError(true);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }

    useEffect(() => {
        getStore();
    }, [route.params.storeId]);

    return (
        <>
            {!isLoading && !error && (
                <ScrollView style={styles.container}>
                    <View style={styles.wrapper}>
                        <Text style={styles.title}>Name</Text>
                        <Text style={styles.content}>
                            {store.name}
                        </Text>
                    </View>

                    <View style={styles.wrapper}>
                        <Text style={styles.title}>Bio</Text>
                        <Text style={styles.content}>
                            {store.bio}
                        </Text>
                    </View>

                    <View style={styles.wrapper}>
                        <Text style={styles.title}>Bussiness Type</Text>
                        <Text style={styles.content}>
                            {store.commissionId && store.commissionId.name && store.commissionId.name.charAt(0).toUpperCase() + store.commissionId.name.slice(1)}
                            {' ('}
                            {store.commissionId && store.commissionId.cost && store.commissionId.cost.$numberDecimal}
                            {'%/order)'}
                        </Text>
                    </View>

                    <View style={styles.wrapper}>
                        <Text style={styles.title}>Joined At</Text>
                        <Text style={styles.content}>
                            {humanReadableDate(store.createdAt)}
                        </Text>
                    </View>
                </ScrollView>
            )}

            {isLoading && <Spinner />}
            {error && <Alert type={'error'} />}
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
        padding: 12,
    },
    wrapper: {
        marginBottom: 12,
    },
    title: {
        color: Colors.primary,
    },
    content: {
        fontSize: 16,
        paddingVertical: 6,
    },
});

export default StoreAbout;