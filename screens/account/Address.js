import React, { useState, useEffect, useContext } from 'react';
import { View, ScrollView, Dimensions, StyleSheet } from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import { deleteAddresses } from '../../services/user';
import { Table, Row, Rows } from 'react-native-table-component';
import Button from '../../components/Button/Button';
import FloatBtn from '../../components/Button/FloatBtn';
import { createTwoButtonAlert } from '../../components/Other/Confirm';
import Colors from '../../themes/Colors';
import Spinner from '../../components/Other/Spinner';
import Alert from '../../components/Other/Alert';

const dimensions = Dimensions.get('screen');

const Address = ({ navigation, route }) => {
    const { jwt, userProfile, setUserProfile } = useContext(AuthContext);

    const [isloading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);

    const [addresses, setAddresses] = useState([]);
    
    const getAddresses = () => {
        setAddresses(() => userProfile.addresses ? userProfile.addresses : []);
    }

    useEffect(() => {
        getAddresses();
    }, [userProfile]);


    const handleDelete = (index) => {
        setError('');
        setSuccess('');
        setIsLoading(true);
        deleteAddresses(jwt._id, jwt.accessToken, index)
            .then(data => {
                setUserProfile(data.user)
                setSuccess(data.success);
                setTimeout(() => {
                    setSuccess('');
                }, 3000);
            })
            .catch(error => {
                setError('Server Error');
                setTimeout(() => {
                    setError('');
                }, 3000);
            })
            .finally(() => setIsLoading(false));
    }

    return (
        <View style={styles.container}>
            <FloatBtn onPress={
                () => addresses.length < 6 ?
                    navigation.navigate('AddAddress') :
                    createTwoButtonAlert('Not Active', ()=>{}, 'The limit is 6 addresses.')
                }
            />
            
            <ScrollView>
                <View style={styles.container}>
                    <View style={styles.tableContainer}>
                        <Table borderStyle={styles.table}>
                            <Row 
                                data={['#', 'Address', '']}
                                style={styles.head}
                                widthArr={[24, dimensions.width - 189, 150]}
                                textStyle={styles.textHead}
                            />
                        </Table>
                        <Table borderStyle={styles.table}>
                            <Rows
                                data={addresses.map((address, index) => [
                                    index,
                                    address,
                                    <View style={styles.container}>
                                        <View style={styles.m6}>
                                            <Button 
                                                type='primary' 
                                                title='Edit'
                                                onPress={() => navigation.navigate('EditAddress', { index: index, address: address })}
                                            />
                                        </View>

                                        <View style={styles.m6}>
                                            <Button 
                                                type='danger' 
                                                title='Del'
                                                onPress={() => createTwoButtonAlert('Delete Address', () => handleDelete(index), address)}
                                            />
                                        </View>
                                    </View>
                                ])}
                                widthArr={[24, dimensions.width - 189, 150]}
                                textStyle={styles.m6}
                            />
                        </Table>
                    </View>

                    {isloading && <Spinner />}
                    {error ? <Alert type='error' content={error} /> : null}
                    {success ? <Alert type='success' content={success} /> : null}
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    rowContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    tableContainer: {
        flex: 1,
        padding: 6,
        backgroundColor: Colors.white,
    },
    table: {
        borderWidth: 2,
        borderColor: Colors.fun,
    },
    head: { 
        height: 40,
        color: Colors.white,
        backgroundColor: Colors.fun,
    },
    textHead: {
        margin: 6,
        color: Colors.white,
        textAlign: 'center',
    },
    m6: {
        margin: 6 
    },
});

export default Address;