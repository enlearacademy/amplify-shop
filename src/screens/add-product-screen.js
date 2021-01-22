import React, {useState} from 'react';
import {StyleSheet, SafeAreaView, ScrollView} from 'react-native';
import {Button} from 'react-native-elements';
import t from 'tcomb-form-native';
import {Auth, API, graphqlOperation} from 'aws-amplify';
import {createProduct} from '../../graphql/mutations';
import ImageUploader from '../components/ImageUploader';
import {launchImageLibrary} from 'react-native-image-picker';
import {Storage} from 'aws-amplify';

const Form = t.form.Form;
const User = t.struct({
  name: t.String,
  price: t.Number,
  description: t.String,
});
const AddProductScreen = ({navigation}) => {
  const [form, setForm] = useState(null);
  const [initialValues, setInitialValues] = useState({});
  const [photo, setPhoto] = useState(null);

  const handleChoosePhoto = async () => {
    const product = await form.getValue();

    setInitialValues({
      name: product.name,
      price: product.price,
      description: product.description,
    });
    await launchImageLibrary({}, (response) => {
      // console.log(response.data);
      if (response.uri) {
        console.log('Photo Extension: \n');
        // console.log(response);
        setPhoto(response);
      }
    });
  };

  const options = {
    auto: 'placeholders',
    fields: {
      description: {
        multiLine: true,
        stylesheet: {
          ...Form.stylesheet,
          textbox: {
            ...Form.stylesheet.textbox,
            normal: {
              ...Form.stylesheet.textbox.normal,
              height: 100,
              textAlignVertical: 'top',
            },
          },
        },
      },
    },
  };
  const handleSubmit = async () => {
    try {
      const value = await form.getValue();
      const user = await Auth.currentAuthenticatedUser();

      if (photo) {
        const photoResponse = await fetch(photo.uri);

        const blob = await photoResponse.blob();

        await Storage.put(photo.fileName, blob, {
          contentType: 'image/jpeg',
        });
      }
      const response = await API.graphql(
        graphqlOperation(createProduct, {
          input: {
            name: value.name,
            price: value.price,
            description: value.description,
            userId: user.attributes.sub,
            userName: user.username,
            image: photo ? photo.fileName : '',
          },
        }),
      );

      // console.log('Response: \n');
      // console.log(response);
      navigation.navigate('Home');
    } catch (e) {
      console.log(e.message);
    }
  };
  return (
    <>
      <SafeAreaView style={styles.addProductView}>
        <ScrollView>
          <Form
            ref={(c) => setForm(c)}
            value={initialValues}
            type={User}
            options={options}
          />
          <ImageUploader photo={photo} handleChoosePhoto={handleChoosePhoto} />
          <Button title="Save" onPress={handleSubmit} />
        </ScrollView>
      </SafeAreaView>
    </>
  );
};
const styles = StyleSheet.create({
  addProductView: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    paddingTop: 15,
    height: 'auto',
  },
});
export default AddProductScreen;
