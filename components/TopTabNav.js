import React from 'react';
import { StyleSheet } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import FollowingProduct from '../screens/FollowingProduct';
import FollowingStore from '../screens/FollowingStore';
import Colors from '../themes/Colors';

const FollowTab = createMaterialTopTabNavigator();

const FollowTabScreen = () => {
  return (
    <FollowTab.Navigator
        initialRouteName="FollowingProduct"
        headerMode="screen"
        screenOptions={styles.screen}
    >
        <FollowTab.Screen 
            name="FollowingProduct" 
            component={FollowingProduct}
            options={{ tabBarLabel: 'Following Products' }}
        />
        <FollowTab.Screen 
            name="FollowingStore" 
            component={FollowingStore} 
            options={{ tabBarLabel: 'Following Stores' }}
        />
    </FollowTab.Navigator>
  );
}

const styles = StyleSheet.create({
    screen: {
        tabBarActiveTintColor: Colors.white,
        tabBarStyle: {
          backgroundColor: Colors.primary,
          height: 64,
          justifyContent: 'center',
        },
        tabBarLabelStyle: {
          textAlign: 'center',
          fontWeight: 'bold',
          textTransform: 'none',
          fontSize: 16,
        },
        tabBarIndicatorStyle: {
          borderBottomColor: Colors.white,
          borderBottomWidth: 3,
        },
    },
});

export { FollowTabScreen };