import React from 'react';
import { StyleSheet } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import CustomDrawer from './CustomDrawer ';
import Icon from 'react-native-vector-icons/Ionicons';
import VendorHome from '../../screens/VendorHome';
import VendorProfile from '../../screens/VendorProfile';
import VendorProductStackScreen from './VendorProductStackNav';
import VendorStaffStackScreen from './VendorStaffStackNav';
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
        }}
      />
      <Drawer.Screen
        name="VendorProfile"
        component={VendorProfile}
        options={{
          drawerIcon: ({color}) => (
            <Icon name="person" size={22} color={color} />
          ),
          title: "Profile",
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
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  screen: {
    // headerShown: false,
    drawerActiveBackgroundColor: Colors.primary,
    drawerActiveTintColor: Colors.white,
    drawerInactiveTintColor: Colors.muted,
    drawerLabelStyle: {
      marginLeft: -25,
      fontSize: 15,
    },
  },
});

export default VendorDrawer;