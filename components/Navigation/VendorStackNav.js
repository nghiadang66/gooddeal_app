import React from 'react';
import { StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Colors from '../../themes/Colors';
import VendorProfile from '../../screens/vendor/VendorProfile';
import VendorChangeProfile from '../../screens/vendor/VendorChangeProfile';
import VendorEditProfile from '../../screens/vendor/VendorEditProfile';
import VendorJoined from '../../screens/vendor/VendorJoined';
import VendorLevel from '../../screens/vendor/VendorLevel';
import VendorProduct from '../../screens/vendor/VendorProduct';
import VendorProductAdd from '../../screens/vendor/VendorProductAdd';
import VendorProductEdit from '../../screens/vendor/VendorProductEdit';
import VendorStaff from '../../screens/vendor/VendorStaff';
import VendorStaffAdd from '../../screens/vendor/VendorStaffAdd';
import VendorCoin from '../../screens/vendor/VendorCoin';
import VendorWithdraw from '../../screens/vendor/VendorWithdraw';

const VendorProfileStack = createNativeStackNavigator();
const VendorProductStack = createNativeStackNavigator();
const VendorStaffStack = createNativeStackNavigator();
const VendorCoinStack = createNativeStackNavigator();

const VendorProfileStackScreen = () => {
    return (
        <VendorProfileStack.Navigator
            headerMode="screen"
            screenOptions={styles.screen}
        >
            <VendorProfileStack.Screen
                name="VendorProfile"
                component={VendorProfile}
                options={{ headerShown: false }}
            />
            <VendorProfileStack.Screen
                name="VendorChangeProfile"
                component={VendorChangeProfile}
                options={{ headerShown: false }}
            />
            <VendorProfileStack.Screen
                name="VendorEditProfile"
                component={VendorEditProfile}
                options={{ headerShown: false }}
            />
            <VendorProfileStack.Screen
                name="VendorJoined"
                component={VendorJoined}
                options={{ headerShown: false }}
            />
            <VendorProfileStack.Screen
                name="VendorLevel"
                component={VendorLevel}
                options={{ headerShown: false }}
            />
        </VendorProfileStack.Navigator>
    );
}

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

const VendorStaffStackScreen = () => {
    return (
        <VendorStaffStack.Navigator
            headerMode="screen"
            screenOptions={styles.screen}
        >
            <VendorStaffStack.Screen
                name="ManageStaff"
                component={VendorStaff}
                options={{ headerShown: false }}
            />
            <VendorStaffStack.Screen
                name="AddStaff"
                component={VendorStaffAdd}
                options={{ headerShown: false }}
            />
        </VendorStaffStack.Navigator>
    );
}

const VendorCoinStackScreen = () => {
    return (
        <VendorCoinStack.Navigator
            headerMode="screen"
            screenOptions={styles.screen}
        >
            <VendorCoinStack.Screen
                name="VendorCoin"
                component={VendorCoin}
                options={{ headerShown: false }}
            />
            <VendorCoinStack.Screen
                name="VendorWithdraw"
                component={VendorWithdraw}
                options={{ headerShown: false }}
            />
        </VendorCoinStack.Navigator>
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

export { VendorProfileStackScreen, VendorProductStackScreen, VendorStaffStackScreen, VendorCoinStackScreen };