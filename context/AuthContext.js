import React, { useState, useEffect, createContext } from 'react';
import { signup, signin, signout, refresh, authsocial } from '../services/auth';
import { getUserProfile } from '../services/user';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider =  ({ children }) => {
    const [jwt, setJwt] = useState({});
    const [userProfile, setUserProfile] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [splashLoading, setSplashLoading] = useState(false);
    
    const register = (user) => {
        setIsLoading(true);
        setError('');
        setSuccess('');
        signup(user)
            .then(data => {
                if (data.success) {
                    setSuccess(data.success);
                }
                else if (data.error) {
                    setError(data.error);
                }
            })
            .catch(err => {
                setError('Server Error!');
            })
            .finally(() => {
                setIsLoading(false);
                setTimeout(() => {
                    setError('');
                    setSuccess('');
                }, 3000);
            });
    }
    const login = (user) => {
        setIsLoading(true);
        setError('');
        setSuccess('');
        signin(user)
            .then(data => {
                if (data.success) {
                    const { accessToken, refreshToken, _id, role } = data;
                    setJwt({ accessToken, refreshToken, _id, role });
                    AsyncStorage.setItem('jwt', JSON.stringify({ accessToken, refreshToken, _id, role }));
                }
                else if (data.error) {
                    setError(data.error);
                }
            })
            .catch(err => {
                setError('Server Error!');
            })
            .finally(() => {
                setIsLoading(false);
                setTimeout(() => {
                    setError('');
                    setSuccess('');
                }, 3000);
            });
    }
    const loginSocial = (user) => {
        setIsLoading(true);
        setError('');
        setSuccess('');
        authsocial(user)
            .then(data => {
                if (data.success) {
                   
                    const { accessToken, refreshToken, _id, role } = data;
                    setJwt({ accessToken, refreshToken, _id, role });
                   AsyncStorage.setItem('jwt', JSON.stringify({ accessToken, refreshToken, _id, role }));
                }
                else if (data.error) {
                    setError(data.error);
                }
            })
            .catch(err => {
                setError('Server Error!');
            })
            .finally(() => {
                setIsLoading(false);
                setTimeout(() => {
                    setError('');
                    setSuccess('');
                }, 3000);
            });
    }
   
    const logout = (refreshToken) => {
        setIsLoading(true);
        signout(refreshToken)
            .then(data => {})
            .catch(error => {})
            .finally(() => {
                setJwt({});
                setUserProfile({});
                AsyncStorage.removeItem('jwt');
                setIsLoading(false);
            });
    }

    const isLoggedIn = async () => {
        try {
            setSplashLoading(true);
            let jwt = await AsyncStorage.getItem('jwt');
            jwt = JSON.parse(jwt);

            if (jwt) {
                const { refreshToken } = jwt;
                const data = await refresh(refreshToken);
                setJwt({ 
                    accessToken: data.accessToken, 
                    refreshToken: data.refreshToken, 
                    _id: jwt._id, 
                    role: jwt.role, 
                });
                AsyncStorage.setItem('jwt', JSON.stringify({ 
                    accessToken: data.accessToken, 
                    refreshToken: data.refreshToken, 
                    _id: jwt._id, 
                    role: jwt.role,
                }));
            }
                
            setSplashLoading(false);
        } catch (err) { 
            // console.log(err);
            setSplashLoading(false);
        }
    }

    const getProfile = async () => {
        try {
            setSplashLoading(true);
            let jwt = await AsyncStorage.getItem('jwt');
            jwt = JSON.parse(jwt);

            if (jwt && jwt._id && jwt.accessToken) {
                const data = await getUserProfile(jwt._id, jwt.accessToken);
                setUserProfile(data.user);
            }

            setSplashLoading(false);
        } catch (err) { 
            // console.log(err);
            setSplashLoading(false);
        }

    }

    useEffect(() => {
        isLoggedIn();
    }, []);

    useEffect(() => {
        getProfile();
    }, [jwt]);

    return (
        <AuthContext.Provider
            value={{
                jwt,
                userProfile,
                isLoading,
                splashLoading,
                error,
                success,
                register,
                login,
                logout,
                loginSocial
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}