import React, { useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '../../screens/Home';
import Profile from '../../screens/Profile';
import StoresManager from '../../screens/StoresManager';
import { FollowTabScreen } from './TopTabNav';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../../themes/Colors';
import HomeNav from '../Navbar/HomeNav';
import PerNav from '../Navbar/PerNav';
import { AuthContext } from '../../context/AuthContext';

const Tab = createBottomTabNavigator();

const BottomTabNav = () => {
    const { jwt } = useContext(AuthContext);
    return (
        <Tab.Navigator
            initialRouteName="Home"
            activeColor={Colors.primary}
            inactiveColor={Colors.muted}
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
                tabBarHideOnKeyboard: true,
            })}
        >
            <Tab.Screen
                name="Home"
                component={Home}
                options={{
                    headerTransparent: true,
                    header: ({ navigation }) => (
                        <HomeNav navigation={navigation} />
                    ),
                }}
            />

            {jwt.accessToken && jwt.role === 'user' && (
                <Tab.Screen
                    name="Following"
                    component={FollowTabScreen}
                    options={{
                        headerShown: false,
                    }}
                />
            )}

            {jwt.accessToken && (
                <Tab.Screen
                    name="Account"
                    component={Profile}
                    options={{
                        headerTransparent: true,
                        header: ({ navigation, route }) => (
                            <PerNav navigation={navigation} route={route} />
                        ),
                    }}
                />
            )}

            {jwt.accessToken && jwt.role === 'user' && (
                <Tab.Screen
                    name="Vendor"
                    component={StoresManager}
                    options={{
                        title: 'Stores Manager',
                        headerStyle: {
                            backgroundColor: Colors.primary,
                        },
                        headerTintColor: Colors.white,
                        headerTitleStyle: {
                            fontWeight: 'bold',
                        },
                        headerTitleAlign: 'center',
                    }}
                />
            )}
        </Tab.Navigator>
    );
}

export default BottomTabNav;