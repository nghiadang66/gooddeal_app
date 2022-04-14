import React, { useContext } from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HeaderBackButton } from '@react-navigation/elements';
import Colors from '../../themes/Colors';
import Splash from '../../screens/Splash';
import Home from '../../screens/Home';
import SignIn from '../../screens/SignIn';
import SignUp from '../../screens/SignUp';
import Category from '../../screens/Category';
import Search from '../../screens/Search';
import Product from '../../screens/Product';
import Description from '../../screens/Description';
import ReviewsAndRating from '../../screens/ReviewsAndRating';
import HomeNav from '../Navbar/HomeNav';
import BottomTabNav from './BottomTabNav';
import { AuthContext } from '../../context/AuthContext';

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
                                    headerTitle: () => <HomeNav navigation={navigation} />,
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
                            options={({ route, navigation }) => ({
                                title: route.params.category.name,
                                headerLeft: () => (
                                    <HeaderBackButton
                                        tintColor={Colors.white}
                                        pressColor={Colors.white}
                                        onPress={() => {
                                            const category = route.params.category;
                                            if (category.categoryId) {
                                                navigation.navigate('Category', {
                                                    category: category.categoryId,
                                                });
                                            }
                                            else {
                                                navigation.goBack();
                                            }
                                        }}
                                    />
                                ),
                            })} 
                        />

                        <Stack.Screen 
                            name="Search"
                            component={Search}
                            options={{
                                headerShown: false,
                            }}
                        />

                        <Stack.Screen 
                            name="Product"
                            component={Product}
                            options={({ navigation }) => ({
                                headerTransparent: true,
                                headerBackVisible: false,
                                // headerLeft: ()=> null,
                                // headerRight: () => null,
                                headerTitle: () => <HomeNav navigation={navigation} isMain={false} />,
                            })}
                        />

                        <Stack.Screen 
                            name="Description"
                            component={Description}
                            options={{
                                title: 'Description',
                            }} 
                        />

                        <Stack.Screen 
                            name="ReviewsAndRating"
                            component={ReviewsAndRating}
                            options={{
                                title: 'Reviews & Rating',
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
    },
});

export default StackScreen;