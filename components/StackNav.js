import React, { useContext } from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Colors from '../themes/Colors';
import Splash from '../screens/Splash';
import SignIn from '../screens/SignIn';
import SignUp from '../screens/SignUp';
import BottomTabNav from './BottomTabNav';
import { AuthContext } from '../context/AuthContext';

const Stack = createStackNavigator();

const StackScreen = () => {
    const { jwt, splashLoading } = useContext(AuthContext);

    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="Home"
                headerMode="screen"
                screenOptions={styles.screen}
            >
                {splashLoading ? (
                    <Stack.Screen 
                    name="Splash"
                    component={Splash}
                    options={{
                        headerTransparent: true,
                    }}  
                />
                ) : (
                    <>
                        <Stack.Screen 
                            name="Home"
                            component={BottomTabNav}
                            options={{
                                headerShown: false,
                            }}
                        />

                        {!jwt.accessToken && (
                            <Stack.Screen 
                                name="SignIn"
                                component={SignIn}
                                options={{
                                    title: 'Sign In',
                                }} 
                            />
                        )}

                        {!jwt.accessToken && (
                            <Stack.Screen 
                                name="SignUp"
                                component={SignUp}
                                options={{
                                    title: 'Sign Up',
                                }} 
                            />
                        )}
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
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

export default StackScreen;