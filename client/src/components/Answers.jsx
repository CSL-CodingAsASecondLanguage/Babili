/* eslint-disable react/no-array-index-key */
/* eslint-disable react/prop-types */
import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 270,
  },
});

export default function Answers({ answers, answerSelected }) {
  return (
    <View style={{ ...styles.container }}>
      {answers.map((answer, i) => (
        <TouchableOpacity
          answer={answers[i]}
          style={{
            backgroundColor: '#2e86ab', margin: 10, textAlign: 'center', justifyContent: 'center', width: 300, height: 60, borderRadius: 10,
          }}
          onPress={() => { answerSelected(answers[i], i); }}
          key={i}
        >
          <Text style={{ color: 'white', fontSize: 24, textAlign: 'center' }}>{ answers[i] }</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
