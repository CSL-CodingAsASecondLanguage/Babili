/* eslint-disable object-curly-newline */
/* eslint-disable no-alert */
/* eslint-disable react/prop-types */
import React from 'react';
import {
  View, TouchableOpacity, Image, StyleSheet, Text,
} from 'react-native';
import axios from 'axios';

import config from '../../../config';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchText: {
    color: 'white' },
  addButton: {
    backgroundColor: '#2E86AB',
    marginTop: '5%',
    marginBottom: '5%',
    marginRight: '5%',
    justifyContent: 'center',
    paddingHorizontal: '5%',
    borderRadius: 25,
  },
  friendReqContainer: {
    marginLeft: '5%',
  },
  image: {
    width: '60%',
    height: '60%',
    borderRadius: 30,
    marginLeft: '10%',
  },
  notifText: {
    marginTop: '2%',
    marginBottom: '5%',
    justifyContent: 'center',
    marginLeft: '5%',
  },
  text: {
    justifyContent: 'center',
    marginLeft: '20%',
    marginTop: '2%',
  },
});

const FriendRequests = ({ userInfo }) => {
  const updateFriend = (email, data) => {
    axios.patch(
      `${config.BASE_URL}/user/${email}`, data,
      // (res) => console.warn(res)
    ).then()
      .catch((e) => alert(e.message));
  };
  const acceptFriendRequest = (data) => {
    // remove friend request from sender's friend req array
    const removeFromFriendRequest = userInfo.friendrequests.filter(({
      email }) => email === data.email);
    // find friend req of specific friend to remove
    const removedFriendIndex = userInfo.friendrequests.findIndex(({
      email }) => email === data.email);
    // remove that friend from sender's friend request array
    userInfo.friendrequests.splice(removedFriendIndex, 1);
    // update sender's friends array
    const newFriendsArr = [...removeFromFriendRequest, ...userInfo.friends || []];
    console.warn('newFriendsArr:', newFriendsArr);
    // send friend request to the server to handle
    updateFriend(userInfo.email, {
      friendrequests: [...userInfo.friendrequests],
      friends: newFriendsArr,
    });
    console.warn(removeFromFriendRequest[0], 'REMOVEFROMFRIENDREQ');
    // update the friend that sends request
    axios.get(
      `${config.BASE_URL}/user/${removeFromFriendRequest[0].email}`,
    ).then((res) => {
      const userSendingRequest = res.data;
      let updateFriendList;
      console.warn('userSendingRequest', userSendingRequest);
      const currentUserInfo = { name: userInfo.name, email: userInfo.email, image: userInfo.image };
      console.warn('CURRENTUSERINFO:', currentUserInfo);
      // update the friend lists of the user that sent request
      if (!userSendingRequest.friends) {
        updateFriendList = [currentUserInfo];
      } else {
        updateFriendList = [currentUserInfo, ...userSendingRequest.friends];
      }
      console.warn('updateFriendList:', updateFriendList);
      axios.patch(
        `${config.BASE_URL}/user/${removeFromFriendRequest[0].email}`, { friends: updateFriendList },
      ).then(() => alert('friend req accepted'));
    });
  };

  return (
    <View>
      {
        (userInfo && userInfo.friendrequests && userInfo.friendrequests.length > 0)
          ? userInfo.friendrequests.map(({ image, username, email }) => (
            <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
              <View style={styles.friendReqContainer}>
                <Image style={styles.image} source={{ uri: image }} />
                <Text style={styles.notifText}>{username}</Text>
              </View>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => acceptFriendRequest({ username, email, image })}
              >
                <Text style={styles.searchText}>accept</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.addButton}
              >
                <Text style={styles.searchText}>decline</Text>
              </TouchableOpacity>
            </View>
          ))
          : (<Text style={styles.text}>No friend requests at the moment.</Text>)
    }
    </View>
  );
};

export default FriendRequests;
