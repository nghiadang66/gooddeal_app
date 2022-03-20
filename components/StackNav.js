import React, { useContext } from 'react';
import { StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import Colors from '../themes/Colors';
import Splash from '../screens/Splash';
import Home from '../screens/Home';
import SignIn from '../screens/SignIn';
import SignUp from '../screens/SignUp';
import Profile from '../screens/Profile';
import StoresManager from '../screens/StoresManager';
import MainNav from './MainNav';
import AccountNav from './AccountNav';
import { AuthContext } from '../context/AuthContext';

const HomeStack = createStackNavigator();
const AccountStack = createStackNavigator();
const VendorStack = createStackNavigator();

const HomeStackScreen = () => {
    const { jwt, splashLoading } = useContext(AuthContext);

    return (
        <HomeStack.Navigator
            initialRouteName="Home"
            headerMode="screen"
            screenOptions={styles.screen}
        >
            {splashLoading ? (
                <HomeStack.Screen 
                name="Splash"
                component={Splash}
                options={{
                    headerTransparent: true,
                }}  
            />
            ) : (
                <>
                    <HomeStack.Screen 
                        name="Home"
                        component={Home}
                        options={{
                            headerTransparent: true,
                            header: ({ navigation }) => (
                                <MainNav navigation={navigation} />
                            ),
                        }}  
                    />

                    {!jwt.accessToken && (
                        <HomeStack.Screen 
                            name="SignIn"
                            component={SignIn}
                            options={{
                                title: 'SIGN IN',
                            }} 
                        />
                    )}

                    {!jwt.accessToken && (
                        <HomeStack.Screen 
                            name="SignUp"
                            component={SignUp}
                            options={{
                                title: 'SIGN UP',
                            }} 
                        />
                    )}
                </>
            )}
            
        </HomeStack.Navigator>
    );
}

const AccountStackScreen = () => {
    const { jwt, splashLoading } = useContext(AuthContext);

    return (
        <AccountStack.Navigator
            initialRouteName="Profile"
            headerMode="screen"
            screenOptions={styles.screen}
        >
            {splashLoading ? (
                <AccountStack.Screen 
                name="Splash"
                component={Splash}
                options={{
                    headerTransparent: true,
                }}  
            />
            ) : (
                <>
                    <AccountStack.Screen 
                        name="Profile"
                        component={Profile}
                        options={{
                            headerTransparent: true,
                            header: ({ navigation }) => (
                                <AccountNav navigation={navigation} />
                            ),
                        }}
                    />
                </>
            )}
        </AccountStack.Navigator>
    );
}

const VendorStackScreen = () => {
    const { jwt, splashLoading } = useContext(AuthContext);

    return (
        <VendorStack.Navigator
            initialRouteName="StoresManager"
            headerMode="screen"
            screenOptions={styles.screen}
        >
            {splashLoading ? (
                <VendorStack.Screen 
                name="Splash"
                component={Splash}
                options={{
                    headerTransparent: true,
                }}  
            />
            ) : (
                <>
                    <VendorStack.Screen 
                        name="StoresManager"
                        component={StoresManager}
                        options={{
                            title: 'STORES MANAGER',
                        }} 
                    />
                </>
            )}
        </VendorStack.Navigator>
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

export { HomeStackScreen, AccountStackScreen,VendorStackScreen };