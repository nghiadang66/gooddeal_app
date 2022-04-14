import React from 'react';
import { TouchableHighlight, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../../themes/Colors';

const BackBtn = ({ navigation }) => (
    <TouchableHighlight
        underlayColor={Colors.light}
        style={styles.backBtn}
        onPress={() => navigation.goBack()}
    >
        <Icon name='arrow-back' style={styles.backIcon} />
    </TouchableHighlight>
);

const styles = StyleSheet.create({
    backBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    backIcon: {
        fontSize: 24,
        color: Colors.white,
    },
});

export default BackBtn;