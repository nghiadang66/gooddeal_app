import React, { useState, useEffect, useContext } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { VendorContext } from '../context/VendorContext';
import { cancelStaff, deleteStaff } from '../services/store';
import { Table, Row, Rows } from 'react-native-table-component';
import useToggle from '../hooks/useToggle';
import FloatBtn from '../components/Button/FloatBtn';
import Button from '../components/Button/Button';
import Spinner from '../components/Other/Spinner';
import Alert from '../components/Other/Alert';
import Search from '../components/Other/Search';
import Image from '../components/Other/Image';
import { createTwoButtonAlert } from '../components/Other/Confirm';
import Colors from '../themes/Colors';

const compareFunc = (sortBy, order) => {
    return (a, b) => {
        let valueA =
            sortBy !== 'name'
                ? a[sortBy]
                : (a.firstname + a.lastname).toLowerCase();
        let valueB =
            sortBy !== 'name'
                ? b[sortBy]
                : (b.firstname + b.lastname).toLowerCase();

        if (typeof valueA === 'undefined') valueA = '';
        if (typeof valueB === 'undefined') valueB = '';

        if (order == 'asc')
            if (valueA < valueB) return -1;
            else if (valueA > valueB) return 1;
            else return 0;
        else if (valueA < valueB) return 1;
        else if (valueA > valueB) return -1;
        else return 0;
    };
};

const VendorStaff = ({ navigation, route }) => {
    const { jwt } = useContext(AuthContext);
    const { storeProfile, vendorLogin, vendorLogout } = useContext(VendorContext);
    const [flag, toggleFlag] = useToggle(true);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);

    const [staffs, setStaffs] = useState([]);
    const [keyword, setKeyword] = useState('');
    const [pagination, setPagination] = useState({
        size: 0,
    });
    const [filter, setFilter] = useState({
        search: '',
        limit: 6,
        sortBy: 'name',
        order: 'asc',
        page: 1,
    });

    const getStaffs = () => {
        // setIsLoading(true);
        if (!storeProfile.staffIds || storeProfile.staffIds.length <= 0) {
            setStaffs([]);
            setPagination({
                ...pagination,
                size: 0,
            });
            return;
        }

        const search = filter.search.toLowerCase();
        const filterList = storeProfile.staffIds
            .filter(
                (staff) =>
                    staff.firstname.toLowerCase().includes(search) ||
                    staff.lastname.toLowerCase().includes(search),
            )
            .sort(compareFunc(filter.sortBy, filter.order));

        const limit = filter.limit;
        const size = filterList.length;
        const pageCurrent = filter.page;
        const pageCount = Math.ceil(size / limit);
        let skip = limit * (pageCurrent - 1);
        if (pageCurrent > pageCount) {
            skip = (pageCount - 1) * limit;
        }

        const newListStaffs = filterList.slice(skip, skip + limit);
        setStaffs(newListStaffs);
        setPagination({
            size,
            pageCurrent,
            pageCount,
        });
        // setIsLoading(false);
    }

    useEffect(() => {
        getStaffs();
    }, [filter, storeProfile.staffIds]);

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

    const handlecancelStaff = () => {
        setError('');
        setIsLoading(true);
        cancelStaff(jwt._id, jwt.accessToken, storeProfile._id)
            .then(() => {
                vendorLogout();
                navigation.navigate('HomeTabNav');
            })
            .catch(error => {
                setError('Server Error');
                setIsLoading(false);
                setTimeout(() => {
                    setError('');
                }, 3000);
            });
    }

    const handleDeleteStaff = (staff) => {
        setError('');
        setSuccess('');
        setIsLoading(true);
        deleteStaff(jwt._id, jwt.accessToken, staff, storeProfile._id)
            .then(data => {
                vendorLogin(jwt._id, jwt.accessToken, storeProfile._id);
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
    };

    return  (
        <>
            {storeProfile.ownerId && storeProfile.ownerId._id == jwt._id ? (
                <FloatBtn onPress={() => navigation.navigate('AddStaff')} />
            ) : (
                <FloatBtn 
                    type={'danger'} 
                    icon={'close'} 
                    onPress={() => createTwoButtonAlert(
                        'Leave Store',
                        handlecancelStaff,
                    )}
                />
            )}
            
            <ScrollView>
                <View style={[styles.rowContainer, styles.mt12]}>
                    <View style={[styles.optionBtn, styles.mr6]}>
                        <Button
                            type='primary'
                            title='Staff'
                            onPress={() => toggleFlag(true)}
                            outline={!flag}
                        />
                    </View>

                    <View style={styles.optionBtn}>
                        <Button
                            type='fun'
                            title='Owner'
                            onPress={() => toggleFlag(false)}
                            outline={flag}
                        />
                    </View>
                </View>

                <View style={styles.container}>
                    <Search
                        onChangeText={onChangeText}
                        value={keyword}
                    />
                </View>

                {isLoading && <Spinner />}
                {error ? <Alert type='error' /> : null}
                {success ? <Alert type='success' content={success} /> : null}

                <View style={styles.container}>
                    <ScrollView horizontal={true}>
                        <View style={styles.tableContainer}>
                            <Table borderStyle={styles.table}>
                                <Row 
                                    data={['#', 'Avatar', 'Name', 'ID', 'Email', 'Phone', '']}
                                    style={styles.head}
                                    widthArr={[24, 120, 120, 120, 120, 120, flag && storeProfile.ownerId && jwt._id == storeProfile.ownerId._id ? 120 : 0]}
                                    textStyle={[styles.m6, styles.tw]}
                                />
                            </Table>
                            <Table borderStyle={styles.table}>
                                {flag ?
                                    <Rows 
                                        data={staffs.map((staff, index) => [
                                            index,
                                            <View style={styles.rowContainer}>
                                                <Image image={staff.avatar} />
                                            </View>,
                                            staff.firstname + ' ' + staff.lastname,
                                            staff.id_card,
                                            staff.email,
                                            staff.phone,
                                            storeProfile.ownerId && jwt._id == storeProfile.ownerId._id ?
                                            <View style={styles.m6}>
                                                <Button
                                                    type='danger'
                                                    title='Del' 
                                                    onPress={() => createTwoButtonAlert(
                                                        'Delete Staff',
                                                        () => handleDeleteStaff(staff._id),
                                                        staff.firstname + ' ' + staff.lastname,
                                                    )} 
                                                />
                                            </View> :
                                            null,
                                        ])}
                                        widthArr={[24, 120, 120, 120, 120, 120, storeProfile.ownerId && jwt._id == storeProfile.ownerId._id ? 120 : 0]}
                                        textStyle={styles.m6}
                                    /> :
                                    <Row 
                                        data={[
                                            0,
                                            <View style={styles.rowContainer}>
                                                <Image image={storeProfile.ownerId && storeProfile.ownerId.avatar} />
                                            </View>,
                                            storeProfile.ownerId && storeProfile.ownerId.firstname + ' ' + storeProfile.ownerId.lastname,
                                            storeProfile.ownerId && storeProfile.ownerId.id_card,
                                            storeProfile.ownerId && storeProfile.ownerId.email,
                                            storeProfile.ownerId && storeProfile.ownerId.phone,
                                        ]}
                                        widthArr={[24, 120, 120, 120, 120, 120]}
                                        textStyle={styles.m6}
                                    />
                                }
                            </Table>
                        </View>
                    </ScrollView>
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
    optionBtn: {
        flex: 1,
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

export default VendorStaff;