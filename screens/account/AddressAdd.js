import React, { useState, useContext } from 'react';
import { View, ScrollView, Text, StyleSheet } from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import { addAddress } from '../../services/user';
import { regexTest } from '../../helper/test';
import Input from '../../components/Form/Input';
import Button from '../../components/Button/Button';
import { createTwoButtonAlert } from '../../components/Other/Confirm';
import Colors from '../../themes/Colors';
import Spinner from '../../components/Other/Spinner';
import Alert from '../../components/Other/Alert';

const AddressAdd = ({ navigation, route }) => {
    const [isloading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    
    const [address, setAddress] = useState({
        street: '',
        ward: '',
        district_city: '',
        city_province: '',
        country: 'Việt Nam',
        isValidStreet: true,
        isValidWard: true,
        isValidDistrict: true,
        isValidProvince: true,
        isValidCountry: true,
    });

    const { jwt, setUserProfile } = useContext(AuthContext);

    const handleChange = (name, isValidName, value) => {
        setAddress({
            ...address,
            [name]: value,
            [isValidName]: true,
        });
    };

    const handleValidate = (isValidName, flag) => {
        setAddress({
            ...address,
            [isValidName]: flag,
        });
    };

    const handleSubmit = () => {
        const { street, ward, district_city, city_province, country } = address;
        if (!street || !ward || !district_city || !city_province || !country) {
            setAddress({
                ...address,
                isValidStreet: regexTest('address', street),
                isValidWard: regexTest('address', ward),
                isValidDistrict: regexTest('address', district_city),
                isValidProvince: regexTest('address', city_province),
                isValidCountry: regexTest('address', country),
            });
            return;
        }

        const {
            isValidStreet,
            isValidWard,
            isValidDistrict,
            isValidProvince,
            isValidCountry,
        } = address;
        if (
            !isValidStreet ||
            !isValidWard ||
            !isValidDistrict ||
            !isValidProvince ||
            !isValidCountry
        )
            return;

        const addressString =
            address.street +
            ', ' +
            address.ward +
            ', ' +
            address.district_city +
            ', ' +
            address.city_province +
            ', ' +
            address.country;
        createTwoButtonAlert('Add New Address', onSubmit, addressString);
    };

    const onSubmit = () => {
        const addressString =
            address.street +
            ', ' +
            address.ward +
            ', ' +
            address.district_city +
            ', ' +
            address.city_province +
            ', ' +
            address.country;

        setError('');
        setSuccess('');
        setIsLoading(true);
        addAddress(jwt._id, jwt.accessToken, { address: addressString })
            .then(data => {
                if (data.error) {
                    setError(data.error);
                    setTimeout(() => {
                        setError('');
                    }, 3000);
                }
                else {
                    setUserProfile(data.user);
                    setSuccess(data.success);
                    setTimeout(() => {
                        setSuccess('');
                    }, 3000);
                }
            })
            .catch(error => {
                setError('Sever error');
                setTimeout(() => {
                    setError('');
                }, 3000);
            })
            .finally(() => setIsLoading(false));
    };

    return (
        <ScrollView>
            <View style={styles.container}>
                <Text style={styles.title}>Street</Text>
                <Input
                    type='text'
                    title='Street address'
                    value={address.street}
                    isValid={address.isValidStreet}
                    feedback='Please provide a valid street address ("," is not allowed).'
                    validator="address"
                    onChange={(value) =>
                        handleChange('street', 'isValidStreet', value)
                    }
                    onValidate={(flag) =>
                        handleValidate('isValidStreet', flag)
                    }
                />

                <Text style={styles.title}>Ward</Text>
                <Input
                    type='text'
                    title='Ward'
                    value={address.ward}
                    isValid={address.isValidWard}
                    feedback='Please provide a valid ward ("," is not allowed).'
                    validator="address"
                    onChange={(value) =>
                        handleChange('ward', 'isValidWard', value)
                    }
                    onValidate={(flag) =>
                        handleValidate('isValidWard', flag)
                    }
                />

                <Text style={styles.title}>City / district</Text>
                <Input
                    type='text'
                    title='City / district'
                    value={address.district_city}
                    isValid={address.isValidDistrict}
                    feedback='Please provide a valid city / district ("," is not allowed).'
                    validator="address"
                    onChange={(value) =>
                        handleChange(
                            'district_city',
                            'isValidDistrict',
                            value,
                        )
                    }
                    onValidate={(flag) =>
                        handleValidate('isValidDistrict', flag)
                    }
                />

                <Text style={styles.title}>Province / city</Text>
                <Input
                    type='text'
                    title='Province / city'
                    value={address.city_province}
                    isValid={address.isValidProvince}
                    feedback='Please provide a valid province / city ("," is not allowed).'
                    validator="address"
                    onChange={(value) =>
                        handleChange(
                            'city_province',
                            'isValidProvince',
                            value,
                        )
                    }
                    onValidate={(flag) =>
                        handleValidate('isValidProvince', flag)
                    }
                />

                <Text style={styles.title}>Country</Text>
                <Input
                    type='text'
                    title='Country'
                    value={address.country}
                    isValid={address.isValidCountry}
                    feedback='Please provide a valid country ("," is not allowed).'
                    validator="address"
                    onChange={(value) =>
                        handleChange('country', 'isValidCountry', value)
                    }
                    onValidate={(flag) =>
                        handleValidate('isValidCountry', flag)
                    }
                />

                {isloading && <Spinner />}
                {error ? <Alert type='error' content={error} /> : null}
                {success ? <Alert type='success' content={success} /> : null}

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
    title: {
        color: Colors.primary,
        marginLeft: 12,
    },
    content: {
        fontSize: 16,
        paddingVertical: 6,
    },
});

export default AddressAdd