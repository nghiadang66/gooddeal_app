import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { SliderBox } from 'react-native-image-slider-box';
import { STATIC_URL } from '../../config';
import Colors from '../../themes/Colors';

const dimensions = Dimensions.get('screen');

const CategorySlider = ({
  items = [],
  currentIndex = 0,
  handleSliderPress = () => {},
  setCurrentindex = () => {}
}) => (
  <View style={styles.container}>
    <SliderBox
        images={items.map(item => STATIC_URL + item.image)}
        sliderBoxHeight={dimensions.height / 2.5}
        dotColor={Colors.primary}
        inactiveDotColor={Colors.white}
        dotStyle={styles.sliderStyle}
        autoplay={true}
        circleLoop={true}
        autoplayInterval={3000}
        onCurrentImagePressed={(index) => handleSliderPress(index)}
        currentImageEmitter={(index) => setCurrentindex(index)}
    />

    <View style={styles.detail} pointerEvents="none">
      <Text style={styles.name}>{items[currentIndex].name}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
      sliderStyle: {
        width: 30,
        height: 3,
        borderRadius: 0,
      },
      detail: {
        position: 'absolute',
        left: 0,
        right : 0,
        bottom: 24,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 3,
        backgroundColor: Colors.shadow,
      },
      name: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.white,
      },
});

export default CategorySlider;
