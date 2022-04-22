import React from 'react';
import { StyleSheet } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Following from '../../screens/Following';
import StoreHome from '../../screens/StoreHome';
import StoreSearch from '../../screens/StoreSearch';
import StoreAbout from '../../screens/StoreAbout';
import Colors from '../../themes/Colors';

const FollowTab = createMaterialTopTabNavigator();
const StoreTab = createMaterialTopTabNavigator();

const FollowTabScreen = () => {
  return (
    <FollowTab.Navigator
        initialRouteName="FollowingProduct"
        headerMode="screen"
        screenOptions={styles.screen}
    >
        <FollowTab.Screen 
            name="FollowingProduct"
            options={{ tabBarLabel: 'Following Products' }}
        >
          {props => <Following {...props} type='product' />}
        </FollowTab.Screen>
        <FollowTab.Screen 
            name="FollowingStore"
            options={{ tabBarLabel: 'Following Stores' }}
        >
          {props => <Following {...props} type='store' />}
        </FollowTab.Screen>
    </FollowTab.Navigator>
  );
}

const StoreTabScreen = ({ parRoute }) => {
  return (
    <StoreTab.Navigator
        initialRouteName="StoreHome"
        headerMode="screen"
        screenOptions={styles.screen}
    >
        <StoreTab.Screen 
            name="Home"
        >
          {(props) => <StoreHome {...props} route={parRoute} />}
        </StoreTab.Screen>
        <StoreTab.Screen 
            name="Products"
        >
          {(props) => <StoreSearch {...props} route={parRoute} />}
        </StoreTab.Screen>
        <StoreTab.Screen 
            name="About"
        >
          {(props) => <StoreAbout {...props} route={parRoute} />}
        </StoreTab.Screen>
    </StoreTab.Navigator>
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

export { FollowTabScreen, StoreTabScreen };