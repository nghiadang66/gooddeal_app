import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { addToCart } from '../../services/cart';
import { AuthContext } from '../../context/AuthContext';
import Select from './Select';
import Button from '../Button/Button';
import Alert from '../Other/Alert';
import Icon from 'react-native-vector-icons/Ionicons';
import Spinner from 'react-native-loading-spinner-overlay';
import Colors from '../../themes/Colors';

const AddToCart = ({ product = {}, navigation }) => {
    const [cartItem, setCartItem] = useState();
    const [styleListArray, setStyleListArray] = useState();

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);

    const { jwt, resetCountCart } = useContext(AuthContext);

    useEffect(() => {
        let defaultList = [];
        product.styleValueIds &&
            product.styleValueIds.forEach((value) => {
                let flag = true;
                defaultList.forEach((list) => {
                    if (value.styleId._id === list[0].styleId._id) {
                        list.push(value);
                        flag = false;
                    }

                    list.sort((a, b) => {
                        const nameA = a.name.toUpperCase();
                        const nameB = b.name.toUpperCase();
                        if (nameA < nameB) return -1;
                        if (nameA > nameB) return 1;
                        return 0;
                    });
                });

                if (flag) defaultList.push([value]);
            });

        const defaultStyleValueIds = defaultList
            .map((list) => list[0])
            .map((value) => value._id)
            .join('|');

        setStyleListArray(defaultList);
        setCartItem({
            storeId: product.storeId && product.storeId._id,
            productId: product._id,
            styleValueIds: defaultStyleValueIds,
            count: 1,
        });
    }, [product]);

    const handleChange = (oldId, newId) => {
        const newArray = cartItem.styleValueIds.split('|');
        const index = newArray.indexOf(oldId);
        if (index !== -1) newArray.splice(index, 1, newId);
        else newArray.push(newId);
        setCartItem({
            ...cartItem,
            styleValueIds: newArray.join('|'),
        });
    }

    const handleSubmit = () => {
        setError(false);
        setSuccess(false);
        setIsLoading(true);
        addToCart(jwt._id, jwt.accessToken, cartItem)
            .then(data => {
                if (data.error) setError(data.error);
                else {
                    setSuccess(data.success);
                    resetCountCart(jwt._id, jwt.accessToken);
                }
            })
            .catch(error => {
                setError('Server Error');
            })
            .finally(() => {
                setTimeout(() => {
                    setError('');
                    setSuccess('');
                }, 3000);
                setIsLoading(false);
            });
    }

    return (
        <View style={styles.container}>
            <Spinner visible={isLoading} />

            {styleListArray && styleListArray.map((styleList, index) => (
                <View key={index} style={styles.select}>
                    <Select
                        values={styleList}
                        selectedValue={styleList[0]._id}
                        onChange={(o, n) => handleChange(o, n)}
                    />
                </View>
            ))}

            <View style={styles.btn}>
                {error ? <Alert type='error' content={error} /> : null}
                {success ? <Alert type='success' content={success} /> : null}

            {jwt && jwt.accessToken ? (
                <Button
                    title={<Icon name={'cart'} style={styles.icon} />}
                    onPress={handleSubmit}
                />
            ) : (
                <Button
                    title={<Icon name={'log-in'} style={styles.icon} />}
                    onPress={() => navigation.navigate('SignIn')}
                />
            )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    select: {
        marginBottom: 12,
    },
    icon: {
        fontSize: 26,
        color: Colors.white, 
    },
    btn: {
        marginTop: 12,
    }
});

export default AddToCart;