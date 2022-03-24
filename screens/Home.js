import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { listActiveCategories } from '../services/category';
import { listActiveProducts } from '../services/product';
import { getlistStores } from '../services/store';
import { SliderBox } from "react-native-image-slider-box";
import Alert from '../components/Alert';
import Spinner from '../components/Spinner';
import { STATIC_URL } from '../config';
import Colors from '../themes/Colors';

const dimensions = Dimensions.get('screen');

const Home = ({ navigation }) => {
  const [categories, setCategories] = useState();
  const [categoryImages, setCategoryImages] = useState();
  const [products, setProducts] = useState();
  const [stores, setStores] = useState();

  const [error, setError] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const getData = () => Promise.all([
    listActiveCategories({
      search: '',
      categoryId: null,
      sortBy: 'name',
      order: 'asc',
      limit: 5,
      page: 1,
    }),
    listActiveProducts({
      search: '',
      rating: '',
      categoryId: '',
      minPrice: '',
      maxPrice: '',
      sortBy: 'sold',
      order: 'desc',
      limit: 6,
      page: 1,
    }),
    getlistStores({
      search: '',
      sortBy: 'rating',
      sortMoreBy: 'point',
      isActive: 'true',
      order: 'desc',
      limit: 6,
      page: 1,
    }),
  ]);

  useEffect(() => {
    setError(false);
    setLoading(true);
    getData()
      .then(([
        categoriesData,
        productsData,
        storesData,
      ]) => {
        setCategories(categoriesData.categories);
        const categoryImagesArray = [];
        categoriesData.categories.forEach(category => {
            categoryImagesArray.push(STATIC_URL + category.image);
        });
        setCategoryImages(categoryImagesArray);
        setProducts(productsData.products);
        setStores(storesData.stores);
      })
      .catch(err => {
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleSliderPress = (index) => navigation.navigator('Category', {
    categoryId: categories[index]._id,
  });

  return (
    <>
      {!isLoading && !error && (
        <ScrollView>
          {categoryImages && (
            <View style={styles.sliderContainer}>
              <SliderBox
                  images={categoryImages}
                  sliderBoxHeight={dimensions.height / 2.5}
                  dotColor={Colors.primary}
                  inactiveDotColor={Colors.white}
                  dotStyle={styles.sliderStyle}
                  autoplay={true}
                  circleLoop={true}
                  onCurrentImagePressed={(index) => handleSliderPress(index)}
              />
          </View>
          )}
        </ScrollView>
      )}
      {isLoading && <Spinner />}
      {error && <Alert type={'error'} content={error} />}
    </>
  );
}

const styles = StyleSheet.create({
  sliderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 64,
    paddingBottom: 20,
  },
  sliderStyle: {
    width: 30,
    height: 3,
    borderRadius: 0,
  },
});

export default Home;