import React, { useState, useEffect, useContext } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { getStore as getStoreAPi } from '../../services/store';
import { AuthContext } from '../../context/AuthContext';
import Slider from '../../components/Slider/Slider';
import Alert from '../../components/Other/Alert';
import Spinner from '../../components/Other/Spinner';
import ListRecommend from '../../components/List/ListRecommend';
import Colors from '../../themes/Colors';

const StoreHome = ({ navigation, route }) => {
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
                            {storeImages && storeImages.length > 0 && (
                                <View style={styles.slider}>
                                    <Slider images={storeImages}/>
                                </View>
                            )}

                            <View style={styles.carousel}>
                                <ListRecommend
                                    type='product'
                                    title='Best Seller'
                                    sortBy='sold'
                                    storeId={store._id}
                                    navigation={navigation}
                                />
                            </View>

                            <View style={styles.carousel}>
                                <ListRecommend
                                    type='product'
                                    title='New Products'
                                    sortBy='createdAt'
                                    storeId={store._id}
                                    navigation={navigation}
                                />
                            </View>
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
    slider: {
        flex: 1,
        marginBottom: 16,
        backgroundColor: Colors.white,
    },
    carousel: {
        flex: 1,
        marginBottom: 16,
        backgroundColor: Colors.white,
        borderRadius: 3,
    },
});

export default StoreHome;