import React from 'react';
import { View, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../../themes/Colors';

const StarRating = ({ stars = 3, noStar = false }) => {
    const render = () => {
        let content = [];
        for (let i = 1; i <= stars; i++) {
            content.push(
                <Icon name='star' key={i - 1} style={[styles.star, styles.goldStar]} />,
            );
        }
        if (!noStar)
            for (let i = stars + 1; i < 6; i++) {
                content.push(
                    <Icon name='star' key={i - 1} style={[styles.star, styles.mutedStar]} />,
                );
            }
        return content;
    };

    return (
        <View style={styles.container}>
            {render()}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    star: {
        fontSize: 14,
    },
    goldStar: {
        color: Colors.gold,
    },
    mutedStar: {
        color: Colors.muted,
    },
});

export default StarRating;