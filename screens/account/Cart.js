import React, { useContext, useState, useEffect } from 'react';
import { View, ScrollView, Text, StyleSheet, Alert, Image,TouchableWithoutFeedback,TouchableOpacity } from 'react-native';
import Colors from '../../themes/Colors';
import Icon from 'react-native-vector-icons/Ionicons';
import { AuthContext } from '../../context/AuthContext';
import { ListItem } from 'react-native-elements'
import Spinner from '../../components/Other/Spinner';
import { Button, Card,  BottomSheet, CheckBox } from 'react-native-elements';
import InputSpinner from "react-native-input-spinner";
import { listCarts } from '../../services/cart';
import SmallCard from '../../components/Card/SmallCard';
import ListCartItems from '../../components/List/ListCartItems';
import Alert1 from '../../components/Other/Alert';

const Cart = ({ navigation }) => {
    const { jwt } = useContext(AuthContext);
    const [visible, setVisible] = useState(false);

    const [checked, setChecked] = useState(false);
    

    const [run, setRun] = useState(false);
    const [carts, setCarts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

   


    const init = () => {
        setError('');
        setSuccess('');
        setIsLoading(true);
        listCarts(jwt._id, jwt.accessToken, { limit: '1000', page: '1' })
            .then((data) => {
                if (data.error) setError(data.error);
                else if (data.carts.length <= 0)
                {
                    setSuccess('Your cart is empty.');
                    
                    setCarts([]);
                }
                    
                else
                {
                    
                    setCarts(data.carts);
                   
                } 
                setIsLoading(false);
            })
            .catch((error) => {
                setError('Server error');
                setIsLoading(false);
            });
    };
    useEffect(() => {
        init();

    }, [run]);
   

    return <View style={styles.container}>
        <ScrollView style={{ marginBottom: 2 }}>
        {isLoading && <Spinner />}
        
        {error ? <Alert1 type='error' content={error} /> : null}

{success ?
    <Alert1 type='success' content={success} /> : null}

            {
               carts.length>0&& carts.map((cart, index) => {
                    return (
                        <Card containerStyle={{
                            padding: 0,
                            margin: 0,
                            
                        }}
                        key={index}
                        >
                            <Card.Title style={{

                                color: Colors.black,
                                textAlign: 'left',
                                justifyContent:'center',
                                fontSize:16,
                                padding: 5

                            }}
                                
                            >
                               
                               <SmallCard navigation={navigation} type='store' item={cart.storeId} />
                            </Card.Title>
                            <Card.Divider />
                            {cart.storeId &&
                                            !cart.storeId.isActive && (
                                                <Alert1 type='error' content="This store is banned by GoodDeal!" />
                                            )}

                                        {cart.storeId &&
                                            cart.storeId.isActive &&
                                            !cart.storeId.isOpen && (
                                                <Alert1 type='error' content="This store is closed, can't order in this time!" />
                                            )}
                                             {cart.storeId &&
                                            cart.storeId.isActive &&
                                            cart.storeId.isOpen && (
                                                <ListCartItems
                                                navigation={navigation}
                                                    cartId={cart._id}
                                                    storeId={cart.storeId._id}
                                                    userId={cart.userId._id}
                                                    onRun={() => setRun(!run)}
                                                />
                                            )}
                           
                        </Card>
                    );
                })
            }



        </ScrollView >


        


    </View>





}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        height: '100%',
        backgroundColor: Colors.grey,

    },


});

export default Cart;