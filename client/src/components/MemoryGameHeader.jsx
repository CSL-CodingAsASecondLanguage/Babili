import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const styles = StyleSheet.create({
  header: {
    flex: 1,
    flexDirection: 'column',
    alignSelf: 'stretch',
    paddingTop: 20,
    paddingBottom: 5,
    backgroundColor: '#f3f3f3',
  },
  header_text: {
    fontWeight: 'bold',
    fontSize: 17,
    textAlign: 'center',
  },
});
const Header = () => (
  <View style={styles.header}>
    <Text style={styles.header_text}>Memory Game</Text>
  </View>
);

export default Header;
