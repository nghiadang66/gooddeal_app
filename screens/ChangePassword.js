import React, { useState, useContext } from 'react';
import { View, ScrollView, StyleSheet,Alert } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import Button from '../components/Button';
import Input from '../components/Input';
import Alerts from '../components/Alert';
import { AuthContext } from '../context/AuthContext';
import { regexTest } from '../helper/test';

const ChangePassword = ({ navigation }) => {
    const [account, setAccount] = useState({
        currentPassword: '',
        newPassword: '',
        isValidCurrentPassword: true,
        isValidNewPassword: true,

    });
    const [isConfirming, setIsConfirming] = useState(false);
    const { isLoading, error, success, changePassword } = useContext(AuthContext);
   
      
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
        const { currentPassword,newPassword } = account;
        if (!currentPassword||!newPassword) {
            setAccount({
                ...account,
                isValidCurrentPassword:
                    regexTest('password', currentPassword),
                isValidNewPassword:
                    regexTest('password', newPassword)
            });
            return;
        }

        const { isValidCurrentPassword,isValidNewPassword} = account;
        if (!isValidCurrentPassword||!isValidNewPassword) return;
        setIsConfirming(true);
        

    };
    const onSubmit = () => {
      
        const { currentPassword,newPassword } = account;
        const user = {
            currentPassword: currentPassword,
            newPassword: newPassword,
        };

       
        changePassword(user)
       setIsConfirming(false)
    };
    return <ScrollView style={styles.container}>
        <Spinner visible={isLoading} />
        {isConfirming && (
               Alert.alert(
                "Comfirm",
                 "Are you sure you want to change password?",
                 [
                   
                   {
                     text: "No",
                   },
                   {
                       text: "Yes",
                       onPress: onSubmit()
                          
                       }
                         
                       
                     
                 ]
               )
            )}
        <View style={styles.form}>

            <Input
                type='password'
                icon='lock-closed'
                title='Current password'
                value={account.currentPassword}
                isValid={account.isValidCurrentPassword}
                validator='password'
                feedback='Please provide a valid password.'
                onChange={value => handleChange('currentPassword', 'isValidCurrentPassword', value)}
                onValidate={value => handleValidate('isValidCurrentPassword', value)}
            />
            <Input
                type='password'
                icon='lock-closed'
                title='New password'
                value={account.newPassword}
                isValid={account.isValidNewPassword}
                validator='password'
                feedback='Password must contain at least 6 characters, at least 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character such as @, $, !, %, *, ?, &.'
                onChange={value => handleChange('newPassword', 'isValidNewPassword', value)}
                onValidate={value => handleValidate('isValidNewPassword', value)}
            />

            {error ? <Alerts type='error' content={error} /> : null}
            {success ? <Alerts type='success' content={success} /> : null}

            <Button
                title='Save'
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
export default ChangePassword;