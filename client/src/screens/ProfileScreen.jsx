import React, { useEffect } from 'react';
// eslint-disable-next-line import/no-unresolved
import { useForm, Controller } from 'react-hook-form';
import {
  View, Text, TextInput, StyleSheet, StatusBar, Button, Image,
} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: '#F5FCFF',
    padding: 20,
  },
  header: {
    fontSize: 25,
    textAlign: 'center',
    margin: 10,
    fontWeight: 'bold',
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 400 / 2,
    alignSelf: 'center',
  },
  textInput: {
    borderColor: '#CCCCCC',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    height: 25,
    fontSize: 14,
    paddingLeft: 20,
    paddingRight: 20,
  },
  inputContainer: {
    paddingTop: 15,
  },
});

const ProfileScreen = () => {
  // const [country, setCountry] = useState('');
  const {
    handleSubmit, control, setValue,
  } = useForm();
  const onSubmit = (data) => {
    // eslint-disable-next-line no-console
    console.log(data, 'data');
  };

  const fetchUser = async () => {
    try {
      const response = await fetch(
        'https://jsonplaceholder.typicode.com/users/1',
      );
      const { address } = await response.json();
      setValue('address.city', address.city);
    } catch (error) {
      console.warn(error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (

    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
      />
      <Text
        style={styles.header}
      >
        {' '}
        User Profile
      </Text>
      <Image
        source={{
          uri: 'https://i.redd.it/v0caqchbtn741.jpg',
        }}
        style={styles.image}
      />
      <Text>Skill Level:</Text>
      <View
        style={styles.inputContainer}
      >
        <Text>Country of origin:</Text>
        <Controller
          name="address.city"
          control={control}
          render={({ onChange, value }) => (
            <TextInput
              onChangeText={(text) => onChange(text)}
              value={value}
              placeholder="insert country here"
              defaultValue=""
              style={styles.textInput}
            />
          )}
        />
        <Button onPress={handleSubmit(onSubmit)} title="submit" />
        <Text>Native language(s):</Text>
        <Controller
          name="language"
          control={control}
          render={({ onChange, value }) => (
            <TextInput
              onChangeText={(text) => onChange(text)}
              value={value}
              placeholder="insert native language(s) here"
              defaultValue=""
              style={styles.textInput}
            />
          )}
        />
        <Button onPress={handleSubmit(onSubmit)} title="submit" />
        <Text>About me:</Text>
        <Controller
          name="description"
          control={control}
          render={({ onChange, value }) => (
            <TextInput
              onChangeText={(text) => onChange(text)}
              value={value}
              placeholder="insert description here"
              defaultValue=""
              style={styles.textInput}
            />
          )}
        />
        <Button onPress={handleSubmit(onSubmit)} title="submit" />
      </View>
    </View>
  );
};
// const styles = StyleSheet.create({});

export default ProfileScreen;
