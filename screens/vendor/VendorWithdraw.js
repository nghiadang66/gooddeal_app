import React, { useState, useEffect, useContext } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import { VendorContext } from '../../context/VendorContext';
import { createTransactionByStore } from '../../services/transaction';
import Alert from '../../components/Other/Alert';
import Spinner from '../../components/Other/Spinner';
import Colors from '../../themes/Colors';
import { formatPrice } from '../../helper/formatPrice';
import { regexTest, numberTest } from '../../helper/test';
import { createTwoButtonAlert } from '../../components/Other/Confirm';
import Input from '../../components/Form/Input';
import Button from '../../components/Button/Button';
import Icon from 'react-native-vector-icons/Ionicons';

const VendorWithdraw = ({ navigation, route }) => {
    const [isloading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const { jwt } = useContext(AuthContext);
    const { storeProfile, setStoreProfile } = useContext(VendorContext);

    const [transaction, setTransaction] = useState({
        isUp: 'false',
        amount: '50000',
        currentPassword: '',
        isValidAmount: true,
        isValidCurrentPassword: true,
    });

    const handleChange = (name, isValidName, value) => {
        setTransaction({
            ...transaction,
            [name]: value,
            [isValidName]: true,
        });
    };

    const handleValidate = (isValidName, flag) => {
        if (isValidName === 'isValidAmount') {
            setTransaction({
                ...transaction,
                isValidAmount:
                    flag &&
                    parseFloat(transaction.amount) <= parseFloat(storeProfile.e_wallet.$numberDecimal),
            });
        } else
            setTransaction({
                ...transaction,
                [isValidName]: flag,
            });
    };

    const handleSubmit = () => {
        const { amount, currentPassword } = transaction;

        if (!jwt._id || !storeProfile._id ||!amount || !currentPassword) {
            setTransaction({
                ...transaction,
                isValidAmount:
                    numberTest('positive', amount) &&
                    parseFloat(transaction.amount) <= parseFloat(storeProfile.e_wallet.$numberDecimal),
                isValidCurrentPassword: regexTest('password', currentPassword),
            });
            return;
        }

        if (parseFloat(amount) > parseFloat(storeProfile.e_wallet.$numberDecimal)) {
            setTransaction({
                ...transaction,
                isValidAmount:
                    numberTest('positive', amount) &&
                    parseFloat(transaction.amount) <= parseFloat(storeProfile.e_wallet.$numberDecimal),
                isValidCurrentPassword: regexTest('password', currentPassword),
            });
            return;
        }

        if (!transaction.isValidAmount || !transaction.isValidCurrentPassword)
            return;

        createTwoButtonAlert('Create Transaction', onSubmit, `Withdraw ${formatPrice(transaction.amount)}`)
    };

    const onSubmit = () => {
        setError('');
        setSuccess('');
        setIsLoading(true);
        createTransactionByStore(jwt._id, jwt.accessToken, transaction, storeProfile._id)
            .then(data => {
                if (data.error) {
                    setError(data.error);
                    setTimeout(() => {
                        setError('');
                    }, 3000);
                }
                else {
                    setStoreProfile(data.store);
                    setSuccess('Withdraw successfully!');
                    setTimeout(() => {
                        setSuccess('');
                    }, 3000);
                }
            })
            .catch(error => {
                setError('Server error');
                setTimeout(() => {
                    setError('');
                }, 3000);
            })
            .finally(() => setIsLoading(false));
        };

    return (
        <ScrollView style={styles.container}>
            <View style={[styles.rowContainer, styles.m6]}>
                <Icon name={'wallet'} style={styles.icon} />
                <View style={styles.container}>
                    <Text style={styles.wallet}>
                        {storeProfile.e_wallet ? 
                            formatPrice(storeProfile.e_wallet.$numberDecimal) : 
                            0
                        }
                    </Text>
                </View>
            </View>

            <View style={styles.form}>
                <Text style={styles.title}>Amount</Text>
                <Input
                    type='number'
                    value={transaction.amount}
                    isValid={transaction.isValidAmount}
                    validator={'position|greaterThan50000'}
                    feedback={'Please provide a valid amount (>= 50.000 & <= your e-wallet).'}
                    onChange={value => handleChange('amount', 'isValidAmount',value)}
                    onValidate={value => handleValidate('isValidAmount', value)}
                />

                <Text style={styles.title}>Password</Text>
                <Input
                    type='password'
                    title='Current password'
                    defaultValue={''}
                    value={transaction.currentPassword}
                    isValid={transaction.isValidCurrentPassword}
                    feedback="Please provide a valid password."
                    validator="password"
                    onChange={(value) =>
                        handleChange(
                            'currentPassword',
                            'isValidCurrentPassword',
                            value,
                        )
                    }
                    onValidate={(flag) =>
                        handleValidate('isValidCurrentPassword', flag)
                    }
                />

                {isloading && <Spinner />}
                {error ? <Alert type='error' content={error} /> : null}
                {success ? <Alert type='success' content={success} /> : null}

                <Button
                    title='Withdraw'
                    onPress={handleSubmit}
                />  
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    form: {
        flex: 1,
        padding: 12,
    },
    m6: {
        margin: 6 
    },
    icon: {
        fontSize: 32,
        color: Colors.gold,
        margin: 6,
    },
    wallet: {
        fontSize: 24,
        // color: Colors.gold,
    },
    title: {
        color: Colors.primary,
        marginLeft: 12,
    },
});

export default VendorWithdraw;