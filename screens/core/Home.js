import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { listActiveCategories } from '../../services/category';
import ListRecommend from '../../components/List/ListRecommend';
import Slider from '../../components/Slider/CategorySlider';
import Alert from '../../components/Other/Alert';
import Spinner from '../../components/Other/Spinner';
import Colors from '../../themes/Colors';
import Link from '../../components/Other/Link';

const Home = ({ navigation }) => {
  const [categories, setCategories] = useState([]);
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);

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
  ]);
  
  const init = () => {
    setError(false);
    setIsLoading(true);
    getData()
      .then(([
        categoriesData,
      ]) => {
        setCategories(categoriesData.categories);
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
          
          <View style={styles.carousel}>
            <ListRecommend
              type='product'
              title='Best Seller'
              sortBy='sold'
              navigation={navigation}
            />
          </View>

          <View style={styles.carousel}>
            <ListRecommend
              type='store'
              title='Hot Stores'
              sortBy='rating'
              navigation={navigation}
            />
          </View>

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