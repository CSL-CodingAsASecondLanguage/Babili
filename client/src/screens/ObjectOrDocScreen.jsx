import React from 'react';
import {
  StyleSheet, Text, View, TouchableOpacity, StatusBar,
} from 'react-native';

const styles = StyleSheet.create({
  topButton: {
    flex: 1,
    justifyContent: 'center',
  },
  bottomButton: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ffc857',
  },
  text: {
    textAlign: 'center',
    fontSize: 30,
    color: '#F42B03',
  },
});

// eslint-disable-next-line react/prop-types
const ObjectOrDocScreen = ({ navigation: { navigate } }) => (
  <View style={{ flex: 1 }}>
    <StatusBar barStyle="dark-content" />
    <TouchableOpacity style={styles.bottomButton} onPress={() => navigate('Document')}>
      <Text style={styles.text}>Document Detection</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.topButton} onPress={() => navigate('Object')}>
      <Text style={styles.text}>Object Detection</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.bottomButton} onPress={() => navigate('ASL')}>
      <Text style={styles.text}>ASL for ESL</Text>
    </TouchableOpacity>

  </View>
);

export default ObjectOrDocScreen;
