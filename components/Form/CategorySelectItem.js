import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Colors from '../../themes/Colors';

const CategorySelectItem = ({ values, selectedValue, onChange }) => {
    const [value, setValue] = useState(selectedValue);

    const handleChange = (itemValue) => {
        onChange(itemValue);
        setValue(itemValue);
    }

    return (
        <View style={styles.pickerContainer}>
            <Picker
                selectedValue={value}
                value={value}
                style={styles.picker}
                itemStyle={styles.itemPicker}
                dropdownIconColor={Colors.primary}
                dropdownIconRippleColor={Colors.shadow}
                mode={'dialog'}
                prompt={'Select category'}
                onValueChange={(itemValue, itemIndex) => handleChange(itemValue)}
            >
                {values.map(v => (
                    <Picker.Item 
                        key={v._id} 
                        label={v.name} 
                        value={v._id} />
                ))}
            </Picker>
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

export default CategorySelectItem;