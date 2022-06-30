import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getUserLevel, getStoreLevel } from '../../services/level';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../../themes/Colors';

const UserLevelLabel = ({ level = {} }) => {
    

    return (
       
             <View style={[styles.container, { backgroundColor: level.color }]}>
            <Icon name='shield' style={styles.icon} />
         <Text style={styles.text}>{' '}{level.name}</Text>
       

        </View>
       
    );
}

const styles = StyleSheet.create({
    container : {
        flexDirection:'row',
        alignItems: 'center',
        paddingVertical: 3,
        paddingHorizontal: 6,
        borderRadius: 3,
        overflow: 'hidden',
    },
    icon: {
        fontSize: 14,
        color: Colors.white,
    },
    text: {
        fontSize: 12,
        color: Colors.white,
    },
});

export default UserLevelLabel;