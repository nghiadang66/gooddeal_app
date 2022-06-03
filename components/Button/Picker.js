import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Colors from '../../themes/Colors';

const CusPicker = ({ prompt='Select search option', mode='dialog', onValueChange=()=>{}, items=[], selectedValue }) => {
    return (
        <View style={styles.pickerContainer}>
            <Picker
                selectedValue={selectedValue ? selectedValue : items[0]}
                style={styles.picker}
                itemStyle={styles.itemPicker}
                dropdownIconColor={Colors.primary}
                dropdownIconRippleColor={Colors.primary}
                mode={mode}
                prompt={prompt}
                onValueChange={(itemValue, itemIndex) => onValueChange(itemValue)}
            >
                {items.map((item, index) => <Picker.Item key={index} label={item} value={item} />)}
            </Picker>
        </View>
    );
}

const styles = StyleSheet.create({
    pickerContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        borderRadius: 4,
        lineHeight: 3,
        borderWidth: 2,
        backgroundColor: Colors.white,
        borderColor: Colors.white,
    },
    picker: {
        width: '100%',
        height: 32,
        color: Colors.primary,
    },
    itemPicker: {
        backgroundColor: Colors.white,
    },
});

export default CusPicker;