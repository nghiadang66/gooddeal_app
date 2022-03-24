import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import { AuthContext } from '../context/AuthContext';
import { HomeStackScreen, AccountStackScreen, VendorStackScreen } from './StackNav';
import { FollowTabScreen } from './TopTabNav';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../themes/Colors';

const Tab = createBottomTabNavigator();

const TabNav = () => {
    const { jwt } = useContext(AuthContext);

    return (
        <NavigationContainer>
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ focused, color, size }) => {
                      let iconName;
          
                      if (route.name === 'Home') {
                        iconName = focused ? 'home' : 'home-outline';
                      }
                      else if (route.name === 'Account') {
                        iconName = focused ? 'person' : 'person-outline';
                      }
                      else if (route.name === 'Following') {
                        iconName = focused ? 'heart' : 'heart-outline';
                      }
                      else if (route.name === 'Vendor') {
                        iconName = focused ? 'glasses' : 'glasses-outline';
                      }

                      return <Icon name={iconName} size={size} color={color} />;
                    },
                    tabBarActiveTintColor: Colors.primary,
                    tabBarInactiveTintColor: Colors.muted,
                    tabBarHideOnKeyboard: true,
                })}
            >
                <Tab.Screen
                    name="Home"
                    component={HomeStackScreen}
                    options={{
                        headerShown: false,
                    }}
                />

                {jwt.accessToken && (
                    <Tab.Screen
                        name="Account"
                        component={AccountStackScreen}
                        options={{
                            headerShown: false,
                        }}
                    />
                )}

                {jwt.accessToken && jwt.role === 'user' && (
                    <Tab.Screen
                        name="Following"
                        component={FollowTabScreen}
                        options={{
                            headerShown: false,
                        }}
                    />
                )}

                {jwt.accessToken && jwt.role === 'user' && (
                    <Tab.Screen
                        name="Vendor"
                        component={VendorStackScreen}
                        options={{
                            headerShown: false,
                        }}
                    />
                )}
            </Tab.Navigator>
        </NavigationContainer>
    );
}

export default TabNav;