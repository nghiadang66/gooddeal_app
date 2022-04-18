import React, { useContext } from "react";
import { View, Text, StyleSheet } from 'react-native';
import { AuthContext } from "../../context/AuthContext";
import Colors from "../../themes/Colors";

const CountCart = (props) => {
    const { countCart } = useContext(AuthContext);
    return (
        <View style={styles.container}>
            <Text style={styles.cart}>{countCart > 9 ? '9+' : countCart}</Text>
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