import React from 'react';
import {
  View, StyleSheet, StatusBar, TextInput,
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import FriendSideBar from '../components/FriendSideBar';
import FriendChat from '../components/FriendChat';
import TopFriends from '../components/TopFriends';

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
    marginLeft: 100,
    marginTop: 20,
  },
});
const FriendsScreen = () => {
  // eslint-disable-next-line no-unused-vars
  const [friendLists, setFriendLists] = React.useState([
    { id: 1, name: 'Friend1', img: 'https://i.redd.it/v0caqchbtn741.jpg' },
    { id: 2, name: 'Friend2', img: 'https://i.redd.it/v0caqchbtn741.jpg' },
    { id: 3, name: 'Friend3', img: 'https://i.redd.it/v0caqchbtn741.jpg' },
  ]);
  const [currentFriend, setCurrentFriend] = React.useState(null);

  const onFriendPressHandler = (friend) => {
    setCurrentFriend(friend);
  };
  return (
    <View>
      <StatusBar
        barStyle="dark-content"
      />
      <View>
        <TopFriends />
        <TextInput
          style={styles.searchBar}
          placeholder=" search for people"
        >
          <AntDesign name="search1" size={20} color="#147EFB" />
        </TextInput>
      </View>
      <View style={styles.chatWrapper}>
        <FriendSideBar friendLists={friendLists} onFriendPress={onFriendPressHandler} />
        <FriendChat currentFriend={currentFriend} />
      </View>
    </View>
  );
};

export default FriendsScreen;
