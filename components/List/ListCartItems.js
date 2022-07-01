import  React, {useState,useContext, useEffect} from 'react';
import { View, Text, Image, StyleSheet,Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { ListItem } from 'react-native-elements'
import { Button, Divider } from 'react-native-elements';
import { STATIC_URL } from '../../config';
import Colors from '../../themes/Colors';
import Alert1 from '../Other/Alert';
import UserLevelLabel from '../Label/UserLevelLabel';
import { formatPrice } from '../../helper/formatPrice';
import InputSpinner from "react-native-input-spinner";
import { listItemsByCart,updateCartItem,deleteFromCart } from '../../services/cart';
import { AuthContext } from '../../context/AuthContext';
import Spinner from '../Other/Spinner';
import { totalProducts } from '../../helper/total';


const ListCartItems = ({ navigation, cartId = '', storeId = '', userId = '', onRun }) => {
    const { jwt,level } = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(false);
    const [isConfirming, setIsConfirming] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [run, setRun] = useState(false);

    //const { level } = useSelector((state) => state.account.user);
  

    

    const [items, setItems] = useState([]);
    const [deleteItem, setDeleteItem] = useState({});
    const [totals, setTotals] = useState({
        totalPrice: 0,
        totalPromotionalPrice: 0,
        amountFromUser1: 0,
    });

    const init = () => {
        setError('');
        setSuccess('');
        setIsLoading(true);
        listItemsByCart(jwt._id, jwt.accessToken, cartId)
            .then(async (data) => {
                if (data.error) setError(data.error);
                else {
                    setItems(data.items);
                    const {
                        totalPrice,
                        totalPromotionalPrice,
                        amountFromUser1,
                    } = totalProducts(data.items, level);
                    setTotals({
                        totalPrice,
                        totalPromotionalPrice,
                        amountFromUser1,
                    });
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
    }, [cartId, storeId, userId,level, run]);

    const handlePress = (item) =>{
        navigation.navigate('Product', {
            productId: item.productId._id,
        });
    }
     

    const handleDelete = (item) => {
        if (!item) return;
        setDeleteItem(item);
        setIsConfirming(true);
    };

    const onSubmit = () => {
        setIsConfirming(false);
        setError('');
        setSuccess('');
        setIsLoading(true);
        deleteFromCart(jwt._id, jwt.accessToken, deleteItem._id)
            .then((data) => {
                if (data.error) setError(data.error);
                else {
                    setSuccess(data.success);
                
                    setRun(!run);
                    if (onRun) onRun();
                }
                
                setIsLoading(false);
                setTimeout(() => {
                    setError('');
                    setSuccess('');
                }, 3000);
            })
            .catch((error) => {
                setError('Server Error');
                setTimeout(() => {
                    setError('');
                }, 3000);
            });
    };

    const handleUpdate = (value, item) => {
        setError('');
        setSuccess('');
        setIsLoading(true);
        updateCartItem(jwt._id, jwt.accessToken, { count: value }, item._id)
            .then((data) => {
                if (data.error) setError(data.error);
                else {
                    setSuccess(data.success);
                    setRun(!run);
                    if (onRun) onRun();
                }
                setIsLoading(false);
                setTimeout(() => {
                    setError('');
                    setSuccess('');
                }, 3000);
            })
            .catch((error) => {
                setError('Server Error');
                setTimeout(() => {
                    setError('');
                }, 3000);
            });
    };
    return (
<>
{isLoading && <Spinner />}

            {error ? <Alert1 type='error' content={error} /> : null}

            {success ?
                <Alert1 type='success' content={success} /> : null}
            {isConfirming && (
                Alert.alert(
                    "Delete item",
                    "Are you sure you want to delete item?",
                    [

                        {
                            text: "No",
                            onPress: () => setIsConfirming(false)
                        },
                        {
                            text: "Yes",
                            onPress:()=> onSubmit()
                        }



                    ]
                )
            )}

            {
                items.map((item, index) => {
                    return (
                        <ListItem.Swipeable key={index}
                            rightContent={
                                <Button
                                    title="Delete"
                                    icon={<Icon
                                        name="trash-outline"
                                        size={21}
                                        color="white"
                                    />}
                                    buttonStyle={{ minHeight: '100%', backgroundColor: 'red' }}
                                    onPress={() => {
                                        handleDelete(
                                            item
                                          
                                          )
                                    }}
                                />
                            }


                        >
                            <View style={{ flexDirection: 'row' }}>
                                {/* <CheckBox

                                    checked={checked}
                                    onPress={() => showCheck()}
                                /> */}
                                <Image
                                    source={{ uri:item.productId && STATIC_URL + item.productId.listImages[0] }}
                                    style={{ width: 70, height: 70, resizeMode: 'contain', marginRight: 10 }}

                                />


                                <ListItem.Content>
                                    <ListItem.Title onPress={() => { handlePress(item) }}>{item.productId && item.productId.name}</ListItem.Title>
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
                                        {item.productId &&
                                item.productId.isActive &&
                                item.productId.isSelling &&
                                item.productId.quantity > 0 && (
                                    <ListItem.Subtitle>
                                    

                                        <View style={{ marginLeft: 20,marginTop:5 }}>
                                            <InputSpinner
                                                max={item.productId.quantity}
                                                min={1}
                                                step={1}
                                                color='white'
                                                value={item.count}
                                                onChange={(value) => {
                                                
                                                   handleUpdate(value, item)
                                                }}
                                                style={{ marginLeft: 30 }}
                                                buttonTextColor='black'
                                                showBorder={true}
                                                fontSize={14}
                                                height={35}
                                                width={32}

                                            />
                                        </View>

                                    </ListItem.Subtitle>
                                )}
                                    
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
                        </ListItem.Swipeable>
                    );
                })
            }
            <Divider orientation="horizontal" />
            {items.reduce(
                (prev, item) =>
                    prev &&
                    item.productId &&
                    item.productId.isActive &&
                    item.productId.isSelling &&
                    item.productId.quantity > 0 &&
                    item.productId.quantity >= item.count,
                true,
            ) && (
                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', }}>
                
                <View style={{marginRight:20}}>
                                            <Text style={styles.oldPrice}>
                                                <Text style={[styles.unit, styles.oldPrice]}>đ</Text>
                                                {formatPrice(totals.totalPrice)}
                                            </Text>
                                            <Text style={styles.newPrice}>
                                                <Text style={[styles.unit, styles.newPrice]}>đ</Text>
                                                {formatPrice(totals.totalPromotionalPrice)}
                                            </Text>
                                        </View>
                <View style={{marginRight:10}}>
                <UserLevelLabel level={level} />
                <Text style={styles.total}>
                    <Text style={[styles.unit, styles.newPrice]}>đ</Text>
                    {formatPrice(totals.amountFromUser1)}
                </Text>
                </View>
               
                <Button
                    title="Checkout"

                    buttonStyle={{ height: 60, width: 100, backgroundColor: Colors.primary, }}
                    onPress={() => {
                   
                        navigation.navigate('Checkout',
                        {cartId:cartId,
                        storeId:storeId,
                        userId:userId,
                        items:items
                    })
                    }}
                >

                </Button>
            </View>
               
            )}
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
    total: {
        fontSize: 17,
        fontWeight: 'bold',
        color: Colors.primary,
        marginRight: 10
    }
});

export default ListCartItems;