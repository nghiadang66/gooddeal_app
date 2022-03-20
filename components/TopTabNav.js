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
        tabBarOptions={styles.tab}
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
    tab: {
        activeTintColor: Colors.white,
        style: {
          backgroundColor: Colors.primary,
          height: 64,
          justifyContent: 'center',
        },
        labelStyle: {
          textAlign: 'center',
          fontWeight: 'bold',
          fontSize: 13,
        },
        indicatorStyle: {
          borderBottomColor: Colors.white,
          borderBottomWidth: 3,
        },
    },
});

export { FollowTabScreen };