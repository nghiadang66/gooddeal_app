import React, { useContext } from 'react';
import { View,ScrollView, Text, StyleSheet } from 'react-native';
import { VendorContext } from '../context/VendorContext';
import { BackBtn, HeaderBtn } from '../components/Button/HeaderBtn';
import Colors from '../themes/Colors';

const VendorChangeProfile = ({ navigation, route }) => {
    const { storeProfile: store } = useContext(VendorContext);

    return (
        <ScrollView style={styles.container}>
            <View style={styles.rowContainer}>
                <View style={styles.backBtn}>
                    <BackBtn navigation={navigation} color='primary' />
                </View>
                <View style={styles.container}>
                    <Text style={styles.heading}>Store Profile</Text>
                </View>
                <View style={styles.backBtn}>
                    <HeaderBtn color='primary' onPress={() => navigation.navigate('VendorEditProfile')} icon='pencil' />
                </View>
            </View>
       
            <View style={styles.p6}>
                <View style={styles.wrapper}>
                    <Text style={styles.title}>Name</Text>
                    <Text style={styles.content}>{store.name}</Text>
                </View>
                
                <View style={styles.wrapper}>
                    <Text style={styles.title}>Bio</Text>
                    <Text style={styles.content}>{store.bio}</Text>
                </View>
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
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    wrapper: {
        backgroundColor: Colors.white,
        padding: 6,
        borderRadius: 3,
        marginBottom: 3,
    },
    backBtn: {
        margin: 6,
    },
    heading: {
        color: Colors.primary,
        fontSize: 20,
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

export default VendorChangeProfile;