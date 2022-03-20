import React, { useState, useEffect, useContext } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { listActiveCategories } from '../services/services';
import Button from '../components/Button';
import { AuthContext } from '../context/AuthContext';

const Home = (props) => {
  // const [categories, setCategories] = useState([]);

  const {jwt, userProfile, logout, isLoading} = useContext(AuthContext);

  // useEffect(() => {
  //   // setError(false);
  //   // setLoaded(false);
  //   listActiveCategories({
  //     search: '',
  //     categoryId: null,
  //     sortBy: 'name',
  //     order: 'asc',
  //     limit: 5,
  //     page: 1,
  //   })
  //     .then(data => {
  //         console.log(data);
  //         setCategories(data.categories);
  //         // setLoaded(true);
  //     })
  //     .catch(err => {
  //         // setError(true);
  //         console.log('---Sever error---');
  //     });
  // }, []);

  return (
    <View style={styles.container}>
      <Text>Welcome to GoodDeal, {userProfile.firstname + ' ' + userProfile.lastname}!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
});

export default Home;