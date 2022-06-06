import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Link from '../components/Other/Link';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../themes/Colors';

const VendorProductAdd = ({ navigation, route }) => {
    return  (
        <View style={styles.container}>
            <Text>Vendor ProductAdd</Text>
            <View styles={styles.back}>
                <Link
                    title={
                        <>
                            <Icon name={'arrow-back'} style={styles.icon} />
                            Back
                        </>
                    }
                    size={24}
                    onPress={() => navigation.goBack()}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    back: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
    },
    icon: {
        fontSize: 16,
        color: Colors.primary,
    }
});

export default VendorProductAdd;