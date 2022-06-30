import React, { useState, useEffect, createContext, useContext } from 'react';
import { getStoreProfile } from '../services/store';

export const VendorContext = createContext();

export const VendorProvider =  ({ children }) => {
    const [storeProfile, setStoreProfile] = useState({});

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    
    const vendorLogin = (userId, token, storeId) => {
        setIsLoading(true);
        setError('');
        setSuccess('');
        getStoreProfile(userId, token, storeId)
            .then(data => {
                setSuccess(data.success)
                setStoreProfile(data.store);
            })
            .catch(err => {
                setError('Server Error!');
            })
            .finally(() => {
                setIsLoading(false);
            });
    }
   
    const vendorLogout = () => {
        setStoreProfile({});
        setError('Go out');
    }

    return (
        <VendorContext.Provider
            value={{
                storeProfile,
                isLoading,
                error,
                success,
                vendorLogin,
                vendorLogout,
                setStoreProfile,
            }}
        >
            {children}
        </VendorContext.Provider>
    );
}