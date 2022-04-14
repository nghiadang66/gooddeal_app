import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getUserLevel, getStoreLevel } from '../../services/level';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../../themes/Colors';

const Level = ({ type = 'user', id }) => {
    const [level, setLevel] = useState({});

    const getLevel = async () => {
        try {
            let data;
            if (type === 'user') data = await getUserLevel(id);
            else if (type === 'store') data = await getStoreLevel(id);
            setLevel(data.level);
        } catch (error) { }
    }
    
    useEffect(() => {
        getLevel();  
    }, [id]);

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

export default Level;