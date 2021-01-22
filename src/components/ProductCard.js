import React, {useEffect, useState} from 'react';
import {Text, StyleSheet, View} from 'react-native';
import {Card, Icon, Image} from 'react-native-elements';
import {Storage} from 'aws-amplify';

const ProductCard = ({
  productName,
  productOwner,
  productPrice,
  productImage,
}) => {
  const [imageSource, setImageSource] = useState(null);
  const getImage = async () => {
    try {
      const imageURL = await Storage.get(productImage);
      setImageSource({
        uri: imageURL,
      });
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    getImage();
  }, []);
  return (
    <Card containerStyle={styles.cardContainer}>
      <Card.Title style={styles.cardTitle}>{productName}</Card.Title>
      <Card.Divider />
      {imageSource && (
        <Image source={imageSource} style={styles.productImage} />
      )}
      {!imageSource && (
        <View style={styles.altView}>
          <Text>Product Image</Text>
        </View>
      )}
      <Text style={styles.productPrice}>{productPrice}$</Text>
      <View style={styles.ownerTitle}>
        <Icon name="person-pin" />
        <Text style={styles.productOwner}>{productOwner}</Text>
      </View>
    </Card>
  );
};
const styles = StyleSheet.create({
  cardContainer: {
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  productImage: {
    width: 200,
    height: 200,
    alignSelf: 'center',
  },
  productPrice: {
    marginTop: 10,
    marginBottom: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  altView: {
    width: 200,
    height: 200,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 20,
  },
  productOwner: {
    fontSize: 16,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  ownerTitle: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});
export default ProductCard;
