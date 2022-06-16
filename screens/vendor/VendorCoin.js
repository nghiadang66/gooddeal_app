import React, { useState, useEffect, useContext } from 'react';
import { View, Text, ScrollView, Dimensions, StyleSheet } from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import { VendorContext } from '../../context/VendorContext';
import { listTransactionsByStore } from '../../services/transaction';
import { Table, Row, Rows } from 'react-native-table-component';
import Alert from '../../components/Other/Alert';
import Spinner from '../../components/Other/Spinner';
import Pagination from '../../components/Other/Pagination';
import Colors from '../../themes/Colors';
import Icon from 'react-native-vector-icons/Ionicons';
import FloatBtn from '../../components/Button/FloatBtn';
import { humanReadableDate } from '../../helper/humanReadable';
import { formatPrice } from '../../helper/formatPrice';

const dimensions = Dimensions.get('screen');

const VendorCoin = ({ navigation, route }) => {
    const [isloading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const [transactions, setTransactions] = useState([]);
    const [pagination, setPagination] = useState({
        size: 0,
    });
    const [filter, setFilter] = useState({
        sortBy: 'createdAt',
        order: 'desc',
        limit: 6,
        page: 1,
    });

    const { jwt } = useContext(AuthContext);
    const { storeProfile } = useContext(VendorContext);
 
    const init = () => {
        setError('');
        setIsLoading(true);
        listTransactionsByStore(jwt._id, jwt.accessToken, filter, storeProfile._id)
                .then(data => {
                    setTransactions(data.transactions);
                    setPagination({
                        size: data.size,
                        pageCurrent: data.filter.pageCurrent,
                        pageCount: data.filter.pageCount,
                    });
                })
                .catch((error) => setError('Server Error'))
                .finally(() => setIsLoading(false));
    };

    useEffect(() => {
        init();
    }, [jwt, filter]);

    const handleChangePage = (newPage) => {
        setFilter({
            ...filter,
            page: newPage,
        });
    };

    return (
        <>
            <FloatBtn icon='wallet' type='gold' onPress={() => navigation.navigate('VendorWithdraw')} />
            <ScrollView>
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

                <View style={[styles.container, styles.mv12]}>
                    {!isloading && !error && (
                        <View style={styles.tableContainer}>
                            <Table borderStyle={styles.table}>
                                <Row 
                                    data={['#', 'Transaction', 'Created At', 'Amount', 'Status']}
                                    style={styles.head}
                                    widthArr={[24, dimensions.width * 0.5 - 98, dimensions.width * 0.5 - 100, 80, 80]}
                                    textStyle={styles.textHead}
                                />
                            </Table>

                            <Table borderStyle={styles.table}>
                                <Rows
                                    data={transactions.map((transaction, index) => [
                                        index + (filter.limit * (filter.page - 1)),
                                        transaction._id,
                                        humanReadableDate(transaction.createdAt),
                                        <Text style={styles.textCenter}>
                                            {transaction.amount ?
                                                formatPrice(transaction.amount.$numberDecimal) : 
                                                0
                                            }
                                        </Text>,
                                        <Text style={[styles.textCenter, { color: transaction.isUp  ? Colors.fun : Colors.danger }]}>
                                            {transaction.isUp ? 'in' : 'out'}
                                        </Text>
                                    ])}
                                    widthArr={[24, dimensions.width * 0.5 - 98, dimensions.width * 0.5 - 100, 80, 80]}
                                    textStyle={styles.m6}
                                />
                            </Table>
                        </View>
                    )}

                    {isloading && <Spinner />}
                    {error ? <Alert type='error' content={error} /> : null} 
                </View>

                <View style={[styles.container, styles.m6]}>
                    <Pagination pagination={pagination} onChangePage={handleChangePage} />
                </View>
            </ScrollView>
        </>
    )
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
    mv12: {
        marginVertical: 12,
    },
    textCenter: {
        textAlign: 'center',
    },
    icon: {
        fontSize: 32,
        color: Colors.gold,
        margin: 6,
    },
    wallet: {
        fontSize: 24,
        // color: Colors.gold,
    }
});

export default VendorCoin;