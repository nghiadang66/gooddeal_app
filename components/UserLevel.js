import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '../themes/Colors';
import { getUserLevel } from '../services/level';

const UserLevel = ({ userId }) => {
    const [level, setLevel] = useState({});

    const getLevel = async () => {
        try {
            const data = await getUserLevel(userId);
            setLevel(data.level);
        } catch (error) { }
    }
    
    useEffect(() => {
        getLevel();  
    }, [userId]);

    return (
        <View style={[styles.container, { backgroundColor: level.color }]}>
            <Text style={styles.level}>{level.name}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        minWidth: 48,
        padding: 3,
        borderRadius: 6,
    },
    level: {
        fontSize: 12,
        fontWeight: 'bold',
        color: Colors.white,
    },
});

export default UserLevel;