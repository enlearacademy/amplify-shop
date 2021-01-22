import React, {useEffect, useState} from 'react';
import {API} from 'aws-amplify';
import {SafeAreaView, StatusBar, TouchableOpacity} from 'react-native';

import {listProducts} from '../../graphql/queries';
import ProductList from '../components/ProductList';
const HomeScreen = (props) => {
  const [productsList, setProducts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchProducts = async () => {
    try {
      const products = await API.graphql({query: listProducts});
      if (products.data.listProducts) {
        console.log('Products: \n');
        console.log(products);
        setProducts(products.data.listProducts.items);
      }
    } catch (e) {
      console.log(e.message);
    }
  };
  useEffect(() => {
    fetchProducts();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchProducts();
    setRefreshing(false);
  };
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        {productsList && (
          <ProductList
            productList={productsList}
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        )}
      </SafeAreaView>
    </>
  );
};

export default HomeScreen;
