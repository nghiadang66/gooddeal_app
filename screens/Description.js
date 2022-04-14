import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '../themes/Colors';

const Description = ({ route }) => (
    <View style={styles.container}>
        <Text style={styles.name}>{route.params.name}</Text>
        <Text style={styles.description}>{route.params.description}</Text>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 12,
        backgroundColor: Colors.white,
    },
    name: {
        fontSize: 20,
        marginBottom: 12,
        color: Colors.black,
    },
    description: {
        fontSize: 16,
        textAlign: 'justify',
    },
});

export default Description;