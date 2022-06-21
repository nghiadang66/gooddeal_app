import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Colors from '../../themes/Colors';

const OrderStatusSelect = ({ selectedValue, onChange }) => {
    return (
        <View style={styles.pickerContainer}>
            <Picker
                selectedValue={selectedValue}
                value={selectedValue}
                style={styles.picker}
                itemStyle={styles.itemPicker}
                dropdownIconColor={Colors.primary}
                dropdownIconRippleColor={Colors.shadow}
                mode={'dialog'}
                prompt={'Update order status'}
                onValueChange={(itemValue, itemIndex) => onChange(itemValue)}
            >
                <Picker.Item label={'Not processed'} value={'Not processed'} />
                <Picker.Item label={'Processing'} value={'Processing'} />
                <Picker.Item label={'Shipped'} value={'Shipped'} />
                <Picker.Item label={'Cancelled'} value={'Cancelled'} />
            </Picker>
        </View>
    );
}

const styles = StyleSheet.create({
    pickerContainer: {
        borderRadius: 6,
        borderWidth: 1,
        borderColor: Colors.primary,
        overflow: 'hidden',
    },
    picker: {
        width: '100%',
        color: Colors.primary,
        backgroundColor: Colors.white,
    },
});

export default OrderStatusSelect;