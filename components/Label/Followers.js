import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getNumberOfFollowersForProduct, getNumberOfFollowersForStore } from '../../services/follow';
import Colors from '../../themes/Colors';
import Icon from 'react-native-vector-icons/Ionicons';

const Followers = ({ type = 'product', id }) => {
    const [followers, setFollowers] = useState(0);

    const getFollowers = async () => {
        try {
            let data;
            if (type === 'product') data = await getNumberOfFollowersForProduct(id);
            else if (type === 'store') data =await getNumberOfFollowersForStore(id);
            setFollowers(data.count);
        } catch (e) {
            setFollowers(0);
        }
    }

    useEffect(() => {
        getFollowers();
    }, [id]);

    return (
        <View style={styles.container}>
            <Icon name='heart' style={styles.icon} />
            <Text style={styles.text}>{' '}{followers}</Text>
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
        backgroundColor: Colors.pink,
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

export default Followers;