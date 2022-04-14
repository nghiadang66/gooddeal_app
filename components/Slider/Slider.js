import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { SliderBox } from 'react-native-image-slider-box';
import { STATIC_URL } from '../../config';
import Colors from '../../themes/Colors';

const dimensions = Dimensions.get('screen');

const Slider = ({
  images = [],
}) => (
  <View style={styles.container}>
    <SliderBox
        images={images.map(image => STATIC_URL + image)}
        sliderBoxHeight={dimensions.height / 2.5}
        dotColor={Colors.primary}
        inactiveDotColor={Colors.white}
        dotStyle={styles.sliderStyle}
        autoplay={true}
        circleLoop={true}
        autoplayInterval={3000}
        initialNumToRender={6}
    />
  </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
      sliderStyle: {
        width: 30,
        height: 3,
        borderRadius: 0,
      },
});

export default Slider;