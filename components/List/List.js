import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import ProductCard from '../Card/ProductCard';
import StoreCard from '../Card/StoreCard';
import UserCard from '../Card/UserCard';
import Spinner from '../Other/Spinner';
import Colors from '../../themes/Colors';
import Icon from 'react-native-vector-icons/Ionicons';

const List = ({
    navigation,
    type = 'product',
    title = '',
    items = [],
    loadMore = () => {},
    isRefreshing = false,
    horizontal = false,
    border = false,
    pagination = {},
    onEndLink,
}) => (
    <View style={styles.container}>
        {title ? <Text style={styles.title}>{title}</Text> : null}
        <FlatList
            horizontal={horizontal}
            numColumns={horizontal ? 1 : 2}
            data={items}
            renderItem={({ item }) => (
                <View style={[styles.card, !horizontal && { flex: 0.5 }]}>
                    {type === 'product' &&
                        <ProductCard
                            navigation={navigation}
                            item={item}
                            horizontalCard={horizontal}
                            borderCard={border}
                        />}

                    {(type === 'store' || type === 'vendor') &&
                        <StoreCard
                            navigation={navigation}
                            item={item}
                            type={type}
                            horizontalCard={horizontal}
                            borderCard={border}
                        />}

                    {type === 'user' &&
                        <UserCard
                            navigation={navigation}
                            item={item}
                            horizontalCard={horizontal}
                            borderCard={border}
                        />}

                </View>
            )}
            keyExtractor={item => item._id}
            onEndReached={loadMore}
            onEndReachedThreshold={0.2}
            refreshing={isRefreshing}
            ListFooterComponent={() => {
                if (onEndLink) 
                    return (
                        <View style={styles.iconContainer}>
                            <TouchableOpacity style={styles.iconBtn} onPress={onEndLink}>
                                <Icon name='arrow-forward' size={24} color={Colors.white} />
                            </TouchableOpacity>
                        </View>
                    );
                if (isRefreshing) return <Spinner />;
                if (pagination.pageCurrent < pagination.pageCount)
                    return (
                        <View style={styles.iconContainer}>
                            <Icon name='add-circle-outline' size={36} color={Colors.primary} />
                        </View>
                    );
                return null;
            }}
        />
    </View>
);

const styles = StyleSheet.create({
    container: {
        marginVertical: 12,
        marginHorizontal: 3,
    },
    iconContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 6,
        backgroundColor: Colors.primary,
    },
    title: {
        color: Colors.primary,
        fontSize: 20,
        fontWeight: 'bold',
        paddingHorizontal: 12,
        marginBottom: 6,
    },
    card: {
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default List;