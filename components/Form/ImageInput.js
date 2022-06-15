import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../../themes/Colors';
import { Dimensions } from 'react-native';
import { STATIC_URL } from '../../config';

const dimensions = Dimensions.get('screen');
const placeholderImage = require('../../assets/images/placeholder.png');

const ImageInput = ({
    onChange = () => {},
    feedback = 'File is required.',
    defaultSrc = '',
    isRequired = false,
    isValid= false,
    size='avatar',
    key,
}) => {
    const [src, setSrc] = useState('');

    useEffect(() => {
        if (defaultSrc) setSrc(STATIC_URL + defaultSrc)
        else setSrc('');
    }, [defaultSrc]);

    const chooseImage = () => {
        ImagePicker.openPicker({
            includeBase64: true,
        }).then(image => {
            if(!defaultSrc) setSrc(`data:${image.mime};base64,${image.data}`);
            onChange({type:'image/jpg',uri:image.path,name: '123.jpg'});
        });
    }

    const removeImage = () => {
        onChange('');
        if(!defaultSrc) setSrc('');
    }

    return (
        <View style={[styles.container, styles.size[size]]} key={key || 0}>
            <Image
                source={src ? {uri: src} : placeholderImage}
                style={styles.img}
            />
            <TouchableOpacity
                style={styles.btn}
                onPress={chooseImage}
            >
                <Icon style={styles.icon} name={'camera'} />
            </TouchableOpacity>

            {src && (!defaultSrc || !isRequired) ? (
                <TouchableOpacity
                    style={styles.btn_remove}
                    onPress={removeImage}
                >
                    <Icon style={styles.icon} name={'close-outline'} />
                </TouchableOpacity>
            ) : null}

            {isRequired && !isValid && (
                <Text style={styles.feedback} pointerEvents='none'>{feedback}</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 2,
        borderColor: Colors.white,
        borderWidth: 3,
        margin: 6,
        marginBottom: 24,
    },
    size: {
        avatar: {
            width: 90,
            height: 90,
        },
        cover: {
            width: dimensions.width * 0.9,
            height: dimensions.width * 0.6,
        }
    },
    img: {
        width: '100%',
        height: '100%',
    },
    btn: {
        position: 'absolute',
        bottom: 6,
        right: 4,
        borderRadius: 2,
        paddingHorizontal: 3,
        backgroundColor: Colors.muted,
    },
    btn_remove: {
        position: 'absolute',
        top: 6,
        right: 4,
        borderRadius: 2,
        paddingHorizontal: 3,
        backgroundColor: Colors.muted,
    },
    icon: {
        fontSize: 20,
        color: Colors.white,
    },
    feedback: {
        position: 'absolute',
        left: 0,
        bottom: -17,
        fontSize: 12,
        color: Colors.danger,
    },
});

export default ImageInput;