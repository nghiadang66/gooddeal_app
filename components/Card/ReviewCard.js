import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import SmallCard from './SmallCard';
import StarRating from '../Other/StarRating';
import Colors from '../../themes/Colors';

const ReviewCard = ({
    navigation,
    item = {},
}) => (
    <View style={styles.container}>
        <View style={styles.author}>
            <SmallCard navigation={navigation} type='user' item={item.userId} />
        </View>
        <StarRating stars={item.rating} />
        <Text style={styles.content}>{item.content}</Text>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 3,
        padding: 12,
        backgroundColor: Colors.white,
        borderColor: Colors.primary,
        borderWidth: 1,
        borderRadius: 6,
    },
    author: {
        marginBottom: 6,
    },
    content: {
        fontSize: 16,
    }
});

export default ReviewCard;