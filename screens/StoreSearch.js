import React, { useState, useEffect, useContext } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { getStore as getStoreAPi } from '../services/store';
import { AuthContext } from '../context/AuthContext';
import Slider from '../components/Slider/Slider';
import Alert from '../components/Other/Alert';
import Spinner from '../components/Other/Spinner';
import Link from '../components/Other/Link';
import SmallCard from '../components/Card/SmallCard';
import ListRecommend from '../components/List/ListRecommend';
import Colors from '../themes/Colors';

const StoreSearch = ({ navigation, route }) => {
    const [store, setStore] = useState();
    const [storeImages, setStoreImages] = useState();

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);

    const { jwt } = useContext(AuthContext);

    const getStore = () => {
        setError(false);
        setIsLoading(true);
        getStoreAPi(route.params.storeId)
            .then(data => {
                setStore(data.store);
                setStoreImages(data.store.featured_images);
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
                <ScrollView>
                    {store && (
                        <>
                            <Text>{store._id}</Text>
                        </>
                    )}
                </ScrollView>
            )}

            {isLoading && <Spinner />}
            {error && <Alert type={'error'} />}
        </>
    );
}

const styles = StyleSheet.create({

});

export default StoreSearch;