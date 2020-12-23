/* eslint-disable react/prop-types */
import React from 'react';
import {
  View, Text, StyleSheet,
} from 'react-native';

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    justifyContent: 'center',
    backgroundColor: 'red',
  },
});

const FriendChat = ({ currentFriend }) => (
  <View style={styles.container}>
    <Text>Friend Chat</Text>
    {currentFriend && (<Text>{currentFriend.name}</Text>)}
  </View>
);

export default FriendChat;
