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
import CreateStore from '../../screens/CreateStore';
import Address from '../../screens/Address';
import AddressAdd from '../../screens/AddressAdd';
import AddressEdit from '../../screens/AddressEdit';
import HomeNav from '../Navbar/HomeNav';
import BottomTabNav from './BottomTabNav';
import VendorDrawer from './DrawerNav';

import { StoreTabScreen } from './TopTabNav';
import PerNav from '../Navbar/PerNav';
import { AuthContext } from '../../context/AuthContext';

import ForgotPassword from '../../screens/ForgotPassword';
import ChangeProfile from '../../screens/ChangeProfile';
import ChangePassword from '../../screens/ChangePassword';
import EditProfile from '../../screens/EditProfile';


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
                            name="ForgotPassword"
                            component={ForgotPassword}
                            options={{
                                title: 'Forgot Password',
                            }}
                        />

                        <Stack.Screen
                            name="ChangeProfile"
                            component={ChangeProfile}
                            options={{
                                title: 'Change Profile',
                            }}
                        />
                        
                        <Stack.Screen
                            name="ChangePassword"
                            component={ChangePassword}
                            options={{
                                title: 'Change Password',
                            }}
                        />

                        <Stack.Screen
                            name="EditProfile"
                            component={EditProfile}
                            options={({ route, navigation })=>({
                                title:route.params.title
                            })}
                        />

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
                            options={{
                                headerShown: false,
                            }}
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

                        <Stack.Screen
                            name="Store"
                            options={{
                                headerTransparent: true,
                                header: ({ navigation, route }) => (
                                    <PerNav navigation={navigation} route={route} type='store' />
                                ),
                            }}
                        >
                            {({ route }) => <StoreTabScreen parRoute={route} />}
                        </Stack.Screen>

                        <Stack.Screen 
                            name="VendorDashboard"
                            component={VendorDrawer}
                            options={{
                                headerShown: false,
                            }} 
                        />
                        
                        <Stack.Screen 
                            name="CreateStore"
                            component={CreateStore}
                            options={{
                                title: 'Create Your Store',
                            }} 
                        />

                        <Stack.Screen 
                            name="Address"
                            component={Address}
                            options={{
                                title: 'Your Address',
                            }} 
                        />
                        
                        <Stack.Screen 
                            name="AddAddress"
                            component={AddressAdd}
                            options={{
                                title: 'Add Address',
                            }} 
                        />

                        <Stack.Screen 
                            name="EditAddress"
                            component={AddressEdit}
                            options={{
                                title: 'Edit Address',
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