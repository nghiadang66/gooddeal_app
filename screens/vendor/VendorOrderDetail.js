import React, { useState, useEffect, useContext } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import { VendorContext } from '../../context/VendorContext';
import { getOrderByStore, vendorUpdateStatusOrder, listItemsByOrderByStore } from '../../services/order';
import Spinner from '../../components/Other/Spinner';
import Alert from '../../components/Other/Alert';
import Colors from '../../themes/Colors';
import { humanReadableDate } from '../../helper/humanReadable';
import { formatPrice } from '../../helper/formatPrice';
import SmallCard from '../../components/Card/SmallCard';
import { createTwoButtonAlert } from '../../components/Other/Confirm';
import Image from '../../components/Other/Image';
import Link from '../../components/Other/Link';
import { BackBtn } from '../../components/Button/HeaderBtn';
import Picker from '../../components/Form/Picker';

const sttItems = [
    {
        label: 'Not processed',
        value: 'Not processed',
    },
    {
        label: 'Processing',
        value: 'Processing',
    },
    {
        label: 'Shipped',
        value: 'Shipped',
    },
    {
        label: 'Cancelled',
        value: 'Cancelled',
    },
];

const VendorOrderDetail = ({ navigation, route }) => {
    const { jwt } = useContext(AuthContext);
    const { storeProfile } = useContext(VendorContext);

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
        getOrderByStore(jwt._id, jwt.accessToken, route.params.orderId, storeProfile._id)
            .then(data => setOrder(data.order))
            .catch(error => setError('Server Error'))
            .finally(() => setIsLoading(false));

        setError2('');
        setIsLoading2(true);
        listItemsByOrderByStore(jwt._id, jwt.accessToken, route.params.orderId, storeProfile._id)
            .then(data => setItems(data.items))
            .catch(error => setError2('Server Error'))
            .finally(() => setIsLoading2(false));
    };

    useEffect(() => {
        getOrder();
    }, [jwt, storeProfile, route.params.orderId]);

    const handleUpdateStatus = (value) => {
        createTwoButtonAlert('Update Order Status', () => onSubmit(value), value);
    }

    const onSubmit = (stt) => {
        const value = { status: stt };
        setError1('');
        setSuccess1('')
        setIsLoading1(true);
        vendorUpdateStatusOrder(jwt._id, jwt.accessToken, value, route.params.orderId, storeProfile._id)
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
                        status: stt,
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
                            <View style={styles.rowContainer}>
                                <BackBtn navigation={navigation} color='primary' />
                                <Text style={[styles.heading, styles.container]}>
                                    Order #{route.params.orderId}
                                </Text>
                            </View>


                            <View style={styles.rowContainer}>
                                {!isLoading1 && !error1 && !success1 && (
                                    <Text style={[{flex: 0.4}, styles.m6, { color: Colors[sttColor[order.status]] }]}>
                                        {order.status}
                                    </Text>
                                )}

                                {isLoading1 && <Spinner />}
                                {error1 ? <Alert type='error' content={error1} /> : null}
                                {success1 ? <Alert type='success' content={success1} /> : null}
                                
                                {(order.status === 'Not processed' || order.status === 'Processing') ? (
                                    <View style={[{flex: 0.6}, styles.m6]}>
                                        <Picker
                                            prompt='Update Order Status'
                                            items={sttItems}
                                            selectedValue={order.status} 
                                            onChange={(value) => handleUpdateStatus(value)}
                                        />
                                    </View>
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

                                                <View style={[styles.container, { marginLeft: 6}]}>
                                                    <Link
                                                        title={item.productId && item.productId.name}
                                                        fontSize={20}
                                                        onPress={() => navigation.navigate('Product', {
                                                            productId: item.productId._id,
                                                        })}
                                                    />

                                                    <View style={[styles.container, {marginRight: 6}]}>
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
    }
});

const sttColor = {
    'Not processed': 'black',
    Processing: 'primary',
    Shipped: 'fun',
    Delivered: 'success',
    Cancelled: 'danger',
}

export default VendorOrderDetail;