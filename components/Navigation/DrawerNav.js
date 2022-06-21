import React from 'react';
import { StyleSheet } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import CustomDrawer from './CustomDrawer ';
import Icon from 'react-native-vector-icons/Ionicons';
import VendorHome from '../../screens/vendor/VendorHome';
import {
  VendorProfileStackScreen,
  VendorOrderStackScreen,
  VendorProductStackScreen, 
  VendorStaffStackScreen,
  VendorCoinStackScreen,
} from './VendorStackNav';
import Colors from '../../themes/Colors';

const Drawer = createDrawerNavigator();

const VendorDrawer = () => {
  return (
    <Drawer.Navigator
      useLegacyImplementation
      drawerContent={props => <CustomDrawer {...props} />}
      screenOptions={styles.screen}
    >
      <Drawer.Screen
        name="Dashboard"
        component={VendorHome}
        options={{
          drawerIcon: ({color}) => (
            <Icon name="pie-chart" size={22} color={color} />
          ),
          headerTitle: "Vendor Dashboard",
        }}
      />
      <Drawer.Screen
        name="VendorProfileStackScreen"
        component={VendorProfileStackScreen}
        options={{
          drawerIcon: ({color}) => (
            <Icon name="person" size={22} color={color} />
          ),
          title: "Profile",
        }}
      />
      <Drawer.Screen
        name="VendorOrderStackScreen"
        component={VendorOrderStackScreen}
        options={{
          drawerIcon: ({color}) => (
            <Icon name="clipboard" size={22} color={color} />
          ),
          title: "Order",
        }}
      />
      <Drawer.Screen
        name="VendorProductStackNav"
        component={VendorProductStackScreen}
        options={{
          drawerIcon: ({color}) => (
            <Icon name="cube" size={22} color={color} />
          ),
          title: "Product",
        }}
      />
      <Drawer.Screen
        name="VendorStaffStackNav"
        component={VendorStaffStackScreen}
        options={{
          drawerIcon: ({color}) => (
            <Icon name="people" size={22} color={color} />
          ),
          title: "Staff",
        }}
      />
      <Drawer.Screen
        name="VendorCoinStackNav"
        component={VendorCoinStackScreen}
        options={{
          drawerIcon: ({color}) => (
            <Icon name="wallet" size={22} color={color} />
          ),
          title: "E-Wallet",
        }}
      />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  screen: {
    drawerActiveBackgroundColor: Colors.primary,
    drawerActiveTintColor: Colors.white,
    drawerInactiveTintColor: Colors.muted,
    drawerLabelStyle: {
      marginLeft: -25,
      fontSize: 15,
    },
    headerStyle: {
      backgroundColor: Colors.primary,
    },
    headerTitleStyle: {
      color: Colors.white,
    },
    headerTintColor: Colors.white,
  },
});

export default VendorDrawer;