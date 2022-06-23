import React, { useState, useEffect, useContext } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import { getOrderByUser, userCancelOrder, listItemsByOrder } from '../../services/order';
import Button from '../../components/Button/Button';
import Spinner from '../../components/Other/Spinner';
import Alert from '../../components/Other/Alert';
import Colors from '../../themes/Colors';
import { humanReadableDate } from '../../helper/humanReadable';
import { formatPrice } from '../../helper/formatPrice';
import SmallCard from '../../components/Card/SmallCard';
import { calcTime } from '../../helper/time';
import { createTwoButtonAlert } from '../../components/Other/Confirm';
import Image from '../../components/Other/Image';
import Link from '../../components/Other/Link';
import ReviewAndRatingBtn from '../../components/Button/ReviewAndRatingBtn';

const Order = ({ navigation, route }) => {
    const { jwt } = useContext(AuthContext);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);
    const [isLoading1, setIsLoading1] = useState(false);
    const [error1, setError1] = useState(false);
    const [success1, setSuccess1] = useState(false);
    const [isLoading2, setIsLoading2] = useState(false);
    const [error2, setError2] = useState(false);

    const [order, setOrder] = useState({});
    const [items, setItems] = useState([]);

    const getOrder = () => {
        setError('');
        setIsLoading(true);
        getOrderByUser(jwt._id, jwt.accessToken, route.params.orderId)
            .then(data => setOrder(data.order))
            .catch(error => setError('Server Error'))
            .finally(() => setIsLoading(false));

        setError2('');
        setIsLoading2(true);
        listItemsByOrder(jwt._id, jwt.accessToken, route.params.orderId)
            .then(data => setItems(data.items))
            .catch(error => setError2('Server Error'))
            .finally(() => setIsLoading2(false));
    };

    useEffect(() => {
        getOrder();
    }, [jwt, route.params.orderId]);

    const handleCancelOrder = () => {
        setError1('');
        setSuccess1('')
        setIsLoading1(true);
        const value = { status: 'Cancelled' };
        userCancelOrder(jwt._id, jwt.accessToken, value, route.params.orderId)
            .then(data => {
                if (data.error) {
                    setError(data.error);
                    setTimeout(() => {
                        setError('');
                    }, 3000);
                }
                else {
                    setOrder({
                        ...order,
                        status: 'Cancelled',
                    });
                    setSuccess1(data.success);
                    setTimeout(() => {
                        setSuccess1('');
                    }, 3000);
                }
            })
            .catch(error => {
                setError1('Server Error');
                setTimeout(() => {
                    setError1('');
                }, 3000);
            })
            .finally(() => setIsLoading1(false));
    }

    return (
        <ScrollView>
            <View style={styles.container}>
                {!isLoading && !error && (
                   <View style={styles.container}>
                        <View style={[styles.container, styles.m6]}>
                            <Text style={styles.heading}>
                                Order #{route.params.orderId}
                            </Text>


                            <View style={[styles.rowContainer, styles.m6]}>
                                {!isLoading1 && !error1 && !success1 && (
                                    <Text style={[styles.content, { color: Colors[sttColor[order.status]] }]}>
                                        {order.status}
                                    </Text>
                                )}

                                {isLoading1 && <Spinner />}
                                {error1 ? <Alert type='error' content={error1} /> : null}
                                {success1 ? <Alert type='success' content={success1} /> : null}
                                
                                {order.status === 'Not processed' ? (
                                    <Button
                                        type='danger'
                                        title='Cancel'
                                        onPress={() => createTwoButtonAlert('Cancel Order', handleCancelOrder, `Order #${route.params.orderId}`)}
                                        disabled={order.status !== 'Not processed' || calcTime(order.createdAt) >= 1}
                                    />
                                ) : null}
                            </View>
                        </View>

                        <View style={styles.wrapper}>
                            <Text style={styles.title}>Created at</Text>
                            <Text style={styles.content}>
                                {humanReadableDate(order.createdAt)}
                            </Text>

                            <Text style={styles.title}>Seller</Text>
                            <Text style={styles.content}>
                                <SmallCard navigation={navigation} type='store' item={order.storeId} />
                            </Text>
                        </View>

                        <View style={styles.wrapper}>
                            <Text style={styles.title}>Receiver</Text>
                            <Text style={styles.content}>
                                <SmallCard navigation={navigation} type='user' item={order.userId} />
                            </Text>

                            <Text style={styles.title}>Phone</Text>
                            <Text style={styles.content}>
                                {order.phone}
                            </Text>

                            <Text style={styles.title}>To address</Text>
                            <Text style={styles.content}>
                                {order.address}
                            </Text>
                        </View>

                        <View style={styles.wrapper}>
                            <Text style={styles.title}>Delivery unit</Text>
                            <Text style={styles.content}>
                                {order.deliveryId && order.deliveryId.name}
                                {' - '}
                                {order.deliveryId ? formatPrice(order.deliveryId.price.$numberDecimal) : 0}
                            </Text>

                            <Text style={styles.title}>Payment</Text>
                            <Text style={styles.content}>
                                {order.isPaidBefore
                                    ? 'Online payment'
                                    : 'Payment on delivery'}
                            </Text>
                        </View>

                        <View style={styles.wrapper}>
                            <Text style={styles.title}>List products</Text>
                            <Text style={[styles.content, { fontSize: 12 }]}>*Note: The products will sometimes differ from your original order, as it may have been updated</Text>
                        
                            <View style={styles.container}>
                                {!isLoading2 && !error2 && items.length > 0 && (
                                    <>
                                        {items.map((item, index) => (
                                            <View key={index} style={styles.rowContainer}>
                                                <Image
                                                    image={item.productId && item.productId.listImages[0]}
                                                    type='product'
                                                />

                                                <View style={[styles.container, styles.ml6]}>
                                                    <Link
                                                        title={item.productId && item.productId.name}
                                                        fontSize={20}
                                                        onPress={() => navigation.navigate('Product', {
                                                            productId: item.productId._id,
                                                        })}
                                                    />

                                                    <View style={[styles.container, styles.mr6]}>
                                                        {item.styleValueIds.map((value, index) => (
                                                            <Text key={index} style={styles.content}>
                                                                {value.styleId && value.styleId.name}
                                                                {': '}
                                                                {value.name}
                                                            </Text>
                                                        ))}
                                                    </View>

                                                    <View style={[styles.rowContainer, styles.m6, {justifyContent: 'flex-start'}]}>
                                                        <Text style={styles.oldPrice}>
                                                            <Text style={[styles.unit, styles.oldPrice]}>đ</Text>
                                                            {item.productId && item.productId.price && formatPrice(item.productId.price.$numberDecimal)}
                                                        </Text>
                                                        <Text style={styles.newPrice}>
                                                            <Text style={[styles.unit, styles.newPrice]}>đ</Text>
                                                            {item.productId && item.productId.promotionalPrice && formatPrice(item.productId.promotionalPrice.$numberDecimal)}
                                                            {' x '}
                                                            {item.count}
                                                        </Text>
                                                    </View>

                                                    {item.productId && item.productId.isActive && !item.productId.isSelling ?
                                                        <Alert type='error' content="The product is out of business, please remove it from your cart, you can continue with others!" /> :
                                                        null}

                                                    {item.productId && item.productId.isActive && item.productId.isSelling && item.productId.quantity <= 0 ?
                                                        <Alert type='error' content="The product is sold out, please remove it from your cart, you can continue with others!" /> :
                                                        null}

                                                    {item.productId && item.productId.isActive && item.productId.isSelling && item.productId.quantity > 0 && item.productId.quantity < item.count ?
                                                        <Alert type='error' content={`Only ${item.productId.quantity} products left, please update the count!`} /> :
                                                        null}
                                                </View>

                                                {order.status === 'Delivered' ? (
                                                        <ReviewAndRatingBtn
                                                            navigation={navigation}
                                                            orderId={route.params.orderId}
                                                            storeId={order.storeId && order.storeId._id}
                                                            productId={item.productId && item.productId._id}
                                                            item={item.productId}
                                                        />
                                                    ) : null}
                                            </View>
                                        ))}
                                    </>
                                )}
                            </View>
                        </View>

                        <View style={styles.wrapper}>
                            <Text style={styles.title}>{'Final total (include discounts)'}</Text>
                            <Text style={[styles.newPrice, styles.m6]}>
                                <Text style={[styles.unit, styles.newPrice]}>đ</Text>
                                {formatPrice(order.amountFromUser && order.amountFromUser.$numberDecimal)}
                            </Text>
                        </View>
                   </View> 
                )}
                {isLoading && <Spinner />}
                {error ? <Alert type='error' content={error} /> : null}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    wrapper: {
        backgroundColor: Colors.white,
        padding: 12,
        borderRadius: 3,
        marginBottom: 6,
    },
    heading: {
        fontSize: 20,
        textAlign: 'center',
    },
    title: {
        color: Colors.primary,
    },
    content: {
        fontSize: 16,
        paddingVertical: 6,
    },
    unit: {
        textDecorationLine: 'underline',
    },
    oldPrice: {
        fontSize: 16,
        color: Colors.muted,
        textDecorationLine: 'line-through',
        marginRight: 12,
    },
    newPrice: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.primary,
    },
    m6: {
        margin: 6,
    },
    ml6: {
        marginLeft: 6,
    },
    mr6: {
        marginRight: 6,
    }
});

const sttColor = {
    'Not processed': 'black',
    Processing: 'primary',
    Shipped: 'fun',
    Delivered: 'success',
    Cancelled: 'danger',
}

export default Order;