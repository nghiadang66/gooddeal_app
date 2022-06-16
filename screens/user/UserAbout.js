import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, StyleSheet } from 'react-native';
import { getUser as getUserAPi } from '../../services/user';
import { humanReadableDate } from '../../helper/humanReadable';
import Alert from '../../components/Other/Alert';
import Spinner from '../../components/Other/Spinner';
import Colors from '../../themes/Colors';

const UserAbout = ({ navigation, route }) => {
    const [user, setUser] = useState({});

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);

    const getUser = () => {
        setError(false);
        setIsLoading(true);
        getUserAPi(route.params.userId)
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
                <ScrollView style={styles.container}>
                    <View style={styles.wrapper}>
                        <Text style={styles.title}>Name</Text>
                        <Text style={styles.content}>
                            {`${user.firstname} ${user.lastname}`}
                        </Text>
                    </View>

                    <View style={styles.wrapper}>
                        <Text style={styles.title}>Email</Text>
                        <Text style={styles.content}>
                            {user.email}
                        </Text>
                    </View>

                    <View style={styles.wrapper}>
                        <Text style={styles.title}>Phone</Text>
                        <Text style={styles.content}>
                            {user.phone}
                        </Text>
                    </View>

                    <View style={styles.wrapper}>
                        <Text style={styles.title}>ID</Text>
                        <Text style={styles.content}>
                            {user.id_card}
                        </Text>
                    </View>

                    <View style={styles.wrapper}>
                        <Text style={styles.title}>Joined At</Text>
                        <Text style={styles.content}>
                            {humanReadableDate(user.createdAt)}
                        </Text>
                    </View>
                </ScrollView>
            )}

            {isLoading && <Spinner />}
            {error && <Alert type={'error'} />}
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 6,
        paddingVertical: 12,
    },
    wrapper: {
        backgroundColor: Colors.white,
        padding: 6,
        borderRadius: 3,
        marginBottom: 3,
    },
    title: {
        color: Colors.primary,
    },
    content: {
        fontSize: 16,
        paddingVertical: 6,
    },
});

export default UserAbout;