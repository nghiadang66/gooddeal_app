import React, { useState, useContext } from 'react';
import { View, ScrollView,  StyleSheet,Text } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import Button from '../components/Button/Button';
import Input from '../components/Form/Input';
import Alert from '../components/Other/Alert';
import { AuthContext } from '../context/AuthContext';
import { regexTest } from '../helper/test';

const EditProfile = ({ navigation,route }) => {
    const [account, setAccount] = useState({
        username: route.params.value,
        isValid: true,
       
    });

    const { isLoading, error, success,changeProfile,userProfile } = useContext(AuthContext);
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
        const { username } = account;
        if (!username) {
            setAccount({
                ...account,
                isValid:
                    regexTest(route.params.validator, username) 
            });
            return;
        }

        const { isValid } = account;
        if (!isValid) return;
 
        if(route.params.type=='firstname')
        {
            let user = {lastname: userProfile.lastname,phone: userProfile.phone };
            if (account.username) user.firstname = account.username;
            if (!userProfile.googleId && !userProfile.facebookId) user.email = userProfile.email;
            changeProfile(user);
        }
        if(route.params.type=='lastname')
        {
            let user = {firstname: userProfile.firstname,phone: userProfile.phone };
            if (account.username) user.lastname = account.username;
            if (!userProfile.googleId && !userProfile.facebookId) user.email = userProfile.email;
            changeProfile(user);
        }
        if(route.params.type=='phone')
        {
            let user = {firstname: userProfile.firstname,lastname: userProfile.lastname };
            if (account.username) user.phone = account.username;
            if (!userProfile.googleId && !userProfile.facebookId) user.email = userProfile.email;
            changeProfile(user);
        }
        if(route.params.type=='email')
        {
            let user = {firstname: userProfile.firstname,phone: userProfile.phone,lastname: userProfile.lastname };
            if (!userProfile.googleId && !userProfile.facebookId && account.username) user.email = account.username;
           
          
            changeProfile(user);
        }
       
    };
    return(<ScrollView style={styles.container}>
      
<View style={styles.form}>
        
        <Input
            type='text'
           
            value={account.username}
            isValid={account.isValid}
            validator={route.params.validator}
            feedback={'Please provide a valid'+route.params.type}
            onChange={value => handleChange('username', 'isValid',value)}
            onValidate={value => handleValidate('isValid', value)}
        />


        {error ? <Alert type='error' content={error} /> : null}
        {success ? <Alert type='success' content={success} /> : null}

        <Button
            title='Save'
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
   
    form: {
        flex: 0.6,
        paddingVertical: 12,
    },
   
});
export default EditProfile;