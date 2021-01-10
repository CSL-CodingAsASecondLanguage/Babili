/* eslint-disable global-require */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/no-array-index-key */
/* eslint-disable class-methods-use-this */
/* eslint-disable array-callback-return */
/* eslint-disable no-param-reassign */
import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

import MemoryGameScore from '../components/MemoryGameScore';
import MemoryGameCard from '../components/MemoryGameCard';

const cardData = [
  {
    src: require('../../assets/dog.jpg'),
    name: 'dog',
  },
  {
    src: require('../../assets/house.jpg'),
    name: 'house',
  },
  {
    src: require('../../assets/hat.jpg'),
    name: 'hat',
  },
  {
    src: require('../../assets/baby.jpg'),
    name: 'baby',
  },
  {
    src: require('../../assets/car.jpg'),
    name: 'car',
  },
  {
    src: require('../../assets/books.png'),
    name: 'books',
  },
  {
    src: require('../../assets/dogword.jpg'),
    name: 'dog',
  },
  {
    src: require('../../assets/wordhouse.png'),
    name: 'house',
  },
  {
    src: require('../../assets/wordhat.jpg'),
    name: 'hat',
  },
  {
    src: require('../../assets/wordbaby.jpg'),
    name: 'baby',
  },
  {
    src: require('../../assets/word-car-9.png'),
    name: 'car',
  },
  {
    src: require('../../assets/wordbook.jpg'),
    name: 'books',
  },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffc857',
    justifyContent: 'center',
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 40,
  },
  body: {
    flex: 1,
    padding: 5,
  },
  text: {
    textAlign: 'center',
    fontSize: 30,
    color: '#f42b03',
    marginTop: 10,
  },
});

class MemoryGameScreen extends React.Component {
  constructor(props) {
    super(props);
    this.cards = cardData;
    this.cards.map((obj) => {
      const id = Math.random()
        .toString(36)
        .substring(7);
      obj.id = id;
      obj.is_open = false;
    });

    this.cards = this.cards.sort(() => 0.5 - Math.random());
    this.state = {
      currentSelection: [],
      selectedPairs: [],
      score: 0,
      cards: this.cards,
    };
  }

  getRowContents(cards) {
    const contentsR = [];
    let contents = [];
    let count = 0;
    cards.forEach((item) => {
      count += 1;
      contents.push(item);
      if (count === 3) {
        contentsR.push(contents);
        count = 0;
        contents = [];
      }
    });

    return contentsR;
  }

  clickCard(id) {
    let { currentSelection, score } = this.state;

    const { selectedPairs, cards } = this.state;

    const index = cards.findIndex((card) => card.id === id);

    const localCards = cards;

    if (
      localCards[index].is_open === false
      && selectedPairs.indexOf(localCards[index].name) === -1
    ) {
      localCards[index].is_open = true;

      currentSelection.push({
        index,
        name: localCards[index].name,
      });

      if (currentSelection.length === 2) {
        if (currentSelection[0].name === currentSelection[1].name) {
          score += 1;
          selectedPairs.push(localCards[index].name);
        } else {
          localCards[currentSelection[0].index].is_open = false;

          setTimeout(() => {
            localCards[index].is_open = false;
            this.setState({
              cards: localCards,
            });
          }, 1000);
        }

        currentSelection = [];
      }

      this.setState({
        score,
        cards: localCards,
        currentSelection,
      });
    }
  }

  resetCards() {
    let cards = this.cards.map((obj) => {
      obj.is_open = false;
      return obj;
    });

    cards = cards.shuffle();

    this.setState({
      currentSelection: [],
      selectedPairs: [],
      cards,
      score: 0,
    });
  }

  renderCards(cards) {
    return cards.map((card, index) => (
      <MemoryGameCard
        key={index}
        src={card.src}
        name={card.name}
        is_open={card.is_open}
        clickCard={() => {
          this.clickCard(card.id);
        }}
      />
    ));
  }

  renderRows() {
    const { cards } = this.state;
    const contents = this.getRowContents(cards);
    return contents.map((itemCard, index) => (
      <View key={index} style={styles.row}>
        {this.renderCards(itemCard)}
      </View>
    ));
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Can you match them all?</Text>
        <View style={styles.body}>{this.renderRows.call(this)}</View>
        <MemoryGameScore score={this.state.score} />
      </View>
    );
  }
}

export default MemoryGameScreen;
