import React, { useContext } from 'react';
import { View, ScrollView, Text, StyleSheet } from 'react-native';
import { VendorContext } from '../../context/VendorContext';
import { BackBtn, HeaderBtn } from '../../components/Button/HeaderBtn';
import Colors from '../../themes/Colors';

const VendorChangeProfile = ({ navigation, route }) => {
    const { storeProfile: store } = useContext(VendorContext);

    return (
        <ScrollView style={styles.container}>
            <View style={styles.rowContainer}>
                <BackBtn navigation={navigation} color='primary' />
                
                <View style={styles.container}>
                    <Text style={styles.heading}>Store Profile</Text>
                </View>

                <HeaderBtn color='primary' onPress={() => navigation.navigate('VendorEditProfile')} icon='pencil' />
            </View>
       
            <View style={styles.wrapper}>
                <Text style={styles.title}>Name</Text>
                <Text style={styles.content}>{store.name}</Text>
            
                <Text style={styles.title}>Bio</Text>
                <Text style={styles.content}>{store.bio}</Text>
            </View>
        </ScrollView>
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
    heading: {
        color: Colors.primary,
        fontSize: 20,
        margin: 6,
    },
    wrapper: {
        padding: 6,
    },
    title: {
        color: Colors.primary,
    },
    content: {
        fontSize: 16,
        paddingVertical: 6,
    },
});

export default VendorChangeProfile;