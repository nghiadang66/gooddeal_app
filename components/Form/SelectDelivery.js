import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Colors from '../../themes/Colors';

const SelectDelivery = ({ values, selectedValue, onChange }) => {
    const [value, setValue] = useState({
        old: '',
        new: selectedValue,
    });

    const handleChange = (itemValue) => {
        const oldValue = value.new;
        const newValue = itemValue;
        onChange(oldValue, newValue);
        setValue({
            old: oldValue,
            new: newValue,
        });
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{values[0] && values[0].styleId && values[0].styleId.name}</Text>
            <View style={styles.pickerContainer}>
                <Picker
                    selectedValue={value.new}
                    style={styles.picker}
                    itemStyle={styles.itemPicker}
                    dropdownIconColor={Colors.primary}
                    dropdownIconRippleColor={Colors.shadow}
                    mode={'dialog'}
                    prompt={values[0] && values[0].styleId && values[0].styleId.name}
                    onValueChange={(itemValue, itemIndex) => handleChange(itemValue)}
                >
                    {values.map(v => (
                        <Picker.Item key={v._id} label={'    ' + v.name+ ' (' +
                        v.price.$numberDecimal +
                        ' VND)' } value={v._id} />
                    ))}
                </Picker>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    title: {
        fontSize: 18,
    },
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

export default SelectDelivery;