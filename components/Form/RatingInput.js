import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../../themes/Colors';

const RatingInput = ({ value = 0, isValid = true, feedback = 'Please provide a valid value (1-5).', onChange = () => {} }) => {
    return (
        <View style={styles.container}>
             <View style={styles.rowContainer}>
                {[...Array(value)].map((x, i) => (
                    <Icon name='star' key={i} style={[styles.star, styles.goldStar]} onPress={() => onChange(i)} />
                ))}

                {[...Array(5-value)].map((x, i) => (
                    <Icon name='star' key={i+value} style={[styles.star, styles.mutedStar]} onPress={() => onChange(i+value+1)} />
                ))}
            </View>

            {!isValid && <Text style={styles.feedback} pointerEvents='none'>{feedback}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingBottom: 24,
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        margin: 6,
        paddingHorizontal: 6,
    },
    star: {
        fontSize: 20,
        padding: 6,
        margin: 6,
    },
    goldStar: {
        color: Colors.gold,
    },
    mutedStar: {
        color: Colors.muted,
    },
    feedback: {
        position: 'absolute',
        left: 6,
        top: 48,
        fontSize: 12,
        color: Colors.danger,
    },
});

export default RatingInput;