import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Colors from '../themes/Colors';
import Icon from 'react-native-vector-icons/Ionicons';

const Filter = ({ type = 'product', filter = {}, setFilter = () => {} }) => {
    return (
        <TouchableOpacity
            style={styles.container}
            onPress={() => {
                console.log('---open filters---')
            }}
        >
            <Text style={styles.wrapper}>
                <Icon name='filter' style= {styles.icon} />
                {' '}All filters
            </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.primary,
        borderRadius: 6,
        paddingVertical: 6,
        paddingHorizontal: 12, 
    },
    wrapper: {
        fontSize: 20,
        color: Colors.white,
    },
    icon: {
        fontSize: 20,
        color: Colors.white
    },
});

export default Filter;