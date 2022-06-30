import  React, {useState,useContext, useEffect} from 'react';
import { View, Text, Image, StyleSheet,Alert } from 'react-native';

import { ListItem } from 'react-native-elements'
import {  Divider } from 'react-native-elements';
import { STATIC_URL } from '../../config';
import Colors from '../../themes/Colors';
import Alert1 from '../Other/Alert';

import { formatPrice } from '../../helper/formatPrice';

import { listItemsByCart } from '../../services/cart';
import { AuthContext } from '../../context/AuthContext';


const ListItems = ({ cartId = '', storeId = '', userId = ''}) => {
    const { jwt } = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(false);

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
   
    const [items, setItems] = useState([]);
    

    const init = () => {
        setError('');
        setSuccess('');
        setIsLoading(true);
        listItemsByCart(jwt._id, jwt.accessToken, cartId)
            .then(async (data) => {
                if (data.error) setError(data.error);
                else {
                    setItems(data.items);
                    
                }
                setIsLoading(false);
            })
            .catch((error) => {
                setError('Server Error');
                setIsLoading(false);
            });
    };
    
    useEffect(() => {
        if (cartId) init();
    }, [cartId, storeId, userId]);

    
    
    return (
        
<>

            {
                items.map((item, index) => {
                    return (
                        
                            <View style={{ flexDirection: 'row' }} key={index}>
                                
                                <Image
                                    source={{ uri:item.productId && STATIC_URL + item.productId.listImages[0] }}
                                    style={{ width: 70, height: 70, resizeMode: 'contain', marginRight: 10 }}

                                />


                                <ListItem.Content>
                                    <ListItem.Title >{item.productId && item.productId.name}</ListItem.Title>
                                    <ListItem.Subtitle>
                                    {item.styleValueIds &&
                                    item.styleValueIds.map((value, index) => (
                                        <Text key={index}>
                                            {value.styleId &&
                                                value.styleId.name}
                                            : {value.name} {' '} 
                                        </Text>
                                       
                                    ))}
                                        </ListItem.Subtitle>
                                       
                                
                                    
                                    <ListItem.Subtitle>
                                        <View style={styles.price}>
                                            <Text style={styles.oldPrice}>
                                                <Text style={[styles.unit, styles.oldPrice]}>đ</Text>
                                                {item.productId &&
                                        item.productId.price &&
                                        formatPrice(
                                            item.productId &&
                                                item.productId.price
                                                    .$numberDecimal,
                                        )}
                                            </Text>
                                            <Text style={styles.newPrice}>
                                                <Text style={[styles.unit, styles.newPrice]}>đ</Text>
                                                {item.productId &&
                                        item.productId.promotionalPrice &&
                                        formatPrice(
                                            item.productId &&
                                                item.productId.promotionalPrice
                                                    .$numberDecimal,
                                        )} x {item.count}
                                            </Text>
                                        </View>
                                    </ListItem.Subtitle>
                                    {item.productId && !item.productId.isActive && (
                                         <Alert1 type='error' content="The product is banned by GoodDeal!" />
                             
                            )}

                            {item.productId &&
                                item.productId.isActive &&
                                !item.productId.isSelling && (
                                    <Alert1 type='error' content="The product is out of business, please delete it from your cart, you can continue with others!" />
                                    
                                )}

                            {item.productId &&
                                item.productId.isActive &&
                                item.productId.isSelling &&
                                item.productId.quantity <= 0 && (
                                    <Alert1 type='error' content="The product is sold out, please delete it from your cart, you can continue with others!" />
                                
                                )}

                            {item.productId &&
                                item.productId.isActive &&
                                item.productId.isSelling &&
                                item.productId.quantity > 0 &&
                                item.productId.quantity < item.count && (
                                    <Alert1 type='error' content={'Only'+item.productId.quantity+'products left, please update the count!'}/>
                                  
                                )}
                                </ListItem.Content>
                            </View>
                     
                    );
                })
            }
            <Divider orientation="horizontal" />
           
          
               
            
</>
            





       
    );
}

const styles = StyleSheet.create({
    price: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        flexWrap: 'wrap-reverse',
        marginBottom: 12,
    },
    unit: {
        textDecorationLine: 'underline',
    },
    oldPrice: {
        fontSize: 15,
        color: Colors.muted,
        textDecorationLine: 'line-through',
        marginRight: 12,
    },
    newPrice: {
        fontSize: 17,
        fontWeight: 'bold',
        color: Colors.primary,
    },
    
});

export default ListItems;