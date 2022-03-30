import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { listActiveCategories } from '../services/category';
import { listActiveProducts } from '../services/product';
import { getlistStores } from '../services/store';
import List from '../components/List';
import Slider from '../components/Slider';
import Alert from '../components/Alert';
import Spinner from '../components/Spinner';
import Colors from '../themes/Colors';

const Home = ({ navigation }) => {
  const [categories, setCategories] = useState();
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [products, setProducts] = useState();
  const [stores, setStores] = useState();

  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
    setIsLoading(true);
    getData()
      .then(([
        categoriesData,
        productsData,
        storesData,
      ]) => {
        setCategories(categoriesData.categories);
        setProducts(productsData.products);
        setStores(storesData.stores);
      })
      .catch(err => {
        setError(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const handleSliderPress = (index) => navigation.navigate('Category', {
    categoryId: categories[index]._id,
    categoryName: categories[index].name,
  });

  return (
    <>
      {!isLoading && !error && (
        <ScrollView>
          {categories && (
            <View style={styles.slider}>
              <Slider
                items={categories}
                currentIndex={currentCategoryIndex}
                handleSliderPress={handleSliderPress}
                setCurrentindex={setCurrentCategoryIndex}
              />
            </View>
          )}

          {products && (
              <View style={styles.carousel}>
                  <List navigation={navigation} title="Best Seller" content={products} />
              </View>
          )}

          {stores && (
              <View style={styles.carousel}>
                  <List navigation={navigation} title="Hot Stores" type="store" content={stores} />
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
  slider: {
    flex: 1,
    marginTop: 64,
    marginBottom: 16,
    backgroundColor: Colors.white,
  },
  carousel: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    backgroundColor: Colors.white,
  },
});

export default Home;