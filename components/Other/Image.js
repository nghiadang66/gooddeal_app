import React, { useContext } from 'react';
import {
  Image as ImageComp,
  Dimensions,
  StyleSheet,
} from 'react-native';
import { STATIC_URL } from '../../config';
import Colors from '../../themes/Colors';

const dimensions = Dimensions.get('screen');
const placeholderImage = require('../../assets/images/placeholder.png');

const Image = ({ image='', type='avatar', size='img' }) => (
    <ImageComp
        source={
            image  
            ? { uri: STATIC_URL + image }
            : placeholderImage
        }
        style={[styles[size], styles[type],]}
    />
);

const styles = StyleSheet.create({
    img: {
        width: 84,
        height: 84,
    },
    cover: {
        width: dimensions.width * 0.9,
        height: dimensions.width * 0.6,
    },
    avatar: {
        borderRadius: 42,
        borderColor: Colors.white,
        borderWidth: 3,
    },
    product: {
        borderRadius: 2,
        borderColor: Colors.white,
        borderWidth: 3,
    },
});

export default Image;