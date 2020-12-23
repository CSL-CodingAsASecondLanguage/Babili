import React from 'react';
import {
  View, Image, StyleSheet,
} from 'react-native';

const styles = StyleSheet.create({
  container: {
    width: 400,
    height: 80,
    backgroundColor: '#fec857',
    flexDirection: 'row',

  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 400 / 2,
    margin: 5,
  },
});

const TopFriends = () => (
  <View style={styles.container}>
    <Image
      source={{
        uri: 'https://i.redd.it/v0caqchbtn741.jpg',
      }}
      style={styles.image}
    />
    <Image
      source={{
        uri: 'https://i.redd.it/v0caqchbtn741.jpg',
      }}
      style={styles.image}
    />
  </View>
);

export default TopFriends;
