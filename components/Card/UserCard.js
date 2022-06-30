import React from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';
import { STATIC_URL } from '../../config';
import Level from '../Label/Level';
import Colors from '../../themes/Colors';

const placeholderImage = require('../../assets/images/placeholder.png');
const dimensions = Dimensions.get('screen');

const UserCard = ({
    navigation,
    item = {},
    horizontalCard = false,
    borderCard = false,
}) => {
    const handlePress = () => navigation.navigate('User', {
        userId: item._id,
        itemId: item._id,
    });

    return (
        <TouchableOpacity
            style={[
                styles.container,
                {
                    borderColor: borderCard ? Colors.primary : Colors.white,
                    borderWidth: 1,
                },
            ]}
            onPress={handlePress}
        >
            <Image
                resizeMode="cover"
                style={[
                    styles.image,
                    { 
                        width: dimensions.width / (horizontalCard ? 2.3 : 2.1),
                        height: dimensions.width / (horizontalCard ? 2.3 : 2.1),
                    },
                ]}
                source={
                    item.avatar  
                    ? { uri: STATIC_URL + item.avatar }
                    : placeholderImage
                }
            />
            <View
                style={[
                    styles.detail,
                    { width: dimensions.width / (horizontalCard ? 2.3 : 2.1) },
                ]}
            >
                <View style={styles.labelContainer}>
                    <View style={styles.labelWrapper}>
                        <Level type='user' id={item._id} />
                    </View>
                </View> 

                <Text style={styles.name} numberOfLines={2}>{item.firstname + ' ' + item.lastname}</Text>
            </View>
            
            {!item.avatar 
                && <Text
                    style={[
                        styles.alt,
                        {
                            width: dimensions.width / (horizontalCard ? 2.3 : 2.1),
                        },
                    ]}>
                        {item.firstname + ' ' + item.lastname}
                    </Text>}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        margin: 3,
        borderRadius: 6,
        alignItems: 'center',
        backgroundColor: Colors.white,
        height: dimensions.width * 0.7,
    },
    image: {
        borderTopLeftRadius: 6,
        borderTopRightRadius: 6,
        backgroundColor: Colors.muted,
    },
    detail: {
        flex: 1,
        justifyContent: 'center',
        padding: 6,
        borderBottomLeftRadius: 6,
        borderBottomRightRadius: 6,
        borderTopColor: Colors.shadow,
        borderTopWidth: 1,
    },
    labelContainer: {
        flexDirection:'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    labelWrapper: {
        marginRight: 3,
    },
    name: {
        color: Colors.black,
        fontSize: 20,
    },
    alt: {
        position: 'absolute',
        top: 24,
        textAlign: 'center',
    },
});

export default UserCard;