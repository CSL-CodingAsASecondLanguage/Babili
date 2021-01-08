/* eslint-disable no-unused-expressions */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-unused-vars */
/* eslint-disable no-shadow */
/* eslint-disable no-underscore-dangle */
/* eslint-disable react/prop-types */
import React, { useEffect, useState, useCallback } from 'react';
import {
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  View,
  KeyboardAvoidingView,
  Image,
} from 'react-native';
import Pusher from 'pusher-js/react-native';
import { GiftedChat, Actions, Bubble } from 'react-native-gifted-chat';
import axios from 'axios';
import pusherConfig from '../../../pusher.json';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#f5f2D0',
  },
});
const FriendChat = ({ currentFriend, sender }) => {
  const [messages, setMessages] = useState([]);
  const [fonts, setFonts] = useState(15);

  useEffect(() => {
    const pusher = new Pusher(pusherConfig.key, pusherConfig);
    const chatChannel = pusher.subscribe('chat_channel');
    chatChannel.bind('pusher:subscription_succeeded', () => {
      // console.warn('subscription to channel ok!');
    });
    chatChannel.bind('pusher:subscription_error', () => {
      console.warn('subscription to channel error!');
    });
    chatChannel.bind('join', ({ name }) => console.warn(`${name} joined the chat`));
    chatChannel.bind('message', ({ message, receiver }) => {
      // update messages anytime there's a new message
      if (message.user._id === sender.email || receiver._id === sender.email) {
        setMessages((prevMessages) => GiftedChat.append(prevMessages, message));
      }
    });
    axios.put(`${pusherConfig.serverEndpoint}/users/${sender.email}`, { name: sender.username });
    // get previous messages
    (async () => {
      const { data } = await axios.get(`${pusherConfig.serverEndpoint}/users/messages/?sender=${sender.email}&receiver=${currentFriend.email}`);
      setMessages(data);
    })();
  }, [currentFriend, messages, fonts]);

  const changeFontSize = () => {
    (fonts === 15 ? setFonts(28) : setFonts(15));
  };

  const renderActions = (props) => (
    <Actions
      {...props}
      containerStyle={{
        width: 44,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 4,
        marginRight: 4,
        marginBottom: 0,
      }}
      icon={() => (
        <Image
          style={{ width: 32, height: 32 }}
          source={{
            uri: 'https://icon-library.com/images/font-size-icon/font-size-icon-18.jpg',
          }}
        />
      )}
      onPressActionButton={() => { changeFontSize(); }}
    />
  );

  const renderBubble = (props) => (
    <Bubble
      {...props}
      wrapperStyle={{
        right: {
          backgroundColor: '#0f9535',
        },
      }}
      textStyle={{
        right: {
          fontSize: fonts,
        },
        left: {
          fontSize: fonts,
        },
      }}
    />
  );

  const onSend = useCallback((messages = []) => {
    const receiver = { _id: currentFriend.email, name: currentFriend.username || '', avatar: currentFriend.image };
    const message = messages[0];
    axios.post(`${pusherConfig.serverEndpoint}/users/messages`, { message, receiver });
  }, []);

  return (
    <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss(); }}>
      <View style={{ flex: 2 }}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          // keyboardVerticalOffset={90}
        >
          <GiftedChat
            messages={messages}
            onSend={(messages) => onSend(messages)}
            user={{ _id: sender.email, name: sender.username, avatar: sender.image }}
            showUserAvatar
            renderActions={renderActions}
            renderBubble={renderBubble}
          />
        </KeyboardAvoidingView>

      </View>
    </TouchableWithoutFeedback>
  );
};
export default FriendChat;
