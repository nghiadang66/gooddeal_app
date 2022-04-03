import React, { useContext } from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Colors from '../themes/Colors';
import Splash from '../screens/Splash';
import Home from '../screens/Home';
import SignIn from '../screens/SignIn';
import SignUp from '../screens/SignUp';
import Category from '../screens/Category';
import MainNav from './MainNav';
import BottomTabNav from './BottomTabNav';
import { AuthContext } from '../context/AuthContext';
import ForgotPassword from '../screens/ForgotPassword';

const Stack = createNativeStackNavigator();
const MyTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        background: Colors.highMuted,
    },
};

const StackScreen = () => {
    const { jwt, splashLoading } = useContext(AuthContext);
    return (
        <NavigationContainer theme={MyTheme}>
            <Stack.Navigator
                initialRouteName="HomeTabNav"
                headerMode="screen"
                screenOptions={styles.screen}
            >
                {splashLoading ? (
                    <Stack.Screen
                        name="Splash"
                        component={Splash}
                        options={{ headerShown: false }}
                    />
                ) : (
                    <>
                        <Stack.Screen
                            name="HomeTabNav"
                            component={
                                jwt.accessToken
                                    ? BottomTabNav
                                    : Home}
                            options={
                                jwt.accessToken
                                    ? { headerShown: false }
                                    : ({ navigation }) => ({
                                        headerTransparent: true,
                                        headerTitle: () => (
                                            <MainNav navigation={navigation} />
                                        ),
                                    })}
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

                        <Stack.Screen
                            name="Category"
                            component={Category}
                            options={({ route }) => ({ title: route.params.categoryName })}
                        />

                        <Stack.Screen
                            name="ForgotPassword"
                            component={ForgotPassword}
                            options={{
                                title: 'Forgot Password',
                            }}
                        />
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
        // contentStyle: {
        //     backgroundColor: Colors.highMuted,
        // },
    },
});

export default StackScreen;