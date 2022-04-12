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
import Link from '../components/Link';

const Home = ({ navigation }) => {
  const [categories, setCategories] = useState([]);
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [products, setProducts] = useState([]);
  const [stores, setStores] = useState([]);

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
  
  const init = () => {
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
  }

  useEffect(() => {
    init();
    return () => {
      setCategories([]);
      setProducts([]);
      setStores([]);
    };
  }, []);

  const handleSliderPress = (index) => navigation.navigate('Category', {
      category: categories[index],
  });

  return (
    <>
      {!isLoading && !error && (
        <ScrollView>
          {categories && categories.length > 0 && (
            <View style={styles.slider}>
              <Slider
                items={categories}
                currentIndex={currentCategoryIndex}
                handleSliderPress={handleSliderPress}
                setCurrentindex={setCurrentCategoryIndex}
              />
            </View>
          )}

          {products && products.length > 0 && (
              <View style={styles.carousel}>
                <List
                  navigation={navigation}
                  type = 'product'
                  title='Best Seller'
                  items={products}
                  horizontal={true}
                  border={true}
                />
              </View>
          )}

          {stores && stores.length > 0 && (
            <View style={styles.carousel}>
              <List
                navigation={navigation}
                type = 'store'
                title='Hot Stores'
                items={stores}
                horizontal={true}
                border={true}
              />
            </View>
          )}

            <View style={styles.discovery}>
              <Link
                title='discover...'
                fontSize={24}
                onPress={() => navigation.navigate('Search')}
              />
            </View>
        </ScrollView>
      )}

      {isLoading && <Spinner />}
      {error && <Alert type={'error'} />}
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
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: Colors.white,
    borderRadius: 3,
  },
  discovery: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  }
});

export default Home;