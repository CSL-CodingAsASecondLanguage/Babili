/* eslint-disable react/prop-types */
import React from 'react';
import {
  View, TouchableOpacity, Image, StyleSheet,
} from 'react-native';

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    width: 90,
    height: 800,
    backgroundColor: '#c4c4c4',

  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 400 / 2,
    margin: 10,
  },
});

const FriendSideBar = ({ friendLists, onFriendPress }) => (
  <View style={styles.container}>
    {(friendLists && friendLists.length > 0)
    && friendLists.map((friend) => (
      <TouchableOpacity onPress={() => onFriendPress(friend)}>

        <Image
          source={{
            uri: friend.img,
          }}
          style={styles.image}
        />
      </TouchableOpacity>

    ))}
  </View>
);

export default FriendSideBar;
