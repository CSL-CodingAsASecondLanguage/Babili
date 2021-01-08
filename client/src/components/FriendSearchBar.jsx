/* eslint-disable react/prop-types */
import React from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
} from 'react-native';

const styles = StyleSheet.create({
  searchBar: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    width: 240,
    borderColor: '#147EFB',
    borderWidth: 1,
    borderRadius: 25,
    color: '#147EFB',
    margin: 5,
    paddingHorizontal: 10,
  },
  searchList: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomColor: '#fff',
    borderBottomWidth: 1,
    paddingVertical: 5,
  },
  searchText: {
    color: '#147EFB',
    fontSize: 14,
    paddingHorizontal: 10,
  },
  addButton: {
    elevation: 3,
  },
});

function FriendSearchBar({ searchFriend, searchResults, sendFriendRequest }) {
  return (
    <View>
      <TextInput
        style={styles.searchBar}
        placeholder=" search for people"
        onChangeText={(text) => searchFriend(text)}
      />

      {
        searchResults
      && (
      <View>
        {searchResults.map(({ username, email, image }) => (
          <View style={styles.searchList} key={email}>
            <Text style={styles.searchText}>{username}</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => { sendFriendRequest({ username, email, image }); }}
            >
              <Text style={styles.searchText}> + add friend</Text>
            </TouchableOpacity>
          </View>
        ))}

        {!searchResults.length > 0 && (<Text style={[styles.searchText, { alignSelf: 'center', paddingVertical: 10 }]}>user not found</Text>)}

      </View>
      )
}
    </View>
  );
}

export default FriendSearchBar;
