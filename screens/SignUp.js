import React, { useState, useEffect, useContext } from 'react';
import { View, ScrollView, Text, StyleSheet } from 'react-native';
import Logo from '../components/Other/Logo';
import Button from '../components/Button/Button';
import Input from '../components/Form/Input';
import Link from '../components/Other/Link';
import Colors from '../themes/Colors';
import { AuthContext } from '../context/AuthContext';
import { regexTest } from '../helper/test';
import Spinner from 'react-native-loading-spinner-overlay';
import Alert from '../components/Other/Alert';

const SignUp = ({ navigation }) => {
    const [account, setAccount] = useState({
        firstname: '',
        lastname: '',
        username: '',
        password: '',
        isValidFirstname: true,
        isValidLastname: true,
        isValidUsername: true,
        isValidPassword: true,
    });

    const { isLoading, error, success, register } = useContext(AuthContext);

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
        //check values
        const { firstname, lastname, username, password } = account;
        if (!firstname || !lastname || !username || !password) {
            setAccount({
                ...account,
                isValidFirstname: regexTest('name', firstname),
                isValidLastname: regexTest('name', lastname),
                isValidUsername:
                    regexTest('email', username) ||
                    regexTest('phone', username),
                isValidPassword: regexTest('password', password),
            });
            return;
        }
        if (
            !account.isValidFirstname ||
            !account.isValidLastname ||
            !account.isValidUsername ||
            !account.isValidPassword
        )
            return;

        //send values
        const user = { firstname, lastname, password };
        regexTest('email', username) && (user.email = username);
        regexTest('phone', username) && (user.phone = username);
        register(user);
    }

    return (
        <ScrollView style={styles.container}>
            <Spinner visible={isLoading} />

            <View style={styles.logo}>
                <Logo background={false} />
                <Text style={styles.text}>Signing up is easy.</Text>
            </View>

            <View style={styles.form}>
                <Input  
                    type='text'
                    icon='person-circle'
                    title='First name'
                    value={account.firstname}
                    isValid={account.isValidFirstname}
                    validator='name'
                    feedback='Please provide a valid firstname.'
                    onChange={value => handleChange('firstname', 'isValidFirstname', value)}
                    onValidate={value => handleValidate('isValidFirstname', value)}
                />

                <Input  
                    type='text'
                    icon='person-circle'
                    title='Last name'
                    value={account.lastname}
                    isValid={account.isValidLastname}
                    validator='name'
                    feedback='Please provide a valid lastname.'
                    onChange={value => handleChange('lastname', 'isValidLastname', value)}
                    onValidate={value => handleValidate('isValidLastname', value)}
                />

                <Input  
                    type='text'
                    icon='person'
                    title='Email address or phone number'
                    value={account.username}
                    isValid={account.isValidUsername}
                    validator='email|phone'
                    feedback='Please provide a valid email address or phone number.'
                    onChange={value => handleChange('username', 'isValidUsername', value)}
                    onValidate={value => handleValidate('isValidUsername', value)}
                />

                <Input  
                    type='password'
                    icon='lock-closed'
                    title='Password'
                    value={account.password}
                    isValid={account.isValidPassword}
                    validator='password'
                    feedback='Password must contain at least 6 characters, 1 uppercase, 1 lowercase, 1 number and 1 special character such as @, $, !, %, *, ?, &.'
                    onChange={value => handleChange('password', 'isValidPassword', value)}
                    onValidate={value => handleValidate('isValidPassword', value)}
                />

                <View style={styles.policy}>
                    <Text styles={styles.policyText}>By Signing up, you agree to GoodDeal's </Text>
                    <Link fontSize={14} title={"Terms of Use"} />
                    <Text styles={styles.policyText}> and </Text>
                    <Link fontSize={14} title={"Privacy Policy"} />
                    <Text styles={styles.policyText}>.</Text>
                </View>

                {error ? <Alert type='error' content={error} /> : null}
                {success ? <Alert type='success' content={success} /> : null}

                <Button
                    title='Sign up'
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
    logo: {
        flex: 0.2,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 12,
    },
    form: {
        flex: 0.6,
        paddingVertical: 12,
    },
    policy: {
        flex: 0.2,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 12,
    },
    text: {
        fontSize: 16,
        color: Colors.muted,
    },
    policy: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 6,
        marginBottom: 24,
    },
    policyText: {
        fontSize: 16,
    },
});

export default SignUp;