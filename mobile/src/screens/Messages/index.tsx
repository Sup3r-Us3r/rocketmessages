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
import {Modalize} from 'react-native-modalize';

import ChatDetails from '../../components/ChatDetails';

import api from '../../services/api';

import Toast from '../../config/toastStyles';

import {
  Wrapper,
  Container,
  Header,
  BackButton,
  ChatImage,
  ChatInfo,
  ChatName,
  ChatStatus,
  ChatAction,
  MessageOptions,
  ArrowUpIcon,
  ClearMessages,
  DeleteChat,
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
  handleStyle,
  overlayStyle,
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

interface IRoomData {
  key: string;
  id: number;
  name: string;
  nickname: string;
  avatar: string;
  message: string;
  image?: string;
  created_at: string;
}

interface IDataReceivedFromNavigation {
  key?: string;
  id?: number;
  name?: string;
  nickname?: string;
  username?: string;
  email?: string;
  avatar?: string;
  photo?: string;
  status?: string;
  message?: string;
  image?: string;
  created_at?: string;
}

interface IUserData {
  id?: number;
  username?: string;
  email?: string;
  photo?: string;
  status?: string;
  created_at?: Date;
}

const Messages = () => {
  // Ref
  const scrollViewRef = useRef<ScrollView>(null);
  const modalizeRef = useRef<Modalize>(null);

  // States
  const [userData, setUserData] = useState<IUserData>({});
  const [messages, setMessages] = useState<IContactData[] | IRoomData[]>([]);
  const [messageInput, setMessageInput] = useState<string>('');
  const [showChatActions, setShowChatActions] = useState<boolean>(false);
  const [showEmojis, setShowEmojis] = useState<boolean>(false);

  // Navigation
  const navigation = useNavigation();

  const dataReceivedFromNavigation = useRoute()
    .params as IDataReceivedFromNavigation;

  function handleNavigateToBack() {
    if (dataReceivedFromNavigation?.nickname) {
      return navigation.navigate('Rooms');
    } else {
      return navigation.navigate('Chat');
    }
  }

  function handleToggleChatActions() {
    return setShowChatActions(!showChatActions);
  }

  function handleShowEmojis() {
    return setShowEmojis(!showEmojis);
  }

  function handleShowModal() {
    return modalizeRef.current?.open();
  }

  function handleSerializedPrivateMessages(allMessages: IContactData[]) {
    const serialized = allMessages.map((item) => ({
      key: Math.random().toString(30),
      id: item?.id,
      username: item?.username,
      email: item?.email,
      photo: item?.photo,
      status: item?.status,
      image: item?.image,
      message: item?.message,
      created_at: `${new Date(item?.created_at).getHours()}:${new Date(
        item?.created_at,
      ).getMinutes()}`,
    }));

    return serialized;
  }

  function handleSerializedRoomMessages(allMessages: IRoomData[]) {
    const serialized = allMessages.map((item) => ({
      key: Math.random().toString(30),
      id: item.id,
      name: item?.name,
      nickname: item?.nickname,
      avatar: item?.avatar,
      image: item?.image,
      message: item?.message,
      created_at: `${new Date(item?.created_at).getHours()}:${new Date(
        item?.created_at,
      ).getMinutes()}`,
    }));

    return serialized;
  }

  async function handleSubmit() {
    try {
      const data = {
        from: userData?.id,
        to_user: dataReceivedFromNavigation?.id,
        to_room: null,
        message: messageInput,
      };

      const sendMessage = await api.post('/message', data);

      if (!sendMessage) {
        return Toast.error('Erro ao enviar mensagem.');
      }

      return setMessageInput('');
    } catch (err) {
      const {error} = err.response.data;

      return Toast.error(error);
    }
  }

  useEffect(() => {
    async function handleSetLocalUserData() {
      const getMyData = await AsyncStorage.getItem('@rocketMessages/userData');

      const data = JSON.parse(String(getMyData));

      setUserData(data);
    }

    handleSetLocalUserData();
  }, []);

  useEffect(() => {
    async function handleGetPrivateMessages() {
      try {
        const allMessages = await api.get<IContactData[]>(
          `/privatemessages/${userData.id}/${dataReceivedFromNavigation.id}`,
        );

        if (!allMessages) {
          return Toast.error('Erro ao listar mensagens.');
        }

        const response = handleSerializedPrivateMessages(allMessages.data);

        return setMessages(response);
      } catch (err) {
        const {error} = err.response.data;

        return Toast.error(error);
      }
    }

    async function handleGetRoomMessages() {
      try {
        const allMessages = await api.get<IRoomData[]>('/roommessages', {
          params: {
            nickname: dataReceivedFromNavigation?.nickname,
          },
        });

        if (!allMessages) {
          return Toast.error('Erro ao listar mensagens.');
        }

        const response = handleSerializedRoomMessages(allMessages.data);

        return setMessages(response);
      } catch (err) {
        const {error} = err.response.data;

        return Toast.error(error);
      }
    }

    // Room or Private messages
    if (dataReceivedFromNavigation?.nickname) {
      handleGetRoomMessages();
    } else {
      handleGetPrivateMessages();
    }
  }, [userData, dataReceivedFromNavigation]);

  return (
    <Wrapper>
      <Container>
        <Header>
          <BackButton onPress={handleNavigateToBack}>
            <Ionicons name="ios-arrow-back" color="#fff" size={20} />
          </BackButton>
          <ChatImage
            source={{
              uri: dataReceivedFromNavigation?.photo
                ? dataReceivedFromNavigation?.photo
                : dataReceivedFromNavigation?.avatar,
            }}
          />
          <ChatInfo onPress={handleShowModal}>
            <ChatName>
              {dataReceivedFromNavigation?.username
                ? dataReceivedFromNavigation?.username
                : dataReceivedFromNavigation?.name}
            </ChatName>
            <ChatStatus>Online</ChatStatus>
          </ChatInfo>
          <ChatAction onPress={handleToggleChatActions}>
            <SimpleLinIcons name="options-vertical" color="#fff" size={20} />
          </ChatAction>
        </Header>

        {showChatActions && (
          <>
            <ArrowUpIcon style={shadowContainer.shadowBox} />
            <MessageOptions style={shadowContainer.shadowBox}>
              <ClearMessages>
                <MaterialIcons name="clear" color="#7159c1" size={20} />
                <ActionLabel>Limpar mensagens</ActionLabel>
              </ClearMessages>
              <DeleteChat>
                <AntDesign name="deleteuser" color="#7159c1" size={20} />
                <ActionLabel>Deletar conversa</ActionLabel>
              </DeleteChat>
            </MessageOptions>
          </>
        )}

        <ChatContainer
          ref={scrollViewRef}
          onContentSizeChange={() =>
            scrollViewRef?.current?.scrollToEnd({animated: true})
          }>
          {(messages as Array<IContactData | IRoomData>).map(
            (chat: IContactData | IRoomData) =>
              chat?.id === dataReceivedFromNavigation?.id ? (
                <ChatContainerMessageSent key={String(chat.key)}>
                  <MessageSentHour>{chat?.created_at}</MessageSentHour>
                  <MessageSent>{chat?.message}</MessageSent>
                </ChatContainerMessageSent>
              ) : (
                <ChatContainerMessageReceived key={String(chat?.key)}>
                  <MessageReceivedHour>{chat?.created_at}</MessageReceivedHour>
                  <MessageReceived>{chat?.message}</MessageReceived>
                </ChatContainerMessageReceived>
              ),
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
                <MaterialCommunityIcons name="send" color="#fff" size={23} />
              </SendMessage>
            )}
            <SelectEmoji onPress={handleShowEmojis}>
              <MaterialIcons name="insert-emoticon" color="#7159c1" size={23} />
            </SelectEmoji>
            {messageInput.length === 0 && (
              <AudioRecord>
                <SimpleLinIcons name="microphone" color="#fff" size={23} />
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

        <Modalize
          ref={modalizeRef}
          snapPoint={470}
          // modalHeight={470}
          handleStyle={handleStyle.background}
          overlayStyle={overlayStyle.background}>
          <ChatDetails chatData={dataReceivedFromNavigation} />
        </Modalize>
      </Container>
    </Wrapper>
  );
};

export default Messages;
