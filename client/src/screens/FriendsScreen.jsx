/* eslint-disable consistent-return */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import {
  View, StyleSheet, StatusBar, Alert,
} from 'react-native';
import axios from 'axios';
import { withNavigationFocus } from 'react-navigation';
import FriendSideBar from '../components/FriendSideBar';
import FriendChat from '../components/FriendChat';
// import TopFriends from '../components/TopFriends';
import FriendSearchBar from '../components/FriendSearchBar';
import config from '../../../config';

const styles = StyleSheet.create({
  chatWrapper: {
    flexDirection: 'column',
  },
  searchBar: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    width: 230,
    borderColor: '#147EFB',
    borderWidth: 1,
    borderRadius: 25,
    color: '#147EFB',
    margin: 20,
  },
});
const FriendsScreen = ({ navigation, isFocused }) => {
  // eslint-disable-next-line no-unused-vars
  const [searchResults, setSearchResults] = useState(null);
  const [currentFriend, setCurrentFriend] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  const onFriendPressHandler = (friend) => {
    setCurrentFriend(friend);
  };

  const searchFriend = (searchTerm) => {
    if (!searchTerm || searchTerm === '') return;
    axios.get(
      `${config.BASE_URL}/user/search?q=${searchTerm}`,
    ).then((res) => setSearchResults(res.data))
      .catch(() => setSearchResults([]));
  };

  const getCurrentUserInfo = () => {
    axios.get(
      `${config.BASE_URL}/user/${navigation.getParam('email')}`,
    ).then((res) => setUserInfo(res.data))
      .catch((e) => console.warn(e.message));
  };
  const updateFriend = (email, data) => {
    axios.patch(
      `${config.BASE_URL}/user/${email}`, data,
    ).then((res) => console.warn(res.data))
      .catch((e) => console.warn(e.message));
  };

  const checkFriend = (email, arr) => {
    if (!arr && !email) return;
    if (arr === null) return;
    return arr.find((friend) => friend.email === email);
  };

  const sendFriendRequest = (data) => {
    axios.get(
      `${config.BASE_URL}/user/${data.email}`,
    ).then((res) => {
      const userGettingRequest = res.data;

      const requestSent = checkFriend(userInfo.email, userGettingRequest.friendrequests);
      if (requestSent) {
        setSearchResults(null);
        return Alert.alert('Error!', 'friend request was already sent');
      }

      const alreadyFriend = checkFriend(userInfo.email, userGettingRequest.friends);
      if (alreadyFriend) {
        setSearchResults(null); return Alert.alert('Error!', 'user is already your friend');
      }

      const userSendingRequest = {
        username: userInfo.username,
        email: userInfo.email,
        image: userInfo.image,
      };
      const makeFriend = [userSendingRequest, ...userGettingRequest.friendrequests || []];

      updateFriend(userGettingRequest.email, { friendrequests: makeFriend });
      setSearchResults(null);
    }).catch((e) => console.warn(e.message));
  };

  useEffect(() => {
    getCurrentUserInfo();
  }, [isFocused]);

  return (
    <View style={{ flex: 1 }}>
      <StatusBar
        barStyle="dark-content"
      />
      <View>
        {/* <TopFriends /> */}
      </View>
      <View style={{ flexDirection: 'row', flex: 1 }}>
        <View style={styles.chatWrapper}>
          <FriendSideBar
            friendLists={userInfo && userInfo.friends}
            onFriendPress={onFriendPressHandler}
            sender={userInfo}
            currentFriend={currentFriend}
          />
        </View>
        <View style={{ flexDirection: 'column', flex: 1 }}>

          <FriendSearchBar
            searchFriend={searchFriend}
            searchResults={searchResults}
            sendFriendRequest={sendFriendRequest}
          />
          {
            currentFriend
          && (
          <FriendChat
            sender={userInfo}
            currentFriend={currentFriend}
            onFriendPress={onFriendPressHandler}
          />
          )
}
        </View>
      </View>
    </View>
  );
};

export default withNavigationFocus(FriendsScreen);
