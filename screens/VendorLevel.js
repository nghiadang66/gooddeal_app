import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { VendorContext } from '../context/VendorContext';
import { BackBtn } from '../components/Button/HeaderBtn';
import Colors from '../themes/Colors';
import Level from '../components/Label/Level';
import StarRating from '../components/Other/StarRating';
import Followers from '../components/Label/Followers';

const VendorLevel = ({ navigation, route }) => {
    const { storeProfile: store } = useContext(VendorContext);

    return (
        <View style={styles.container}>
            <View style={styles.rowContainer}>
                <View style={styles.backBtn}>
                    <BackBtn navigation={navigation} color='primary' />
                </View>
                <View style={styles.container}>
                    <Text style={styles.heading}>Store Level</Text>
                </View>
            </View>

            <View style={styles.p6}>
                <View style={styles.wrapper}>
                    <Text style={styles.title}>Point</Text>
                    <View style={[styles.rowContainer, styles.mb12]}>
                        <Text style={[styles.content, { marginRight: 6 }]}>{store.point}</Text>
                        <Level type={'store'} id={store._id} />
                    </View>
                </View>

                <View style={styles.wrapper}>
                    <Text style={styles.title}>Rating</Text>
                    <View style={styles.content}>
                        <StarRating stars={store.rating} />
                    </View>
                </View>
                
                <View style={styles.wrapper}>
                    <Text style={styles.title}>Follwers</Text>
                    <View style={[styles.rowContainer, styles.content]}>
                        <Followers type={'store'} id={store._id} />
                        <View style={styles.container}></View>
                    </View>
                </View>

                <View style={styles.wrapper}>
                    <Text style={styles.title}>Status</Text>
                    <Text style={[styles.content, { color: store.isOpen ? Colors.fun : Colors.danger }]}>
                        {store.isOpen ? 'open' : 'closed'}
                    </Text>
                </View>
            </View>
        </View>
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
    backBtn: {
        margin: 6,
    },
    heading: {
        color: Colors.primary,
        fontSize: 20,
    },
    p6: {
        padding: 6,
    },
    wrapper: {
        backgroundColor: Colors.white,
        padding: 6,
        borderRadius: 3,
        marginBottom: 3,
    },
    title: {
        color: Colors.primary,
    },
    content: {
        fontSize: 16,
        paddingVertical: 6,
    },
});

export default VendorLevel;