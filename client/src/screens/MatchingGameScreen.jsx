/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import {
  StyleSheet, View, Image, Text, TouchableOpacity, FlatList, Dimensions,
} from 'react-native';
import FlipCard from 'react-native-flip-card';
import { Col, Grid } from 'react-native-easy-grid';
import axios from 'axios';
import { shuffle } from 'lodash';
import Header from '../components/MemoryGameHeader';
import MemoryGameCard from '../components/MemoryGameCard';

const screenWidth = Dimensions.get('window').width;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  back: {
    backgroundColor: '#fec857',
    borderRadius: 3,
    fontSize: 50,
    height: 75,
    width: 75,
    justifyContent: 'center',
    textAlign: 'center',
  },
  image: {
    width: '130%',
    height: '100%',
  },
  bottomText: {
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 20,
    color: '#0f9535',
    fontWeight: 'bold',
    marginTop: 175,
    marginLeft: '5%',
    marginRight: '5%',
  },
  card: {
    height: '45%',
    width: '70%',
    marginVertical: 8,
  },
});
const MatchingGameScreen = () => {
  const [openedCard, setOpenedCard] = useState([]);
  const [matched, setMatched] = useState([]);
  const [cardImages, setCardImages] = useState([]);
  const [score, setScore] = useState(0);
  const [selectedCards, setSelectedCards] = useState([]);
  const [matchesCard, setMatchesCard] = useState([]);

  const wordData = [
    { id: 6, name: 'book_text', img: 'https://text2image.com/user_images/202101/text2image_M4296315_20210106_231645.png' },
    { id: 8, name: 'dog_text', img: 'https://text2image.com/user_images/202101/text2image_R5750502_20210106_231053.png' },
    { id: 5, name: 'book', img: 'data:image/jpeg;base64,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' },
    { id: 7, name: 'dog', img: 'https://thehappypuppysite.com/wp-content/uploads/2019/06/Mini-Shiba-Inu-HP-long.jpg' },
  ];
  const imageData = [
    { id: 6, name: 'book_text', img: 'https://text2image.com/user_images/202101/text2image_M4296315_20210106_231645.png' },
    { id: 8, name: 'dog_text', img: 'https://text2image.com/user_images/202101/text2image_R5750502_20210106_231053.png' },
    { id: 5, name: 'book', img: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBw8PDw8NDw8PDw0PDw0PDw0PDw8NDQ0NFREWFhURFRUYHSggGBolHRUVITEhJSkrLi4wFx8zODMsOCgtLisBCgoKDg0OFhAQGC0dHR8rKystKystKy0tKystNy0rKy0uLS0tLSstKysrLjctKystKy0tLS0tKystLS0tLS0tK//AABEIAKgBLAMBIgACEQEDEQH/xAAcAAACAgMBAQAAAAAAAAAAAAACAwABBQYHBAj/xABDEAACAQIBBwgHBgQFBQAAAAAAAQIDEQQFBhIhMUFREyJhcYGRkqEHQlJiscHRFDJjcuHwFjOC8RUXI0OyU1STosL/xAAYAQEBAQEBAAAAAAAAAAAAAAABAAIDBP/EACERAQEAAgMBAAIDAQAAAAAAAAABAhEDEiFRIjETQYEE/9oADAMBAAIRAxEAPwDniGICIaPNXtGg0Ag0BWg0Cg0BEg0CgkBGgkCg0RWgkikEgSIIotAV2IWQkhZEQkohZCSiiyEglMIoQFgsJgsgBgsNgsUXIXIa0LkhBTAkhrQuSEEyQuSHSQuSEUiSFyQ6SFyQsktA2GNA2EPdEYgIjEYrYkEgUGiIkEgUMQESDSAQaAiQaBQaBLRaIgkRQsiQVgKi7F2LJKsSwRViSiWLJYkEgVirEglNBEsSLKYbQLQgtgsYwWQKaAaGsBoQTJASQ2QDNAloXJDpIXJFARJC5IdJC5I0CWgWhkkC0IeuIxARGIxWhINAoKJESGRBQaArSGJAxGRArQSRSCQFdgkRIJICiQViF2JKsWXYskEuxdi7EQ2JYKxViAbEsFYliQLFNB2KaJAaBaDsU0QLaAaGNAtCimgWhjQLQgmSFtDmhckIKaFyQ5oXJCCJICSGyQuSFmlSQtjWgGhD1RDiAhkTLY0EgUGiQ0GkCg0DQojEDFBoEKKCSKSDQGLSCSIkEkBSxaRLBJEVWLsXYuxINg6dNyuoptpSk7boxV2+xJkSNrzCycqs8TOS5iouj21Nr7ovvGTd0zllqbalYlh1ai4SlCX3oSlF/mTswLA0CxVg7EsSLaKaPVisLKm4qW2UVK3C7at5HnaIF2KaGNAtEimgWhrQDQgpoBoa0A0QKaFyQ5oW0aBLAkhrQEhBMkKkh8kLkhgJkhbQ1gMQfFDIgRGIy0JBxQKGRAiQaQKGRQEUUMiBEZFARJBpFRQaQFEg0ikg0iKJBJFpGRWAiqFGo9N1cTX5GjTiovSjfR0mnb1tW3cQt0yuAzRqV8EsTTf+tKU3Gk7KM6S1Kz3Sun0PUa5UpOLcZJxlFtOLTTi+DR2vC4VUaMKUdlOEYLpsrXNfzpyJSxEHV1U68Vqqbpr2Z/XcdLh54448vvrmdjpWZGE5PAqdudWnOo+OjfRj5Rv2nO6tGUW4tWfemuKe9HV8kVIywuGcFaPI07LhZWa70HH+zzX8Y59nhhOTxcnuqxjUXW9UvNN9phGjec/sLenSrW1wm4P8slf4x8zSbGc5qt8d3jC2jJ5JwN/9WS1eouL9oXk3AutPR2RWuT6OHWzZ3QUY7LKySXC24sYM8teMJnHS5tKf5ovtSa+DMDY23KWGdSi4xi3K6cIpXbaexdlw8j5mylaeJloLbyUHz3+aWxdnkNltGOUmPrTmgGjbc98kU6DoTpQUKcoyg0vai7pvi2nt6DVpILNVvG7myWgGhzQDQEloBoc0A0IJaFyQ5oCSEESQtofJCpIQVJC5IbJASQgiSAY2SAaFk2IxARDQNCSGxFobECNBxQMQ4gRxQyKAiNigMFFBpFJBxQNLSCSIkHFEhQhdwjrcqlWlRhFK7lUqSsl1bX2G45Aw0cRlWMY68Nk2koxe51baKfW3pS/pNWwFRU6k8TL7uDouceDxddOMO6Cb/qR6cxs7Vgak41o6VDESUqlSKbqU5K/O96OvZt4cGzUs24523enX6sravM1/OzEaGHnx0X/Y2ClXhUhGpCUZ0ppSjOD0otcUzQ/SDjNFKlfVLfwR2zuo4YTdaFhcboPk6l3TbbT2ypNvauMeK+e3p2YuI0sNKk2nyU3otO6dOpzk1xV9I5dOF/qbT6NcbKnipYaT5lanPRT3VY85W7NL97fPx5fk9HJN41umc+H08JWW9Q011xel8jmijfVvezrOvYumpwkt0oyVuhqxzjN/BadXSa5tOz/q3fN9h05f3GeG+VmckYBU6aW965PjJ/ux7KlPjs1XPZGnqt/cXiIrYti4b5FJ4xbuvDhqEp1oKN42ak2vViv3Y2iKPHgMNycfflrk+HBdh6kunX3v9DcZtLxmApV1GFaCnGMlNRd7aVmt23a9RzfO7J6w+LqQjFRhJRqQS1JRltSXC6kdQbtrNV9I+CvToYlL7snTk/dktKPmn3hnPGuLLWWnPmgGhrQDRyeopoXJDpICSIEyQuSHSQuSEEyQuaHNC5IWSGgJIbJC2aBUkKaHyFNCBxGRAiMQESGxQuKGxAwcRkQIjYgRRQ2KAihsUDUWkMiiooZFAUih9ClpSUb2u9b4Le+xawIoVjcoU6FOpdrlZ03ClFqTi7tRndrYtByXaUFuovKzaoU6UdUq0pYqrHZJaduTg/y01BW6GYbR122PZZoutlSdWpKrJKTk7vk3e3QkOp4+jLVPmv3k4+ZnL2sY+Rl82M7MRk6VlerhZPn0W9S9+D9WXk9/FZXLGUKWPfK0pXW7c4v2Wt3UarVwkZK9OSt2Nd5j6dathqmnHU/WXqzXSvmG7rS6ze2cnDRbi12cOk9GTMT9nxFCutlKrCbfu35y7VfvCo14YunytPVUj9+G2SfB8fmeSS2rc/I5703PXcppdnyNVzfw6jScltnOcuy9l5JGWzfxnK4CjVveSoqMn79NOL/4ngzbg/stC+104t9quz15Xenmx8lj3uOp67dJWGoJvSf3Y7OmQyeuy2cD0xilq8ty+osrSutWpcSJW2alvZ5soZQpYeOlVkrv7sFrnJ8Ev2jXqeXKleso/wAunfVBbeht72Fzk8MwtbbCnezf3dXaOxmDp1abpVIRlTdua1datjAheS2XuepbFfadNObiOLoOnOdN7YTnB9cW0/gedo2XPfCcnjKjtzaqjVXC7Vpeafea7JHnvl090u5smSFyQ9oXJEiWhckOaFyQgiSFyQ6SFyQgiSFyHSQtoQTJANDZIW0Ibis38P7MvHIJZv4f2ZeORlUgkjenPdYtZAw/sy8bDWQMPwl42ZRRDUS1FusWshUOEvEwo5CocJeJmVUS1EtRdqxiyJQ4S8TDjkWjwl4mZNIJIOsXa/WNWRqPCXiZ58VRwdFXqSlFdbMxXdkc8zzx+2KY9Yu9+svVy5kmG2tN9EVOXyNRy5lqFas5UYPkIrRhyn3pa3eXRfga43d24syMeTta67yuMg72/wBi+2Qe2m10xlrHU8ox2acrezVhprvWsSuQ9rzLth/afn9DFxhmVe6jWpyfMloS40p/GLsz1/aaqVpxjXp77c2pH99RhHQw7/3LdY6jQkv5NdO2xaSfkzNwbmTLYLEaM1Ww02px+9Rlqk47016y6VsNhdWFaHLwVk9VSnvpz4GmVak9TrU2pJ6q1LVJPjbf3mUyVlFwkpNqalzZuOpVo8GvVqLb0/HjyYeeOmF9dVzFxLeBxdNv+VKcl0RnS+sG+0zmS6ehQpR2WhBdSSNQzPrqMMdTTvGphHVg1vUbr/7NvxUtGCjdJNc5vYqaXzHDP8ZfjGeH5WH0XpO+7j0GFyxnRGm3RwyVSotUqm2lDov6z8jAZwZzKSdKnLQoLVKV7Sq/SPxNRr5wQXNpp291fPYH8lvmJnFJ7k2SrVcm6lerpSbu23r6v7DMBlalTqRlGEp24RfxZpbynVk7qn2ybbG0MfXe9R6kjHXL9t7n6dU/i6vKyhShBcZOU38vgZrN7K0q94VbcqtatZKS6jkWHxdZ7akuyyM7kWq+Wo3qSvykNe/abnJnMvaxlx468b1nngIVaKnKN+SknqdmotpP99Brn8OUPf8AF+hveUKCqUZwfrQa8jW8C70432pWfWtT+B7bjLN6ebHOy62w7zbw/v8Aj/QB5tYf8Tx/obA4g6JnrG+1+tfebGH/ABPH+gDzXw/4njX0NicQXEusXe/WuPNXDfieNfQB5qYb8Xxr6GyuILiPWLtfrWnmlhvxfGvoA80cL+L4/wBDZnAFxLUHatZeaOF/E8f6AfwjheFXx/obO4g6I6i7VhEg0ikg0gK0g0ikg0iS0gkikEiQki7ERJOyJMflWtowb6DkWceLc6j6zoGd2P0INXOW4uppSb6TUZypVJXkeyNJHkotJX4jlWXHzCiHxw8d7Gxw9PpfaeT7THiu9BLGR9r/AJMzqnce+OGp+y/ML7FSe7zRj1jYcX2RX0GLKUV7b7kHXJrtiyVLDOP3Kko9G2PdsI8PNO+ir75U9V170Nj7LHgWV0vVl2yS+YX+O29WPbU+iDpl8PfH63vMTKqVWWHm7OpTrU434yje3a0u9mWz0zo0pyoUXzU9Gctzt6py3E5xVIuEqUVGcWpKp9635fqe2llujJKWvSavJJNuL33Zxv8Az3/HWc+P+vfVmpO8ryfU2ilVS2QfkjwzyxS9/wAEmKllajxf/jl9DpOO/GbyT6yf2y3qhRyjbcv/AGXyMM8pUX63epIp4+l7a8TQXjq/kjY6OVl0eIzmRcqpVac3a0ZRk1dXaRoCxVN+uvFEdTqw3TXejF4mpyR9HZJzip4mfJRhKMtByWk4tSttSseCjHRqVqfCekuqWs4lk7K1ahONWjXcZxd4u97HV83MvLHKFd6KquDp1oR2KrHXddDVn5bj0cVyssyefkxksuLOtAtDGC0KLaBaGtA2EFtFNDGirEirFOIyxTQopxB0RzQNiTXUhiAQaMtiQaBQSJCSDSBQSICQjEzsh6L0VwJOa51YbEVW9GEmjVHkHFP/AGZ9zO7KlH2UXyMeC7h2LHBHm3if+lMXPIlZbacjvssJF7UgP8MpPbFPsHsOscEjkeq9lOfmeqjmziZbKNTzO708BSWyEe49EKcVsS7i3V1jh9DMXGz2UWut2MjQ9GGLlt5OPW7nZEEmG6tRyzDeiab/AJmJhH8tNy+LMlR9E2FX8zEV59EVTgvgzoSZdy3VqOaYz0WUb2pVakI8JWqK/HceaXomnbm4iD64OJ1VBRZbq1HHavosxS2ShLqk0eb/AC1xl7NW6dK525SLTLdWo47Q9FFeW2vGPQ9Jjv8AKKt/3MO6R11Mly3VqOSU/RBU9bFRXVBv5mdwfoqwUYpVZ1py3uMoxXc4m/3JcdrUaZR9GeTY+rUl+Z0pfGBlsk5q4bCTjUocpBxu9GLhCnLU1zoxitLbvM4Qt0ai7lEKAoymWUKUU0WQgEphFEgtFBFWEtaQaIQw0JBohCQkEiEFDQSIQkJBohCQkWQhASCTIQksK5CEFlohCS0EiyCl3LTIQksu5CEl3JchCSEIQghCEJKKIQkhRCCkKIQiohCCn//Z' },
    { id: 7, name: 'dog', img: 'https://thehappypuppysite.com/wp-content/uploads/2019/06/Mini-Shiba-Inu-HP-long.jpg' },
  ];

  useEffect(() => {
    const cloneImages = imageData.map((el) => Object.assign(el, { isOpen: false }));
    setCardImages(cloneImages);
  }, []);

  const renderCards = (cards) => cards.map((card, i) => {
    let isFlipped = false;
    if (openedCard.includes(imageData[i].name)) {
      isFlipped = true;
    }
    if (matched.includes(card.name)) {
      isFlipped = true;
    }

    const twoOpenedCards = async () => {
      if (openedCard.length === 2) {
        const firstMatched = await openedCard[0];
        const secondMatched = await openedCard[1];
        console.log('first Match', firstMatched);
        console.log('secondMatch', secondMatched);
        if (`${firstMatched}_text` === secondMatched
    || `${secondMatched}_text` === firstMatched) {
          console.log('they match!');
          await setMatched([...matched, firstMatched, secondMatched]);
          await setScore(score + 1);
        } else {
          console.log('they dont match');
          setOpenedCard([]);
        }
      }
    };

    // useEffect(() => {
    //   twoOpenedCards();
    // }, [openedCard]);

    // const flipCard = async (index) => {
    // // index is equal to clicked cards index in imagedata || wordData array
    //   const clickedCardName = imageData[index].name;
    //   console.log('in flipcard', clickedCardName);
    //   await setOpenedCard([...openedCard, clickedCardName]);
    //   console.log('opened card', openedCard);
    // };

    const flipCard = (index) => {
      // console.log("FLIPPED CARD==>", cardImages[index]);
      const cardImagesClone = [...cardImages];
      let cardsSelected = [...selectedCards];
      const cardMatches = [...matchesCard];
      let scores = score;

      if (cardImagesClone[index].isOpen === false && cardMatches.indexOf(cardImagesClone[index].name) === -1) {
        cardImagesClone[index].isOpen = true;
        cardsSelected.push({ index, name: cardImagesClone[index].name });
        if (cardsSelected.length === 2) {
          if (cardsSelected[0].name.includes(cardsSelected[1].name)) {
            console.log(`match found! scores ${scores}`);
            scores += 1;
            cardMatches.push(cardImagesClone[index].name);
          } else {
            cardImagesClone[cardsSelected[0].index].isOpen = false;
            setTimeout(() => {
              cardImagesClone[index].isOpen = false;
              setCardImages(cardImagesClone);
            }, 150);
            cardsSelected = [];
          }
        }
        setCardImages(cardImagesClone);
        setSelectedCards(cardsSelected);
        setScore(scores);
      }
    };

    return (
      <View style={styles.card}>
        <FlipCard
          flipHorizontal={false}
          onFlipEnd={() => { flipCard(i); }}
          key={card.img}
          style={styles.card}
          clickable
          flip={card.isOpen}
        >
          <View>
            <Image
              style={styles.image}
              source={require('../../assets/MatchingCard.png')}
              // source={{ uri: 'https://scontent-dfw5-1.xx.fbcdn.net/v/t31.0-8/p960x960/30848584_493792521023939_8435646401627466011_o.png?_nc_cat=109&ccb=2&_nc_sid=85a577&_nc_ohc=xtJDLwjcB0cAX8mXhmS&_nc_oc=AQnt9csMPj2bfXFsIeP93AGAr5htp-FsZ3KuhIJ5p1o62411qGsClDioXN2Y_3qu5NuyuYv-MzLp9qxcbMzjiK4T&_nc_ht=scontent-dfw5-1.xx&_nc_tp=30&oh=31f26c47c253e1fa5237173182b55450&oe=60056885' }}
            />
          </View>
          <View style={styles.face}>
            <Image style={styles.image} source={{ uri: card.img }} />
          </View>
        </FlipCard>
      </View>
    );
  });
  return (
    <View style={styles.container}>
      <Grid style={{ marginLeft: '14%' }}>
        <Col>{renderCards(wordData)}</Col>
        <Col>{renderCards(cardImages)}</Col>
      </Grid>
      <View style={styles.bottomText}>
        <Text style={styles.bottomText}>
          {`Score: ${score} / 5`}
        </Text>
        <TouchableOpacity>
          <Text
            onPress={() => setScore(0)}
            style={styles.bottomText}
          >
            Play again!
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default MatchingGameScreen;
