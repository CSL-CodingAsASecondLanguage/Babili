/* eslint-disable import/no-named-as-default */
/* eslint-disable import/no-named-as-default-member */
/* eslint-disable react/prop-types */
import React from 'react';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import firebase from 'firebase';
import config from '../config';
import LoginScreen from './src/screens/LoginScreen';
import MatchingGameScreen from './src/screens/MatchingGameScreen';
import ObjectOrDocScreen from './src/screens/ObjectOrDocScreen';
import LoadingScreen from './src/screens/LoadingScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import FriendsScreen from './src/screens/FriendsScreen';
import MessagesScreen from './src/screens/MessagesScreen';
import FlashCardScreen from './src/screens/FlashCardScreen';
import FlashCardOrMatchingScreen from './src/screens/FlashCardOrMatchingScreen';
import ObjectDetectionScreen from './src/screens/ObjectDetectionScreen';
import DocumentScreen from './src/screens/DocumentScreen';
import QuizScreen from './src/screens/QuizScreen';
import ASLDetectionScreen from './src/screens/ASLDetectionScreen';

// if firebase app isn't initialized, initialize it
if (!firebase.apps.length) {
  firebase.initializeApp(config.firebaseConfig);
} else {
  firebase.app();
}

const AppStack = createBottomTabNavigator({
  Messages: MessagesScreen,
  Friends: FriendsScreen,
  Camera: ObjectOrDocScreen,
  Games: FlashCardOrMatchingScreen,
  Profile: ProfileScreen,
}, {
  defaultNavigationOptions: ({ navigation }) => ({
    tabBarIcon: ({ focused, tintColor }) => {
      const { routeName } = navigation.state;
      let iconName;
      if (routeName === 'Messages') {
        iconName = focused ? 'chat-outline' : 'chat-outline';
      } else if (routeName === 'Friends') {
        iconName = focused ? 'account-multiple' : 'account-multiple';
      } else if (routeName === 'Camera') {
        iconName = focused ? 'camera-plus-outline' : 'camera-plus-outline';
      } else if (routeName === 'Games') {
        iconName = focused ? 'cards-outline' : 'cards-outline';
      } else if (routeName === 'Profile') {
        iconName = focused ? 'account' : 'account';
      }

      return (<Icon name={iconName} size={25} color={tintColor} />);
    },
  }),
  tabBarOptions: {
    inactiveTintColor: '#bedfed',
    activeTintColor: '#fec857',
    style: {
      backgroundColor: '#2E86AB',
    },
  },
});

const navigator = createStackNavigator({
  Loading: LoadingScreen,
  Messages: MessagesScreen,
  Login: LoginScreen,
  FlashCard: FlashCardScreen,
  Matching: MatchingGameScreen,
  Document: DocumentScreen,
  Object: ObjectDetectionScreen,
  Quiz: QuizScreen,
  Profile: ProfileScreen,
  ASL: ASLDetectionScreen,
  Home: AppStack,
}, {
  initialRouteName: 'Loading',
  defaultNavigationOptions: {
    title: 'babili',
  },
});

export default createAppContainer(navigator);
