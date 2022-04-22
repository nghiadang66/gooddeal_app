import React, { useState, useEffect } from 'react';
import { TouchableHighlight, StyleSheet } from 'react-native';
import { checkFollowingProduct, followProduct, unfollowProduct, checkFollowingStore, followStore, unfollowStore } from '../../services/follow';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../../themes/Colors';

const fetchFuncs = {
    'product': checkFollowingProduct,
    'store': checkFollowingStore,
}

const followFuncs = {
    'product': {
        'follow': followProduct,
        'unfollow': unfollowProduct,
    },
    'store': {
        'follow': followStore,
        'unfollow': unfollowStore,
    },
}

const FollowBtn = ({ type = 'product', userId, token, itemId }) => {
    const [isFollowing, setIsFollowing] = useState(false);
    
    const getIsFollowing = () => {
        fetchFuncs[type](userId, token, itemId)
            .then(data => {
                setIsFollowing(data.success ? true : false);
            })
            .catch(err => {
                setIsFollowing(false);
            })
    }

    useEffect(() => {
        getIsFollowing();
        return () => {
            setIsFollowing(false);
        }
    }, [type, userId, itemId]);

    const handleFollow = () => {
        followFuncs[type][isFollowing ? 'unfollow' : 'follow'](userId, token, itemId)
            .then(data => {
                setIsFollowing(!isFollowing);
            })
            .catch(err => { });
    }

    return (
        <TouchableHighlight
            underlayColor={Colors.light}
            style={[
                styles.container,
                { backgroundColor: isFollowing ? Colors.light: Colors.shadow },
            ]}
            onPress={handleFollow}
        >
            <Icon
                name={isFollowing ? 'heart' : 'heart-outline'}
                style={[
                    styles.icon,
                    { color: isFollowing ? Colors.pink : Colors.white },
                ]}
            />
        </TouchableHighlight>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: '3%',
        right: '5%',
        zIndex: 9999,
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: {
        fontSize: 24,
    },
});

export default FollowBtn;