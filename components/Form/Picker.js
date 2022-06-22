import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Picker as PickerComp } from '@react-native-picker/picker';
import Colors from '../../themes/Colors';

const Picker = ({ prompt = 'Select options', mode = 'dialog', items = [], selectedValue = '', onChange = () => {} }) => {
    return (
        <View style={styles.pickerContainer}>
            <PickerComp
                selectedValue={selectedValue}
                value={selectedValue}
                style={styles.picker}
                itemStyle={styles.itemPicker}
                dropdownIconColor={Colors.primary}
                dropdownIconRippleColor={Colors.shadow}
                mode={mode}
                prompt={prompt}
                onValueChange={(itemValue, itemIndex) => onChange(itemValue)}
            >
                {items.map((item, index) => (
                    <PickerComp.Item key={index} label={item.label} value={item.value} />
                ))}
            </PickerComp>
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

export default Picker;