import React, { useState, useEffect, useContext } from 'react';
import { View, Text, ScrollView,  StyleSheet } from 'react-native';
import { updateProfile as updateProfileApi } from '../services/store';
import Button from '../components/Button/Button';
import Input from '../components/Form/Input';
import TextArea from '../components/Form/TextArea';
import Alert from '../components/Other/Alert';
import Spinner from '../components/Other/Spinner';
import { AuthContext } from '../context/AuthContext';
import { VendorContext } from '../context/VendorContext';
import { createTwoButtonAlert } from '../components/Other/Confirm';
import { BackBtn } from '../components/Button/HeaderBtn';
import Colors from '../themes/Colors';

const VendorEditProfile = ({ navigation, route }) => {
    const [isloading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [profile, setProfile] = useState({});

    const { jwt } = useContext(AuthContext);
    const { storeProfile, setStoreProfile } = useContext(VendorContext);

    useEffect(() => {
        setProfile({
            name: storeProfile.name,
            bio: storeProfile.bio,
            isValidName: true,
            isValidBio: true,
        });
    }, [storeProfile]);

    const handleChange = (name, isValidName, value) => {
        setProfile({
            ...profile,
            [name]: value,
            [isValidName]: true,
        });
    };

    const handleValidate = (isValidName, flag) => {
        setProfile({
            ...profile,
            [isValidName]: flag,
        });
    };

    const updateProfile = () => {
        const store = { name: profile.name, bio: profile.bio };
        setError('');
        setSuccess('');
        setIsLoading(true);
        updateProfileApi(jwt._id, jwt.accessToken, store, storeProfile._id)
            .then((data) => {
                setSuccess(data.success);
                setStoreProfile(data.store);
                setTimeout(() => {
                    setSuccess('');
                }, 3000);
            })
            .catch((error) => {
                setError('Server Error');
                setTimeout(() => {
                    setError('');
                }, 3000);
            })
            .finally(() => setIsLoading(false));
    };

    return(
        <ScrollView>
            <View style={styles.rowContainer}>
                <View style={{margin: 6,}}>
                    <BackBtn navigation={navigation} color='primary' />
                </View>
                <View style={styles.container}>
                    <Text style={styles.heading}>Edit Store Profile</Text>
                </View>
            </View>
            <View style={styles.form}>
                <Text style={styles.title}>Name</Text>
                <Input
                    type='text'
                    title='Store name'
                    value={profile.name}
                    isValid={profile.isValidName}
                    validator={'name'}
                    feedback={'Please provide a valid store name.'}
                    onChange={(value) =>
                        handleChange('name', 'isValidName', value)
                    }
                    onValidate={(flag) =>
                        handleValidate('isValidName', flag)
                    }
                />

                <Text style={styles.title}>Bio</Text>
                <TextArea
                    title='Store Bio'
                    value={profile.bio}
                    isValid={profile.isValidBio}
                    validator={'bio'}
                    feedback={'Please provide a valid store bio.'}
                    onChange={(value) =>
                        handleChange('bio', 'isValidBio', value)
                    }
                    onValidate={(flag) =>
                        handleValidate('isValidBio', flag)
                    }
                />

                {isloading && <Spinner />}
                {error ? <Alert type='error' content={error} /> : null}
                {success ? <Alert type='success' content={success} /> : null}

                <Button
                    title='Save'
                    onPress={() => createTwoButtonAlert('Edit Store Profile', updateProfile)}
                />
            </View>
        </ScrollView>
    );
    } 
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    form: {
        flex: 0.6,
        paddingVertical: 12,
    },
    heading: {
        color: Colors.primary,
        fontSize: 20,
    },
    title: {
        color: Colors.primary,
        marginLeft: 6,
    },
});
export default VendorEditProfile;