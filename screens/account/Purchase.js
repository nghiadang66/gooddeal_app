import React, { useState, useEffect, useContext } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import { listOrdersByUser } from '../../services/order';
import { Table, Row, Rows } from 'react-native-table-component';
import Button from '../../components/Button/Button';
import Spinner from '../../components/Other/Spinner';
import Alert from '../../components/Other/Alert';
import Colors from '../../themes/Colors';
import { humanReadableDate } from '../../helper/humanReadable';
import { formatPrice } from '../../helper/formatPrice';
import SmallCard from '../../components/Card/SmallCard';
import Pagination from '../../components/Other/Pagination';
import Picker from '../../components/Form/Picker';

const sttItems = [
    {
        label: 'All',
        value: '',
    },
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
        label: 'Delivered',
        value: 'Delivered',
    },
    {
        label: 'Cancelled',
        value: 'Cancelled',
    },
];

const Purchase = ({ navigation, route }) => {
    const { jwt } = useContext(AuthContext);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);

    const [orders, setOrders] = useState([]);
    const [pagination, setPagination] = useState({
        size: 0,
    });
    const [filter, setFilter] = useState({
        search: '',
        status: '',
        sortBy: 'createdAt',
        order: 'desc',
        limit: 5,
        page: 1,
    });

    const getOrders = () => {
        setError('');
        setIsLoading(true);
        listOrdersByUser(jwt._id, jwt.accessToken, filter)
            .then(data => {
                setOrders(data.orders);
                setPagination({
                    size: data.size,
                    pageCurrent: data.filter.pageCurrent,
                    pageCount: data.filter.pageCount,
                });
            })
            .catch(error => setError('Server Error'))
            .finally(() => setIsLoading(false));
    };

    useEffect(() => {
        getOrders();
    }, [jwt, filter]);

    const handleChangePage = (newPage) => {
        setFilter({
            ...filter,
            page: newPage,
        });
    };

    return (
        <ScrollView>
            <View style={[styles.container, styles.m6]}>
                <Picker
                    prompt='Select Order Status'
                    items={sttItems}
                    selectedValue={filter.status}
                    onChange={(value) => setFilter({
                        ...filter,
                        status: value,
                        page: 1,
                    })}
                />

                {!isLoading && !error && (
                    <>
                        <Text style={styles.result}>{pagination.size} results</Text>
                        <ScrollView horizontal={true}>
                            <View style={styles.tableContainer}>
                                <Table borderStyle={styles.table}>
                                    <Row 
                                        data={['#', 'Order', 'Created at', 'Total', 'Seller', 'Delivery', 'Payment', 'Status', '']}
                                        style={styles.head}
                                        widthArr={[30, 150, 150, 120, 240, 180, 100, 100, 150]}
                                        textStyle={styles.textHead}
                                    />
                                </Table>

                                <Table borderStyle={styles.table}>
                                    <Rows
                                        data={orders.map((order, index) => [
                                            index + (filter.limit * (filter.page - 1)),
                                            order._id,
                                            humanReadableDate(order.createdAt),
                                            order.amountFromUser ?
                                                formatPrice(order.amountFromUser.$numberDecimal) :
                                                0,
                                            <View style={styles.m6}>
                                                <SmallCard navigation={navigation} type='store' item={order.storeId} />
                                            </View>,
                                            <View style={styles.m6}>
                                                <Text>
                                                    {order.deliveryId && order.deliveryId.name}
                                                    {' - '}
                                                    {order.deliveryId ? formatPrice(order.deliveryId.price.$numberDecimal) : 0}
                                                </Text>
                                            </View>,
                                            <View style={styles.m6}>
                                                <Text style={{ color: order.isPaidBefore ? Colors.gold : Colors.primary }}>
                                                    {order.isPaidBefore ? 'Paypal' : 'On delivery'}
                                                </Text>
                                            </View>,
                                            <View style={styles.m6}>
                                                <Text style={{ color: Colors[sttColor[order.status]] }}>
                                                    {order.status}
                                                </Text>
                                            </View>,
                                            <View style={styles.m6}>
                                                <Button title='Detail' onPress={() => navigation.navigate('Order', { orderId: order._id })} />
                                            </View>
                                        ])}
                                        widthArr={[30, 150, 150, 120, 240, 180, 100, 100, 150]}
                                        textStyle={styles.m6}
                                    />
                                </Table>
                            </View>
                        </ScrollView>
                        <View style={[styles.container, styles.m6]}>
                            <Pagination pagination={pagination} onChangePage={handleChangePage} />
                        </View>
                    </>
                )}
                {isLoading && <Spinner />}
                {error ? <Alert type='error' content={error} /> : null}
            </View>   
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    result: {
        fontSize: 16,
        marginTop: 6,
        marginLeft: 2,
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
    },
    m6: {
        margin: 6 
    },
});

const sttColor = {
    'Not processed': 'black',
    Processing: 'primary',
    Shipped: 'fun',
    Delivered: 'success',
    Cancelled: 'danger',
}

export default Purchase;