import React, { useState, useEffect, useContext, useRef } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { VendorContext } from '../context/VendorContext';
import { listProductsForManager, sellOrStoreProduct } from '../services/product';
import { Table, Row, Rows } from 'react-native-table-component';
import { formatPrice } from '../helper/formatPrice';
import { humanReadableDate } from '../helper/humanReadable';
import { groupByStyle } from '../helper/groupBy';
import Button from '../components/Button/Button';
import Spinner from '../components/Other/Spinner';
import Alert from '../components/Other/Alert';
import Search from '../components/Other/Search';
import Image from '../components/Other/Image';
import Pagination from '../components/Other/Pagination';
import FloatBtn from '../components/Button/FloatBtn';
import { createTwoButtonAlert } from '../components/Other/Confirm';
import Colors from '../themes/Colors';

const VendorProduct = ({ navigation, route }) => {
    const { jwt } = useContext(AuthContext);
    const { storeProfile } = useContext(VendorContext);
    const typingTimeoutRef = useRef(null);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);
    const [run, setRun] = useState(false);

    const [products, setProducts] = useState([]);
    const [pagination, setPagination] = useState({
        size: 0,
    });
    const [keyword, setKeyword] = useState('');
    const [filter, setFilter] = useState({
        search: '',
        sortBy: 'name',
        isSelling: true,
        order: 'asc',
        limit: 3,
        page: 1,
    });

    const getProducts = () => {
        setError(false);
        setIsLoading(true);
        listProductsForManager(jwt._id, jwt.accessToken, filter, storeProfile._id)
            .then(data => {
                setProducts(data.products);
                setPagination({
                    size: data.size,
                    pageCurrent: data.filter.pageCurrent,
                    pageCount: data.filter.pageCount,
                });
            })
            .catch(err => {
                setError('Server Error');
            })
            .finally(() => {
                setIsLoading(false);
            })
    }

    useEffect(() => {
        getProducts();
    }, [jwt, storeProfile, filter, run]);

    const onChangeText = (search) => {
        setKeyword(search);
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }
        typingTimeoutRef.current = setTimeout(() => setFilter({
            ...filter,
            search: search,
            page: 1,
        }), 600);
    }

    const handleChangePage = (newPage) => {
        setFilter({
            ...filter,
            page: newPage,
        });
    };

    const handleSellOrStore = (productId, flag) => {
        const value = { isSelling: !flag };
        sellOrStoreProduct(jwt._id, jwt.accessToken, value, storeProfile._id, productId)
            .then()
            .catch()
            .finally(() => setRun(!run));
    };

    return  (
        <>
            <FloatBtn onPress={() => navigation.navigate('AddProduct')} />
            <ScrollView>
                <View style={[styles.rowContainer, styles.mt12]}>
                    <View style={[styles.optionBtn, styles.mr6]}>
                        <Button
                            type='primary'
                            title='Selling'
                            onPress={()=> setFilter({
                                ...filter,
                                isSelling: true, 
                                page: 1,
                            })}
                            outline={!filter.isSelling}
                        />
                    </View>

                    <View style={styles.optionBtn}>
                        <Button
                            type='secondary'
                            title='Stored'
                            onPress={()=> setFilter({
                                ...filter,
                                isSelling: false,
                                page: 1,
                            })}
                            outline={filter.isSelling}
                        />
                    </View>
                </View>

                <View style={styles.container}>
                    <Search
                        onChangeText={onChangeText}
                        value={keyword}
                    />
                </View>

                <View style={styles.container}>
                    {!isLoading && !error && (
                        <>
                        <Text style={styles.result}>{pagination.size} results</Text>
                        <ScrollView horizontal={true}>
                            <View style={styles.tableContainer}>
                                    <Table borderStyle={styles.table}>
                                        <Row 
                                            data={['#', 'Name', 'Images', 'Description', 'Price', 'Promotion', 'Quantity', 'Sold', 'Category', 'Styles', 'License', 'Created at', '']}
                                            style={styles.head}
                                            widthArr={[24, 120, 450, 450, 100, 100, 66, 66, 100, 150, 100, 120, 150]}
                                            textStyle={[styles.m6, styles.tw]}
                                        />
                                    </Table>
                                    <Table borderStyle={styles.table}>
                                        <Rows 
                                            data={products.map((product, index) => [
                                                index,
                                                product.name,
                                                <View style={[styles.rowContainer, styles.contentStart]}>
                                                    {product.listImages.map((img, index) => <Image key={index} image={img} type='product' />)}
                                                </View>,
                                                product.description,
                                                product.price ?
                                                    formatPrice(
                                                        product.price.$numberDecimal,
                                                    ) :
                                                    0,
                                                product.promotionalPrice ?
                                                    formatPrice(
                                                        product.promotionalPrice
                                                            .$numberDecimal,
                                                    ) :
                                                    0,
                                                product.quantity,
                                                product.sold,
                                                product.categoryId && product.categoryId.name,  
                                                <View style={[styles.container, styles.alignStart]}>
                                                    {groupByStyle(product.styleValueIds).map((list, index) => 
                                                        <View style={[styles.rowContainer, styles.flexWrap]}>
                                                            <Text key={index}>{list[0].styleId.name}: </Text>
                                                            {list.map((value, index) => <Text key={index}>{value.name}{index < list.length-1 && ', '}</Text>)}
                                                        </View>
                                                    )}
                                                </View>,
                                                <Text style={[styles.status, { color: product.isActive ? Colors.fun : Colors.danger }]}>
                                                    {product.isActive ? 'licensed' : 'unlicensed'}
                                                </Text>,
                                                humanReadableDate(product.createdAt),
                                                <View style={styles.container}>
                                                    <View style={styles.m6}>
                                                        <Button type='primary' title='Edit' onPress={() => navigation.navigate('EditProduct', { productId: product._id })} />
                                                    </View>
                                                    <View style={styles.m6}>
                                                        {filter.isSelling ? 
                                                            <Button 
                                                                type='secondary' 
                                                                title='Store' 
                                                                outline={true} 
                                                                onPress={() => createTwoButtonAlert(
                                                                    'Store Product',
                                                                    () => handleSellOrStore(product._id, true),
                                                                    product.name,
                                                                )}
                                                            /> :
                                                            <Button 
                                                                type='primary' 
                                                                title='Sell' 
                                                                outline={true} 
                                                                onPress={() => createTwoButtonAlert(
                                                                    'Sell Product',
                                                                    () => handleSellOrStore(product._id, false),
                                                                    product.name,
                                                                )}
                                                            />
                                                        }
                                                    </View>
                                                </View>,
                                            ])}
                                            widthArr={[24, 120, 450, 450, 100, 100, 66, 66, 100, 150, 100, 120, 150]}
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
                    {error ? <Alert type={'error'} /> : null}
                </View>
            </ScrollView>
        </>
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
    contentStart: {
        justifyContent: 'flex-start',
    },
    alignStart: {
        alignItems: 'flex-start',
    },
    flexWrap: {
        flexWrap: 'wrap',
    },
    optionBtn: {
        flex: 1,
    },
    result: {
        fontSize: 16,
        marginTop: 6,
        marginLeft: 2,
    },
    status: {
        fontSize: 14,
        marginLeft: 6,
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
    mt12: {
        marginTop: 12,
    },
    mr6: {
        marginRight: 6,
    },
    m6: {
        margin: 6 
    },
    tw: {
        color: Colors.white,
    },
});

export default VendorProduct;