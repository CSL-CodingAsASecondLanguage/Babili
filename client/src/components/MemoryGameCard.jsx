/* eslint-disable global-require */
/* eslint-disable semi */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
import React from 'react';
import {
  StyleSheet, View, TouchableHighlight, Image,
} from 'react-native';

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
  },
  card_text: {
    fontSize: 50,
    fontWeight: 'bold',
  },
});

const MemoryGameCard = (props) => {
  let source = require('../../assets/logo.png')

  if (props.is_open) {
    source = props.src;
  }

  return (
    <View style={styles.card}>
      <TouchableHighlight
        onPress={props.clickCard}
        activeOpacity={0.75}
        underlayColor="#f1f1f1"
      >
        <Image
          style={{
            width: 100, height: 125, justifyContent: 'center', resizeMode: 'contain',
          }}
          source={source}
        />
      </TouchableHighlight>
    </View>
  );
};

export default MemoryGameCard;
