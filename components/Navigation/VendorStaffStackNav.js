import React from 'react';
import { StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Colors from '../../themes/Colors';
import VendorStaff from '../../screens/vendor/VendorStaff';
import VendorStaffAdd from '../../screens/vendor/VendorStaffAdd';

const VendorStaffStack = createNativeStackNavigator();

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

export default VendorStaffStackScreen;