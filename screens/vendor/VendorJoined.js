import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { humanReadableDate } from '../../helper/humanReadable';
import { VendorContext } from '../../context/VendorContext';
import { BackBtn } from '../../components/Button/HeaderBtn';
import Colors from '../../themes/Colors';

const VendorJoined = ({ navigation, route }) => {
    const { storeProfile: store } = useContext(VendorContext);

    return (
        <View style={styles.container}>
            <View style={styles.rowContainer}>
                <BackBtn navigation={navigation} color='primary' />
                <View style={styles.container}>
                    <Text style={styles.heading}>Other Infomation</Text>
                </View>
            </View>
       
            <View style={styles.p6}>
                <View style={styles.wrapper}>
                    <Text style={styles.title}>Bussiness Type</Text>
                    <Text style={styles.content}>
                        {store.commissionId && store.commissionId.name && store.commissionId.name.charAt(0).toUpperCase() + store.commissionId.name.slice(1)}
                        {' ('}
                        {store.commissionId && store.commissionId.cost && store.commissionId.cost.$numberDecimal}
                        {'%/order)'}
                    </Text>
                </View>

                <View style={styles.wrapper}>
                    <Text style={styles.title}>Joined At</Text>
                    <Text style={styles.content}>
                        {humanReadableDate(store.createdAt)}
                    </Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
        padding: 6,
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    wrapper: {
        padding: 6,
    },
    heading: {
        color: Colors.primary,
        fontSize: 20,
        margin: 6,
    },
    title: {
        color: Colors.primary,
    },
    content: {
        fontSize: 16,
        paddingVertical: 6,
    },
    p6: {
        padding: 6,
    },
});

export default VendorJoined;