import React, { useContext, useState } from 'react';
import { View,StyleSheet,ScrollView,Text } from 'react-native';
import Colors from '../themes/Colors';
import Button from '../components/Button/Button';
import Input from '../components/Form/Input';
import { regexTest } from '../helper/test';
import { AuthContext } from '../context/AuthContext';
import { addaddress } from '../services/user';
import Alert from '../components/Other/Alert';
import Spinner from 'react-native-loading-spinner-overlay';
import { color } from 'react-native-elements/dist/helpers';

const AddUserAddress = ({ navigation }) => {
    const { jwt,userProfile,addAddress,isLoading, error, success } = useContext(AuthContext);


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

            addAddress({ address: addressString })
            
                setAddress({
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
            
        
        
    };
    return (
        <ScrollView style={styles.container}>
            <Spinner visible={isLoading} />
            <View style={styles.form}>
               <Text style={styles.text}>Street address</Text>
                <Input
                    type='text'
                    title='Street address'
                  
                    value={address.street}
                    isValid={address.isValidStreet}
                    validator='address'
                    feedback='Please provide a valid street address ("," is not allowed)'
                    onChange={value => handleChange('street', 'isValidStreet', value)}
                    onValidate={flag =>  handleValidate('isValidStreet', flag)}
                />
                 <Text style={styles.text}>Ward</Text>
                <Input
                    type='text'
                    title='Ward'
                  
                    value={address.ward}
                    isValid={address.isValidWard}
                    validator='address'
                    feedback='Please provide a valid ward ("," is not allowed)'
                    onChange={value =>  handleChange('ward', 'isValidWard', value)}
                    onValidate={flag =>   handleValidate('isValidWard', flag)}
                />
                 <Text style={styles.text}>City / district</Text>
                <Input
                    type='text'
                    title='City / district'
               
                    value={address.district_city}
                    isValid={address.isValidDistrict}
                    validator='address'
                    feedback='Please provide a valid city / district ("," is not allowed)'
                    onChange={value => handleChange(
                        'district_city',
                        'isValidDistrict',
                        value,
                    )}
                    onValidate={flag =>  handleValidate('isValidDistrict', flag)}
                />
                 <Text style={styles.text}>Province / City</Text>
                <Input
                    type='text'
                    title='Province / City'
                   
                    value={address.city_province}
                    isValid={address.isValidProvince}
                    validator='address'
                    feedback='Please provide a valid province / city ("," is not allowed)'
                    onChange={value =>  handleChange(
                        'city_province',
                        'isValidProvince',
                        value,
                    )}
                    onValidate={flag =>   handleValidate('isValidProvince', flag)}
                />
                 <Text style={styles.text}>Country</Text>
                <Input
                    type='text'
                    title='Country'
                
                    value={address.country}
                    isValid={address.isValidCountry}
                    validator='address'
                    feedback='Please provide a valid country ("," is not allowed)'
                    onChange={value => handleChange('country', 'isValidCountry', value)}
                    onValidate={flag =>  handleValidate('isValidCountry', flag)}
                />



                {error ? <Alert type='error' content={error} /> : null}

                {success ?
                <Alert type='success' content={success} /> : null}

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
        padding:12,
        flex: 1,
        height: '100%',
        backgroundColor: Colors.white,
        margin:5
    },
    text:{
        color:Colors.primary,
        paddingLeft:10,
        fontSize: 16
    },
    wrapper: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 12,
        backgroundColor: Colors.shadow,
    },
    form: {
        flex: 0.6,
        paddingVertical: 12,
    },
   

});

export default AddUserAddress;