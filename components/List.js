import React from 'react';
import { Text, View, StyleSheet, FlatList } from 'react-native';
import Colors from '../themes/Colors';
import Card from './Card';

const List = ({ navigation, title='', type='product', content=[] }) => {
    return (
        <View style={styles.list}>
            <Text style={styles.text}>{title}</Text>
            <FlatList
                data={content}
                horizontal={true}
                renderItem={({ item }) => <Card navigation={navigation} item={item} type={type} />}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    list: {
        marginVertical: 12,
        marginHorizontal: 3,
    },
    text: {
        color: Colors.primary,
        fontSize: 20,
        fontWeight: 'bold',
        paddingHorizontal: 12,
        marginBottom: 6,
    },
});

export default List;