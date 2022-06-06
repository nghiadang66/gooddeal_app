import React, { useContext } from 'react';
import {
  Image as ImageComp,
  StyleSheet,
} from 'react-native';
import { STATIC_URL } from '../../config';
import Colors from '../../themes/Colors';


const placeholderImage = require('../../assets/images/placeholder.png');

const Image = ({ image='', type='avatar' }) => (
    <ImageComp
        source={
            image  
            ? { uri: STATIC_URL + image }
            : placeholderImage
        }
        style={[styles.img, styles[type]]}
    />
);

const styles = StyleSheet.create({
    img :{
        width: 84,
        height: 84,
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
    }
});

export default Image;