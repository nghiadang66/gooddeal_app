import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import Button from '../components/Button/Button';

const Profile = (props) => {
    const { jwt, logout, userProfile } = useContext(AuthContext);

    return (
        <View style={styles.container}>
            <Text>Welcome to GoodDeal, {userProfile.firstname + ' ' + userProfile.lastname}!</Text>
            {jwt.accessToken && jwt.refreshToken && (
                <Button
                    type='danger' 
                    title='Sign out' 
                    onPress={() => {
                        logout(jwt.refreshToken);        
                    }}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
});

export default Profile;