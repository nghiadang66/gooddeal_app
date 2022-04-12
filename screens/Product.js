import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Dimensions, StyleSheet } from 'react-native';
import { getProduct as getProductAPi } from '../services/product';
import { AuthContext } from '../context/AuthContext';
import Button from '../components/Button';
import Alert from '../components/Alert';
import Spinner from '../components/Spinner';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../themes/Colors';

const Product = ({ navigation, route }) => {
    const [product, setProduct] = useState();

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);

    const getProduct = () => {
        setError(false);
        setIsLoading(true);
        getProductAPi(route.params.productId)
            .then(data => {
                setProduct(data.product)
            })
            .catch((error) => {
                setError(true);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }

    useEffect(() => {
        getProduct();
    }, [route.params.productId]);

    return (
        <View style={styles.container}>
            {!isLoading && !error && (
                <Text>{product && product.name}</Text>
            )}

            {isLoading && <Spinner />}
            {error && <Alert type={'error'} />}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
});

export default Product;