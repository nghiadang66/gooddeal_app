import React from 'react';
import { StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Colors from '../../themes/Colors';
import VendorProduct from '../../screens/vendor/VendorProduct';
import VendorProductAdd from '../../screens/vendor/VendorProductAdd';
import VendorProductEdit from '../../screens/vendor/VendorProductEdit';

const VendorProductStack = createNativeStackNavigator();

const VendorProductStackScreen = () => {
    return (
        <VendorProductStack.Navigator
            headerMode="screen"
            screenOptions={styles.screen}
        >
            <VendorProductStack.Screen
                name="ManageProduct"
                component={VendorProduct}
                options={{ headerShown: false }}
            />
            <VendorProductStack.Screen
                name="AddProduct"
                component={VendorProductAdd}
                options={{ headerShown: false }}
            />
            <VendorProductStack.Screen
                name="EditProduct"
                component={VendorProductEdit}
                options={{ headerShown: false }}
            />
        </VendorProductStack.Navigator>
    );
}

const styles = StyleSheet.create({
    screen: {
        headerStyle: {
            backgroundColor: Colors.primary,
        },
        headerTintColor: Colors.white,
        headerTitleStyle: {
            fontWeight: 'bold',
        },
        headerTitleAlign: 'center',
    },
});

export default VendorProductStackScreen;