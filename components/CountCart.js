import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from 'react-native';
import { getCartCount } from '../services/cart';
import Colors from "../themes/Colors";

const CountCart = ({ userId, token }) => {
    const [count, setCount] = useState(0);

    const getCount = async () => {
        try {
            const data =  await getCartCount(userId, token);
            setCount(data.count);
        } catch (err) { }
    }

    useEffect(() => {
        getCount();
        return () => {
            setCount(0);
        };
    }, [userId, token]);

    return (
        <View style={styles.container}>
            <Text style={styles.cart}>{count > 9 ? '9+' : count}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        right: 0,
        zIndex: 2,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.danger,
        paddingHorizontal: 6,
        borderRadius: 6,
    },
    cart: {
        fontSize: 12,
        fontWeight: 'bold',
        color: Colors.white,
    },  
});

export default CountCart;