import React, { useState, useContext, useEffect } from 'react';
import { View, ScrollView, Text, StyleSheet } from 'react-native';
import Logo from '../components/Logo';
import Button from '../components/Button';
import Input from '../components/Input';
import Link from '../components/Link';
import Colors from '../themes/Colors';
import { AuthContext } from '../context/AuthContext';
import Spinner from 'react-native-loading-spinner-overlay';
import { regexTest } from '../helper/test';
import Alert from '../components/Alert';
import { LoginManager, AccessToken } from 'react-native-fbsdk-next'
import { SocialIcon } from 'react-native-elements'
import { GoogleSignin } from '@react-native-google-signin/google-signin';

const SignIn = ({ navigation }) => {
    const [account, setAccount] = useState({
        username: '',
        password: '',
        isValidUsername: true,
        isValidPassword: true,
    });
    
    const { isLoading, error, login,loginSocial} = useContext(AuthContext);

    const handleChange = (name, isValidName, value) => {
        setAccount({
            ...account,
            [name]: value,
            [isValidName]: true,
        });
    }

    const handleValidate = (isValidName, value) => {
        setAccount({
            ...account,
            [isValidName]: value,
        });
    };

    const handleSubmit = () => {
        //check values
        const { username, password } = account;
        if (!username || !password) {
            setAccount({
                ...account,
                isValidUsername:
                    regexTest('email', username) ||
                    regexTest('phone', username),
                isValidPassword: regexTest('password', password),
            });
            return;
        }

        const { isValidUsername, isValidPassword } = account;
        if (!isValidUsername || !isValidPassword) return;

        //send values
        const user = { password };
        regexTest('email', username) && (user.email = username);
        regexTest('phone', username) && (user.phone = username);
        login(user);
    }

    const loginWithFacebook = () => {
        LoginManager.logInWithPermissions(["public_profile", "email"]).then(
            function (result) {
                if (result.isCancelled) {
                    console.log("Login Cancelled " + JSON.stringify(result))
                } else {
                    AccessToken.getCurrentAccessToken().then(data => {
                        const { accessToken } = data
                     
                        fetch('https://graph.facebook.com/v2.5/me?fields=id,email,last_name,first_name,picture.type(large)&access_token=' + accessToken)
                            .then((response) => response.json())
                            .then((json) => {
                                
                              
                                const user = {
                                    firstname: json.first_name,
                                    lastname:json.last_name,
                                       
                                    email: json.email,
                                    facebookId:json.id
                                };
                                
                                loginSocial(user)
                                
                            })
                            .catch(() => {
                                reject('ERROR GETTING DATA FROM FACEBOOK')
                            })

                    });
                }
            },
            function (error) {
                console.log("Login failed with error: " + error);
            }

        );
    };
    const loginWithGoogle = () => {
        GoogleSignin.configure({
            androidClientId: '219281125167-6v98u2lsr95ldnc6bf85cvqijcevbdev.apps.googleusercontent.com',

        })
        GoogleSignin.hasPlayServices().then((hasPlayService) => {
            if (hasPlayService) {

                GoogleSignin.signIn().then((userInfo) => {
                    
                   
                    const user = {
                        firstname: userInfo.user.givenName,
                        lastname:userInfo.user.familyName,
                           
                        email: userInfo.user.email,
                        googleId:userInfo.user.id
                    };
                    
                    loginSocial(user)
                }).catch((e) => {
                    console.log("ERROR IS: " + JSON.stringify(e));
                })
            }
        }).catch((e) => {
            console.log("ERROR IS: " + JSON.stringify(e));
        })
    };

    return (
        <ScrollView style={styles.container}>
            <Spinner visible={isLoading} />

            <View style={styles.logo}>
                <Logo background={false} />
                <Text style={styles.text}>Welcome back!</Text>
            </View>

            <View style={styles.form}>
                <Input
                    type='text'
                    icon='person'
                    title='Email address or phone number'
                    value={account.username}
                    isValid={account.isValidUsername}
                    validator='email|phone'
                    feedback='Please provide a valid email address or phone number.'
                    onChange={value => handleChange('username', 'isValidUsername', value)}
                    onValidate={value => handleValidate('isValidUsername', value)}
                />

                <Input
                    type='password'
                    icon='lock-closed'
                    title='Password'
                    value={account.password}
                    isValid={account.isValidPassword}
                    validator='password'
                    feedback='Please provide a valid password.'
                    onChange={value => handleChange('password', 'isValidPassword', value)}
                    onValidate={value => handleValidate('isValidPassword', value)}
                />

                {error ? <Alert type='error' content={error} /> : null}

                <Button
                    title='Sign in'
                    onPress={handleSubmit}
                />
                <View style={styles.more}>
                    <Link
                        title='Forgot password?'
                        onPress={() => {
                            console.log('---forgot password, send email---');
                            navigation.navigate('ForgotPassword')
                        }}
                    />
                    <Link
                        title='Sign up'
                        onPress={() => navigation.navigate('SignUp')}
                    />
                </View>
                <SocialIcon

                    title="Continue with Facebook"
                    button
                    type="facebook"
                    onPress={() => loginWithFacebook()}
                />
                <SocialIcon

                    title="Continue with Google"
                    button
                    type="google"
                    onPress={() => loginWithGoogle()}
                />
               
             
               
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 12,
    },
    logo: {
        flex: 0.2,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 12,
    },
    form: {
        flex: 0.6,
        paddingVertical: 12,
    },
    policy: {
        flex: 0.2,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 12,
    },
    more: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 6,
        marginVertical: 6,
    },
    text: {
        fontSize: 16,
        color: Colors.muted,
    },
});

export default SignIn;