import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Colors from '../../themes/Colors';

const CommissionSelect = ({ values, selectedValue, onChange }) => {
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
                prompt={'Select commission'}
                onValueChange={(itemValue, itemIndex) => onChange(itemValue)}
            >
                {values.map(v => (
                    <Picker.Item 
                        key={v._id} 
                        label={
                            `${v.name && v.name.charAt(0).toUpperCase() + v.name.slice(1)} - ${v.cost && v.cost.$numberDecimal}%/order`
                        } 
                        value={v._id} />
                ))}
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
        marginBottom: 24,
    },
    picker: {
        width: '100%',
        color: Colors.primary,
        backgroundColor: Colors.white,
    },
});

export default CommissionSelect;