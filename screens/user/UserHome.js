import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getUser as getUserApi } from '../../services/user';
import Alert from '../../components/Other/Alert';
import Spinner from '../../components/Other/Spinner';

const UserHome = ({ navigation, route }) => {
    const [user, setUser] = useState({});

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);

    const getUser = () => {
        setError(false);
        setIsLoading(true);
        getUserApi(route.params.userId)
            .then(data => {
                setUser(data.user);
            })
            .catch((error) => {
                setError(true);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }

    useEffect(() => {
        getUser();
    }, [route.params.userId]);

    return (
        <>
            {!isLoading && !error && (
                <View style={styles.container}>
                    <Text style={styles.text}>{`Hi, i'm ${user.firstname} ${user.lastname}!`}</Text>
                </View>
                    
            )}

            {isLoading && <Spinner />}
            {error && <Alert type={'error'} />}
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 16,
    }
});

export default UserHome;