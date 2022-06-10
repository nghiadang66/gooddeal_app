import React from 'react';
import { StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Colors from '../../themes/Colors';
import VendorProfile from '../../screens/VendorProfile';
import VendorEditProfile from '../../screens/VendorEditProfile';

const VendorProfileStack = createNativeStackNavigator();

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
                name="VendorEditProfile"
                component={VendorEditProfile}
                options={{ headerShown: false }}
            />
        </VendorProfileStack.Navigator>
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

export default VendorProfileStackScreen;