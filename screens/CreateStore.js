import React, { useState, useEffect, useContext } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { VendorContext } from '../context/VendorContext';
import { createStore } from '../services/store';
import { listActiveCommissions as getlistCommissions } from '../services/commission';
import Alert from '../components/Other/Alert';
import Spinner from '../components/Other/Spinner';
import Input from '../components/Form/Input';
import TextArea from '../components/Form/TextArea';
import ImageInput from '../components/Form/ImageInput';
import Button from '../components/Button/Button';
import Colors from '../themes/Colors';
import CommissionSelect from '../components/Form/CommissionSelect';
import Link from '../components/Other/Link';
import { createTwoButtonAlert } from '../components/Other/Confirm';
import { regexTest } from '../helper/test';

const CreateStore = ({ navigation }) => {
    const [isloading, setIsLoading] = useState(false);
    const [isloading1, setIsLoading1] = useState(false);
    const [error1, setError1] = useState('');
    const [error, setError] = useState('');

    const [listActiveCommissions, setListActiveCommissions] = useState([]);
    const [store, setStore] = useState({
        name: '',
        bio: '',
        commissionId: '',
        avatar: '',
        cover: '',
        isValidName: true,
        isValidBio: true,
        isValidAvatar: true,
        isValidCover: true,
    });

    const { jwt } = useContext(AuthContext);
    const { vendorLogin } = useContext(VendorContext);

    const init = () => {
        setError1('');
        setIsLoading1(true);
        getlistCommissions()
            .then((data) => {
                setListActiveCommissions(data.commissions);
                setStore({
                    ...store,
                    commissionId: data.commissions[0]._id,
                });
            })
            .catch((error) => setError1('Server Error'))
            .finally(() => setIsLoading1(false));
    };

    useEffect(() => {
        init();
    }, []);

    const handleChange = (name, isValidName, value) => {
        setStore({
            ...store,
            [name]: value,
            [isValidName]: true,
        });
    };

    const handleValidate = (isValidName, flag) => {
        setStore({
            ...store,
            [isValidName]: flag,
        });
    };

    const handleSelect = (value) => {
        setStore({
            ...store,
            commissionId: value,
        });
    };

    const handleSubmit = () => {
        if (!store.name || !store.bio || !store.avatar || !store.cover) {
            setStore({
                ...store,
                isValidName: regexTest('name', store.name),
                isValidBio: regexTest('bio', store.bio),
                isValidAvatar: !!store.avatar,
                isValidCover: !!store.cover,
            });
            return;
        }

        if (
            !store.isValidName ||
            !store.isValidBio ||
            !store.avatar ||
            !store.cover
        )
            return;

        createTwoButtonAlert('Create New Store', onSubmit, "By Creating store, you agree to GoodDeal's Terms of Use and Privacy Policy");
    };

    const onSubmit = () => {
        const formData = new FormData();
        formData.append('name', store.name);
        formData.append('bio', store.bio);
        formData.append('commissionId', store.commissionId);
        formData.append('avatar', store.avatar);
        formData.append('cover', store.cover);

        setError('');
        setIsLoading(true);
        createStore(jwt._id, jwt.accessToken, formData)
            .then(data => {
                if (data.error) {
                    setError(data.error);
                    setTimeout(() => {
                        setError('');
                    }, 3000);
                } else {
                    vendorLogin(jwt._id, jwt.accessToken, data.storeId);
                    navigation.navigate('VendorDashboard');
                }
            })
            .catch((error) => {
                setError('Server Error');
                setTimeout(() => {
                    setError('');
                }, 3000);
            })
            .finally(() => setIsLoading(false));
    };

    return (
        <ScrollView>
            <View style={styles.container}>
                <Text style={styles.title}>Name</Text>
                <Input
                    type='text'
                    title='Store name'
                    value={store.name}
                    isValid={store.isValidName}
                    feedback="Please provide a valid store name."
                    validator="name"
                    onChange={(value) =>
                        handleChange('name', 'isValidName', value)
                    }
                    onValidate={(flag) =>
                        handleValidate('isValidName', flag)
                    }
                />

                <Text style={styles.title}>Bio</Text>
                <TextArea
                    title='Store bio'
                    value={store.bio}
                    isValid={store.isValidBio}
                    feedback="Please provide a valid store bio."
                    validator="bio"
                    onChange={(value) =>
                        handleChange('bio', 'isValidBio', value)
                    }
                    onValidate={(flag) =>
                        handleValidate('isValidBio', flag)
                    }
                /> 

                <Text style={styles.title}>Avatar</Text>
                <ImageInput
                    isValid={store.avatar}
                    isRequired={true}
                    onChange={(value) =>
                        handleChange('avatar', 'isValidAvatar', value)
                    }
                />

                <Text style={styles.title}>Cover</Text>
                <ImageInput
                    isValid={store.cover}
                    isRequired={true}
                    onChange={(value) =>
                        handleChange('cover', 'isValidCover', value)
                    }
                    size={'cover'}
                />

                <Text style={styles.title}>Commission</Text>
                {!isloading1 && !error1 && (
                    <CommissionSelect
                        values={listActiveCommissions}
                        selectedValue={store.commissionId}
                        onChange={(value) =>
                            handleChange('commissionId', 'isValidCommissionId', value)}
                    />
                )}

                <View style={styles.policy}>
                    <Link fontSize={14} title={'How you will get paid? Set up billing?'} />
                    <Link fontSize={14} title={"By Creating store, you agreed to GoodDeal's Terms of Use & Privacy Policy."} />
                </View>

                {isloading && <Spinner />}
                {error ? <Alert type='error' content={error} /> : null}

                <Button
                    title='Submit'
                    onPress={handleSubmit}
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
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexWrap: 'wrap',
    },
    wrapper: {
        backgroundColor: Colors.white,
        padding: 6,
        borderRadius: 3,
        marginBottom: 3,
    },
    backBtn: {
        margin: 6,
    },
    heading: {
        color: Colors.primary,
        fontSize: 20,
    },
    title: {
        color: Colors.primary,
        marginLeft: 12,
    },
    content: {
        fontSize: 16,
        paddingVertical: 6,
    },
    policy: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 12,
        marginBottom: 24,
    }
});

export default CreateStore;