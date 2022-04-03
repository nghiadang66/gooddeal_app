import React, { useState, useContext } from 'react';
import { View, ScrollView,  StyleSheet } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import Button from '../components/Button';
import Input from '../components/Input';
import Alert from '../components/Alert';
import { AuthContext } from '../context/AuthContext';
import { regexTest } from '../helper/test';

const ForgotPassword = ({ navigation }) => {
    const [account, setAccount] = useState({
        username: '',
        isValidUsername: true,
       
    });

    const { isLoading, error, success, forgotPassword } = useContext(AuthContext);
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
                isValidUsername:
                    regexTest('email', username) 
            });
            return;
        }

        const { isValidUsername } = account;
        if (!isValidUsername) return;
        forgotPassword(username);
       
    };
    return <ScrollView style={styles.container}>
        <Spinner visible={isLoading} />
        <View style={styles.form}>
        
            <Input
                type='text'
                icon='person'
                title='Email'
                value={account.username}
                isValid={account.isValidUsername}
                validator='email'
                feedback='Please provide a valid email address'
                onChange={value => handleChange('username', 'isValidUsername', value)}
                onValidate={value => handleValidate('isValidUsername', value)}
            />


            {error ? <Alert type='error' content={error} /> : null}
            {success ? <Alert type='success' content={success} /> : null}

            <Button
                title='Send email'
                onPress={handleSubmit}
            />
        </View>
    </ScrollView>
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
export default ForgotPassword;