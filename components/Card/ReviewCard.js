import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import SmallCard from './SmallCard';
import StarRating from '../Other/StarRating';
import DialogBtn from '../Button/DialogBtn';
import Colors from '../../themes/Colors';

const ReviewCard = ({
    navigation,
    item = {},
}) => {
    const { jwt } = useContext(AuthContext);
    return (
        <View style={styles.container}>
            <View style={styles.rowContainer}>
                <View style={styles.author}>
                    <SmallCard navigation={navigation} type='user' item={item.userId} />
                </View>

                {jwt && item.userId && jwt._id === item.userId._id ? 
                    <DialogBtn items={[
                        {
                            title: 'Edit your review',
                            onPress: () => navigation.navigate('UserReviewEdit', {
                                review: item,
                            }),
                        }
                    ]} /> :
                    null
                }
            </View>
            <StarRating stars={item.rating} />
            <Text style={styles.content}>{item.content}</Text>
        </View>
    );
}

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
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 6,
    },
    author: {
        flex: 1,
    },
    content: {
        fontSize: 16,
    }
});

export default ReviewCard;