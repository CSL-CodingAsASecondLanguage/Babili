/* eslint-disable react/prop-types */
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const styles = StyleSheet.create({
  score_container: {
    alignItems: 'center',
    padding: 10,
  },
  score: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#f42b03',
  },
});

const MemoryGameScore = ({ score }) => (
  <View style={styles.score_container}>
    <Text style={styles.score}>{`Score: ${score}`}</Text>
  </View>
);

export default MemoryGameScore;
