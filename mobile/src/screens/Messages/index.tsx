import React, {useState, useEffect, useRef} from 'react';
import {Keyboard, ScrollView} from 'react-native';
import {useRoute, useNavigation} from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import SimpleLinIcons from 'react-native-vector-icons/SimpleLineIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import EmojiSelector, {Categories} from 'react-native-emoji-selector';
import AsyncStorage from '@react-native-community/async-storage';

import Toast from '../../config/toastStyles';

import api from '../../services/api';

import {
  Wrapper,
  Container,
  Header,
  BackButton,
  ContactImage,
  ContactInfo,
  ContactName,
  ContactStatus,
  ContactAction,
  MessageOptions,
  ArrowUpIcon,
  ClearMessages,
  DeleteContact,
  ActionLabel,
  shadowContainer,
  ChatContainer,
  ChatContainerMessageSent,
  MessageSentHour,
  MessageSent,
  ChatContainerMessageReceived,
  MessageReceivedHour,
  MessageReceived,
  WrapperMessage,
  MessageField,
  InputMessage,
  SendMessage,
  SelectEmoji,
  AudioRecord,
  EmojiContainer,
} from './styles';

interface IContactData {
  key: string;
  id: number;
  username: string;
  email: string;
  photo: string;
  status?: string;
  message: string;
  image?: string;
  created_at: string;
}

const date = new Date();
const messages = [
  {
    key: 1,
    message: 'Test message',
    whoSent: 'me',
    messageDate: `${date.getHours()}:${date.getMinutes()}`,
  },
  {
    key: 2,
    message:
      'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Numquam suscipit soluta totam id libero aut sint. Laborum eveniet ipsa omnis quisquam iure.',
    whoSent: 'me',
    messageDate: `${date.getHours()}:${date.getMinutes()}`,
  },
  {
    key: 3,
    message: 'Test message',
    whoSent: 'other',
    messageDate: `${date.getHours()}:${date.getMinutes()}`,
  },
  {
    key: 4,
    message: 'Illum omnis esse, iste cumque consequuntur eveniet eaque!',
    whoSent: 'other',
    messageDate: `${date.getHours()}:${date.getMinutes()}`,
  },
  {
    key: 5,
    message: ' Illum omnis esse, iste cumque',
    whoSent: 'other',
    messageDate: `${date.getHours()}:${date.getMinutes()}`,
  },
  {
    key: 6,
    message: 'consequuntur eveniet eaque!',
    whoSent: 'me',
    messageDate: `${date.getHours()}:${date.getMinutes()}`,
  },
  {
    key: 7,
    message: 'Test message',
    whoSent: 'other',
    messageDate: `${date.getHours()}:${date.getMinutes()}`,
  },
  {
    key: 8,
    message: 'Lorem, ipsum dolor.',
    whoSent: 'other',
    messageDate: `${date.getHours()}:${date.getMinutes()}`,
  },
  {
    key: 9,
    message: 'Lorem ipsum dolor sit amet consectetur.',
    whoSent: 'me',
    messageDate: `${date.getHours()}:${date.getMinutes()}`,
  },
  {
    key: 10,
    message:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae quis labore rerum delectus reprehenderit nemo quaerat ut porro at dolorem.',
    whoSent: 'me',
    messageDate: `${date.getHours()}:${date.getMinutes()}`,
  },
  {
    key: 11,
    message: 'Test message',
    whoSent: 'me',
    messageDate: `${date.getHours()}:${date.getMinutes()}`,
  },
  {
    key: 12,
    message: 'Test message',
    whoSent: 'other',
    messageDate: `${date.getHours()}:${date.getMinutes()}`,
  },
  {
    key: 13,
    message:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae quis',
    whoSent: 'me',
    messageDate: `${date.getHours()}:${date.getMinutes()}`,
  },
];

const Messages = () => {
  // Ref
  const scrollViewRef = useRef<ScrollView>(null);

  // States
  const [messages, setMessages] = useState<IContactData[]>([]);
  const [messageInput, setMessageInput] = useState<string>('');
  const [showContactActions, setShowContactActions] = useState<boolean>(false);
  const [showEmojis, setShowEmojis] = useState<boolean>(false);

  // Navigation
  const navigation = useNavigation();
  const contact = useRoute().params as IContactData;

  function handleNavigateToBack() {
    navigation.navigate('Chat');
  }

  function handleToggleContactActions() {
    setShowContactActions(!showContactActions);
  }

  function handleShowEmojis() {
    setShowEmojis(!showEmojis);
  }

  function handleSerializedMessages(allMessages: IContactData[]) {
    const serialized = allMessages.map((item) => ({
      key: Math.random().toString(30),
      id: item.id,
      username: item.username,
      email: item.email,
      photo: item.photo,
      status: item.status,
      image: item.image,
      message: item.message,
      created_at: `${new Date(item.created_at).getHours()}:${new Date(
        item.created_at,
      ).getMinutes()}`,
    }));

    return serialized;
  }

  async function handleSubmit() {
    try {
      const data = {
        from: 2,
        to_user: 1,
        to_room: null,
        message: messageInput,
      }

      const sendMessage = await api.post('/message', data);

      if (!sendMessage) {
        return Toast.error('Erro ao enviar mensagem.');
      }

      return setMessageInput('');
    } catch(err) {
      const {error} = err.response.data;

      return Toast.error(error);
    }
  }

  useEffect(() => {
    async function handleGetPrivateMessages() {
      try {
        const getMyData = await AsyncStorage.getItem(
          '@rocketMessages/userData',
        );

        const {data} = JSON.parse(String(getMyData));

        const allMessages = await api.get<IContactData[]>(
          `/privatemessages/${data.id}/${contact.id}`
        );

        if (!allMessages) {
          return Toast.error('Erro ao listar mensagens.');
        }

        const response = handleSerializedMessages(allMessages.data);

        setMessages(response);
      } catch(err) {
        const { error } = err.response.data;
        
        return Toast.error(error);
      }
    }

    handleGetPrivateMessages();
  }, []);

  return (
    <Wrapper>
      <Container>
        <Header>
          <BackButton onPress={handleNavigateToBack}>
            <Ionicons name="ios-arrow-back" color="#fff" size={20} />
          </BackButton>
          <ContactImage source={{ uri: contact.photo }} />
          <ContactInfo>
            <ContactName>{contact.username}</ContactName>
            <ContactStatus>Online</ContactStatus>
          </ContactInfo>
          <ContactAction onPress={handleToggleContactActions}>
            <SimpleLinIcons name="options-vertical" color="#fff" size={20} />
          </ContactAction>
        </Header>

        {showContactActions && (
          <>
            <ArrowUpIcon style={shadowContainer.shadowBox} />
            <MessageOptions style={shadowContainer.shadowBox}>
              <ClearMessages>
                <MaterialIcons name="clear" color="#7159c1" size={20} />
                <ActionLabel>Limpar mensagens</ActionLabel>
              </ClearMessages>
              <DeleteContact>
                <AntDesign name="deleteuser" color="#7159c1" size={20} />
                <ActionLabel>Deletar contato</ActionLabel>
              </DeleteContact>
            </MessageOptions>
          </>
        )}

        <ChatContainer
          ref={scrollViewRef}
          onContentSizeChange={() => scrollViewRef?.current?.scrollToEnd({
            animated: true
          })}
        >
          {messages?.map((message) =>
            message.id === contact.id ? (
              <ChatContainerMessageSent key={String(message.key)}>
                <MessageSentHour>{message.created_at}</MessageSentHour>
                <MessageSent>{message.message}</MessageSent>
              </ChatContainerMessageSent>
            ) : (
              <ChatContainerMessageReceived key={String(message.key)}>
                <MessageReceivedHour>{message.created_at}</MessageReceivedHour>
                <MessageReceived>{message.message}</MessageReceived>
              </ChatContainerMessageReceived>
            )
          )}
        </ChatContainer>

        <WrapperMessage>
          <MessageField>
            <InputMessage
              placeholder="Digite uma mensagem"
              autoCorrect={false}
              multiline
              onBlur={Keyboard.dismiss}
              onSubmitEditing={() => null}
              onChangeText={setMessageInput}
              value={messageInput}
            />
            {messageInput.length > 0 && (
              <SendMessage onPress={handleSubmit}>
                <MaterialCommunityIcons name="send" color="#7159c1" size={23} />
              </SendMessage>
            )}
            <SelectEmoji onPress={handleShowEmojis}>
              <MaterialIcons name="insert-emoticon" color="#7159c1" size={23} />
            </SelectEmoji>
            {messageInput.length === 0 && (
              <AudioRecord>
                <SimpleLinIcons name="microphone" color="#7159c1" size={23} />
              </AudioRecord>
            )}
          </MessageField>

          {showEmojis && (
            <EmojiContainer>
              <EmojiSelector
                columns={10}
                showSectionTitles={false}
                showSearchBar={false}
                placeholder="Pesquisar..."
                category={Categories.emotion}
                onEmojiSelected={(emoji) => console.log(emoji)}
              />
            </EmojiContainer>
          )}
        </WrapperMessage>
      </Container>
    </Wrapper>
  );
};

export default Messages;
