import React, { useState, useEffect, useContext, useRef } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { getlistUsers } from '../../services/user';
import { addStaffs } from '../../services/store';
import { AuthContext } from '../../context/AuthContext';
import { VendorContext } from '../../context/VendorContext';
import Search from '../../components/Other/Search';
import Spinner from '../../components/Other/Spinner';
import Alert from '../../components/Other/Alert';
import { createTwoButtonAlert } from '../../components/Other/Confirm';
import { BackBtn } from '../../components/Button/HeaderBtn';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../../themes/Colors';
import { STATIC_URL } from '../../config';

const placeholderImage = require('../../assets/images/placeholder.png');

const VendorStaffAdd = ({ navigation, route }) => {
    const typingTimeoutRef = useRef(null);

    const { jwt } = useContext(AuthContext);
    const { storeProfile, setStoreProfile } = useContext(VendorContext);

    const [error, setError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [success1, setSuccess1] = useState(false);
    const [error1, setError1] = useState(false);
    const [isLoading1, setIsLoading1] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const [users, setUsers] = useState([]);
    const [listLeft, setListLeft] = useState([]);
    const [listRight, setListRight] = useState([]);
    const [keyword, setKeyword] = useState('');
    const [filter, setFilter] = useState({});
    const [pagination, setPagination] = useState({ size: 0 });

    const getFilter = () => {
        setFilter({
            search: keyword,
            sortBy: 'firstname',
            role: 'customer',
            order: 'asc',
            limit: 10,
            page: 1,
        });
    }

    const getUsers = () => {
        setError(false);
        if (filter.page === 1) setIsLoading(true);
        else setIsRefreshing(true);
        getlistUsers(filter)
            .then(data => {
                const newUsers = data.filter.pageCurrent === 1 ? 
                    data.users :
                    [...users, ...data.users];
                const listCurrentStaffs = storeProfile.staffIds.map((s) => s._id);
                const listCurrentRight = listRight.map((r) => r._id);
                const newListLeft = newUsers.filter((u) =>
                    u._id != storeProfile.ownerId._id &&
                    listCurrentStaffs.indexOf(u._id) == -1 &&
                    listCurrentRight.indexOf(u._id) == -1,
                );

                setUsers(newUsers);
                setListLeft(newListLeft);
                setPagination({
                    size: newListLeft.length,
                    pageCurrent: data.filter.pageCurrent,
                    pageCount: data.filter.pageCount,
                });
            })
            .catch(err => {
                setError(true);
            })
            .finally(() => {
                setIsLoading(false);
                setIsRefreshing(false);
            });
    }

    useEffect(() => {
        getFilter();
    }, [jwt, storeProfile._id, storeProfile.staffIds, storeProfile.ownerId])

    useEffect(() => {
        getUsers();
    }, [filter]);

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

    const loadMore = () => {
        if (isRefreshing) return;
        if (pagination.pageCurrent < pagination.pageCount) {
            setFilter({
                ...filter,
                page: filter.page + 1,
            }); 
        }
    }

    const handleAdd = (user) => {
        const newListRight = [...listRight, user];
        const staffs = newListRight.map((r) => r._id);
        setError1('');
        setSuccess1('');
        setIsLoading1(true);
        addStaffs(jwt._id, jwt.accessToken, { 'staffs' : staffs }, storeProfile._id)
            .then(data => {
                setStoreProfile(data.store);
                setListRight(newListRight);
                setListLeft(listLeft.filter((u) => u._id != user._id));
                setSuccess1(data.success);
                setTimeout(() => {
                    setSuccess1('');
                }, 3000);
            })
            .catch((error) => {
                setError1('Server Error');
                setTimeout(() => {
                    setError1('');
                }, 3000);
            })
            .finally(() => setIsLoading1(false));
    }

    return  (
        <View style={styles.container}>
            <View style={styles.rowConrainer}>
                <BackBtn navigation={navigation} color='primary' />
                <View style={styles.container}>
                    <Search
                        onChangeText={onChangeText}
                        value={keyword}
                    />
                </View>
            </View>

            {isLoading1 && <Spinner />}
            {error1 ? 
                <View style={{flex: 0.1}}>
                    <Alert type='error' />
                </View> :
                null
            }
            {success1 ? 
                <View style={{flex: 0.1}}>
                    <Alert type='success' content={success1} />
                </View> :
                null
            }
            
            <View style={styles.container}>
                {!isLoading && !error && (
                    <>
                        <Text style={styles.result}>{pagination.size} results</Text>

                        <View style={styles.list}>
                            <FlatList
                                data={listLeft}
                                renderItem={({ item }) => (
                                    <View
                                        style={styles.card}
                                    >
                                        <View style={styles.rowConrainer}>
                                            <View style={[styles.rowConrainer, {flex: 0.9}]}>
                                                <Image
                                                    resizeMode="cover"
                                                    style={styles.image}
                                                    source={item.avatar ?
                                                        { uri: STATIC_URL + item.avatar } :
                                                        placeholderImage
                                                    }
                                                />
                                                <View style={styles.detail}>
                                                    <Text style={styles.name} numberOfLines={1}>
                                                        {item.firstname + ' ' + item.lastname}
                                                    </Text>
                                                </View>
                                            </View>

                                            <TouchableOpacity
                                                style={styles.btn}
                                                onPress={() => createTwoButtonAlert(
                                                    'Add Staff',
                                                    () => handleAdd(item),
                                                    item.firstname + ' ' + item.lastname,
                                                )}
                                            >
                                                <Icon name={'add-circle'} style={[styles.icon, {fontSize: 24,}]} />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                )}
                                keyExtractor={item => item._id}
                                onEndReached={loadMore}
                                onEndReachedThreshold={0.2}
                                refreshing={isRefreshing}
                                ListFooterComponent={() => {
                                    if (isRefreshing) return <Spinner />;
                                    return null;
                                }}
                            />
                        </View>
                    </>
                )}
                {isLoading && <Spinner />}
                {error && <Alert type={'error'} />}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    rowConrainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    result: {
        fontSize: 16,
        marginTop: 6,
        marginLeft: 2,
    },
    list: {
        marginVertical: 12,
        marginHorizontal: 3,
    },
    card: {
        flexDirection: 'row',
        flexWrap:'wrap',
        margin: 3,
        alignItems: 'center',
        backgroundColor: Colors.white,
        padding: 6,
        borderRadius: 3
    },
    image: {
        backgroundColor: Colors.muted,
        width: 52,
        height: 52,
        borderRadius: 26,
        borderWidth: 2,
        borderColor: Colors.muted,
    },
    detail: {
        flex: 1,
        padding: 6,
    },
    btn: {
        flex: 0.1, 
        justifyContent: 'center',
        alignItems: 'center',
        padding: 6,
    },
    name: {
        color: Colors.black,
        fontSize: 20,
    },
    icon: {
        fontSize: 16,
        color: Colors.primary,
    },
    p12: { 
        padding: 12,
    },
});

export default VendorStaffAdd;