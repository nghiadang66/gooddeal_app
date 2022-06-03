import React, { useState, useContext } from 'react';
import { View, Text, ScrollView, Dimensions, StyleSheet } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { VendorContext } from '../context/VendorContext';
import { listOrdersByStore } from '../services/order';
import { listProductsForManager } from '../services/product';
import { groupByDate, groupBySold } from '../helper/groupBy';
import { lineData, pieData } from '../helper/formatData';
import { humanReadableDate } from '../helper/humanReadable';
import Spinner from '../components/Other/Spinner';
import Alert from '../components/Other/Alert';
import Button from '../components/Button/Button';
import Picker from '../components/Button/Picker';
import {
    LineChart,
    BarChart,
    PieChart,
} from "react-native-chart-kit";
import { Table, Row, Rows } from 'react-native-table-component';
import useUpdateEffect from '../hooks/useUpdateEffect';
import Colors from '../themes/Colors';

const screenWidth = Dimensions.get("window").width;
const groupByFunc = {
    order: groupByDate,
    product: groupBySold,
};
const titles = {
    order: 'Sales statistics by orders',
    product: 'Sales statistics by products',
};

const VendorHome = ({ navigation, route }) => {
    const { jwt } = useContext(AuthContext);
    const { isLoading, error, success, storeProfile } = useContext(VendorContext);

    const [items, setItems] = useState({
        order: [],
        product: [],
    });
    const [sizes, setSizes] = useState({
        order: 0,
        product: 0,
    });
    const [options, setOptions] = useState({
        flag: 'order',
        by: 'month',
        sliceEnd: 6,
        type: 'line',
    });
    const [isLoading1, setIsLoading1] = useState(false);
    const [error1, setError1] = useState(false);

    const getData = () => Promise.all([
        listOrdersByStore(
            jwt._id,
            jwt.accessToken,
            {
                search: '',
                limit: 1000,
                sortBy: 'createdAt',
                order: 'desc',
                page: 1,
                status: 'Delivered',
            },
            storeProfile._id,
        ),
        listProductsForManager(
            jwt._id,
            jwt.accessToken,
            {
                search: '',
                sortBy: 'sold',
                isActive: 'true',
                order: 'desc',
                limit: 1000,
                page: 1,
            },
            storeProfile._id,
        ),
    ]);

    const init = () => {
        setError1(false);
        setIsLoading1(true);

        getData()
        .then(([
            orderData,
            productData,
        ]) => {
            setItems({
                order: orderData.orders.reverse(),
                product: productData.products,
            });
            setSizes({
                order: orderData.size,
                product: productData.size,
            });
        })
        .catch(err => {
            setError1('Server Error');
        })
        .finally(() => {
            setIsLoading1(false);
        });
    }

    useUpdateEffect(() => {
        init();
    }, [jwt, storeProfile]);

    const redirect = () => navigation.navigate('HomeTabNav');

    return  (
        <View style={styles.container}>
            {!isLoading && !error && success && (
                <View style={styles.container}>
                    {!isLoading1 && !error1 && (
                        <ScrollView>
                            <View style={[styles.optionWrapper, styles.mt12]}>
                                <View style={[styles.optionBtn, styles.mr6]}>
                                    <Button
                                        type='primary'
                                        title={sizes.product + ' products'}
                                        onPress={()=> setOptions({
                                            ...options,
                                            flag: 'product',
                                        })}
                                        outline={options.flag !== 'product'}
                                    />
                                </View>

                                <View style={styles.optionBtn}>
                                    <Button
                                        type='pinky'
                                        title={sizes.order + ' orders'}
                                        onPress={()=> setOptions({
                                            ...options,
                                            flag: 'order',
                                        })}
                                        outline={options.flag !== 'order'}
                                    />
                                </View>
                            </View>

                            <View style={styles.optionWrapper}>
                                <View style={[styles.optionBtn, styles.mr6]}>
                                    <Picker
                                        prompt='select chart type'
                                        selectedValue={options.type}
                                        items={['line', 'bar', 'pie']}
                                        onValueChange={(value) => 
                                            setOptions({
                                                ...options,
                                                type: value,
                                            })
                                        }
                                    />
                                </View>

                                <View style={styles.optionBtn}>
                                    {options.flag === 'order' ? (
                                        <Picker
                                            prompt='select chart unit'
                                            selectedValue={options.by}
                                            items={['date', 'month', 'year']}
                                            onValueChange={(value) =>
                                                setOptions({
                                                    ...options,
                                                    by: value,
                                                })
                                            }
                                        />
                                    ) : (
                                        <Picker
                                            prompt='select chart unit'
                                            selectedValue={options.sliceEnd.toString()}
                                            items={['3', '6', '10', '50', '100']}
                                            onValueChange={(value) =>
                                                setOptions({
                                                    ...options,
                                                    sliceEnd: parseInt(value),
                                                })
                                            }
                                        />
                                    )}
                                </View>
                            </View>

                            {sizes[options.flag] > 0 ? (
                                <View style={[styles.container, styles.mt12]}>
                                    <Text style={[styles.heading, styles.m6]}>
                                        {titles[options.flag]}
                                    </Text>

                                    {options.type === 'line' &&
                                        <>
                                            {
                                                sizes[options.flag] > 1 ? (
                                                    <LineChart
                                                        data={
                                                            lineData(
                                                                groupByFunc[options.flag](
                                                                    items[options.flag], 
                                                                    options.by,
                                                                    options.sliceEnd,
                                                                ),
                                                            )
                                                        }
                                                        width={screenWidth}
                                                        height={220}
                                                        chartConfig={styles.chartConfig}
                                                    />
                                                ) : (
                                                    <Alert type={'error'} content={'Can not draw chart, try choose other type!'} />
                                                )
                                            }
                                        </>
                                    }

                                    {options.type === 'bar' && (
                                        <BarChart
                                            data={
                                                lineData(
                                                    groupByFunc[options.flag](
                                                        items[options.flag], 
                                                        options.by,
                                                        options.sliceEnd,
                                                    ),
                                                    titles[options.flag],
                                                )
                                            }
                                            width={screenWidth}
                                            height={220}
                                            chartConfig={styles.chartConfig}
                                            verticalLabelRotation={30}
                                        />
                                    )}

                                    {options.type === 'pie' && (
                                        <PieChart
                                            data={
                                                pieData(
                                                    groupByFunc[options.flag](
                                                        items[options.flag], 
                                                        options.by,
                                                        options.sliceEnd,
                                                    ),
                                                    Colors.muted,
                                                    12,
                                                )
                                            }
                                            width={screenWidth}
                                            height={220}
                                            chartConfig={styles.chartConfig}
                                            accessor={"value"}
                                            backgroundColor={Colors.white}
                                            avoidFalseZero={true}
                                        />
                                    )}
                                </View>
                            ) : (
                                <Alert type={'error'} content={'Can not draw chart, try choose other type!'} />
                            )}

                            <View style={[styles.container, styles.mt12, styles.mb12]}>
                                <Text style={[styles.heading, styles.m6]}>
                                    Top 6 {options.flag}s
                                </Text>

                                <View style={styles.tableContainer}>
                                    <Table borderStyle={styles.table}>
                                    <Row 
                                        data={options.flag === 'order' ? ['Order', 'Date'] : ['Product', 'Sold']}
                                        style={styles.head}
                                        textStyle={[styles.m6, styles.tw]}
                                    />
                                    <Rows 
                                        data={
                                            options.flag === 'order' ?
                                            items.order
                                                .slice(-6)
                                                .reverse()
                                                .map((item) => [item._id, humanReadableDate(item.createdAt)]) :
                                            items.product
                                                .slice(0, 6)
                                                .map((item) => [item.name, item.sold])   
                                        }
                                        widthArr={
                                            options.flag === 'order' ?
                                            [screenWidth * 0.5, screenWidth * 0.5 - 14] :
                                            [screenWidth * 0.7, screenWidth * 0.3 - 14]
                                        }
                                        textStyle={styles.m6}
                                    />
                                    </Table>
                                </View>
                            </View>
                        </ScrollView>
                    )}

                    {isLoading1 && <Spinner />}
                    {error1 ? <Alert type={'error'} /> : null}
                </View>
            )}

            {isLoading && <Spinner />}
            {error ? redirect : null}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    optionWrapper: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    optionBtn: {
        flex: 1,
    },
    chartConfig: {
        backgroundGradientFrom: Colors.white,
        backgroundGradientFromOpacity: 1,
        backgroundGradientTo: Colors.white,
        backgroundGradientToOpacity: 1,
        color: () => Colors.primary,
        strokeWidth: 2,
        barPercentage: 0.5,
        useShadowColorFromDataset: false,
    },
    heading: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.primary,
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
    mb12: {
        marginBottom: 12,
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

export default VendorHome;