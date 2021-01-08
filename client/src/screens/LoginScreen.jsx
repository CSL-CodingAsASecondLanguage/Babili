/* eslint-disable import/no-unresolved */
/* eslint-disable no-alert */
/* eslint-disable react/prop-types */
import 'react-native-gesture-handler';
import React from 'react';
import {
  View, StyleSheet, Text, StatusBar, Image,
} from 'react-native';
import * as Google from 'expo-google-app-auth';
import axios from 'axios';
import firebase from 'firebase';
import * as Facebook from 'expo-facebook';
import { FontAwesome } from '@expo/vector-icons';
import config from '../../../config';

Facebook.initializeAsync({ appId: config.FB_ID, appName: 'Babili' });

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fec857',
  },
  logo: {
    width: 200,
    height: 200,
  },
  logoContainer: {
    alignItems: 'center',
    flexGrow: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 50,
  },
});
export default function LoginScreen({ navigation: { navigate } }) {
  const onSignIn = async (user, type) => {
    if (type === 'google') {
      if (user.additionalUserInfo.isNewUser === true) { // user is new
        await firebase.database().ref(`/users/${user.user.uid}`)
          .set({
            gmail: user.user.email,
            profile_picture: user.additionalUserInfo.profile.picture,
            first_name: user.additionalUserInfo.profile.given_name,
            last_name: user.additionalUserInfo.profile.family_name,
            created_at: Date.now(),
          });
        await axios.post(`${config.BASE_URL}/login`, {
          email: user.user.email,
          name: `${user.additionalUserInfo.profile.given_name} ${user.additionalUserInfo.profile.family_name}`,
          photoUrl: user.additionalUserInfo.profile.picture,
          loginType: type,
        });
        navigate('Home', { email: user.user.email });
      } else { // user is not new
        firebase.database().ref(`/users/${user.user.uid}`).update({
          last_logged_in: Date.now(),
        });
        navigate('Home', { email: user.user.email });
      }
    } else if (type === 'facebook') {
      console.warn('USER', user);
      await axios.post('http://192.168.1.138:3000/login', {
        email: user.email || null,
        name: user.name || null,
        photoUrl: null,
        loginType: type,
      });
    }
  };

  const signInWithGoogleAsync = async () => {
    try {
      const result = await Google.logInAsync({
        androidClientId: config.GOOGLE_AND,
        iosClientId: config.GOOGLE_IOS,
        scopes: ['profile', 'email'],
        permissions: ['public_profile', 'email', 'gender', 'location'],
        androidStandaloneAppClientId: config.GOOGLE_AND,
      });
      if (result.type === 'success') {
        const credential = firebase.auth.GoogleAuthProvider.credential(
          result.idToken,
          result.accessToken,
        );
        const user = await firebase.auth().signInWithCredential(credential);
        await onSignIn(user, 'google');
      }
    } catch (err) {
      console.warn('err in signInWithGoogleAsync', err);
    }
  };

  const signInWithFaceBookAsync = async () => {
    try {
      const { token, type, userId } = await Facebook.logInWithReadPermissionsAsync({ permissions: ['public_profile'] });
      if (type === 'success') {
        const user = await fetch(`https://graph.facebook.com/${userId}?access_token=${token}`);
        await onSignIn(await user.json(), 'facebook');
      }
    } catch (err) {
      console.warn('err in fb login', err);
    }
  };

  const signInWithFaceBook = () => signInWithFaceBookAsync();

  const signInWithGoogle = () => signInWithGoogleAsync();

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
      />
      <View style={styles.logoContainer}>
        <Text style={styles.title}>babili</Text>
        <Image
          style={styles.logo}
        // eslint-disable-next-line global-require
          source={require('../../assets/logo.png')}
        />

        <FontAwesome.Button
          name="google"
          backgroundColor="#f42B03"
          style={{
            marginLeft: 7, marginRight: 7, marginTop: 2, marginBottom: 2,
          }}
          onPress={signInWithGoogle}
        >
          Login with Google
        </FontAwesome.Button>
        <Text />
        <FontAwesome.Button name="facebook" style={{ margin: 2 }} backgroundColor="#2E86AB" onPress={signInWithFaceBook}>
          Login with Facebook
        </FontAwesome.Button>
      </View>
    </View>
  );
}
