import React, {useState, useEffect, useRef} from 'react';
import {Keyboard, FlatList, ActivityIndicator} from 'react-native';
import {useRoute, useNavigation} from '@react-navigation/native';
import {AxiosRequestConfig} from 'axios';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import SimpleLinIcons from 'react-native-vector-icons/SimpleLineIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import EmojiSelector, {Categories} from 'react-native-emoji-selector';
import AsyncStorage from '@react-native-community/async-storage';
import {Modalize} from 'react-native-modalize';

import socket from '../../services/websocket';

import ChatDetails from '../../components/ChatDetails';
import ShowModalRoom from '../../components/ShowModalRoom';
import AddUserInRoom from '../../components/AddUserInRoom';

import {handleTwoDigitsFormat} from '../../utils/messageDateFormatter';

import api from '../../services/api';

import Toast from '../../config/toastStyles';

// Import exported interface
import {ILatestMessageOfContact} from '../Chat';
import {ILatestMessageOfRoom} from '../Rooms';

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
  // ClearMessages,
  // DeleteChat,
  UpdateRoom,
  AddUserInRoomModal,
  ActionLabel,
  shadowContainer,
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

interface IMessages {
  id: number;
  username?: string;
  message: string;
  image?: string;
  created_at: string;
}

interface IDataReceivedFromNavigation {
  contactData?: ILatestMessageOfContact;
  roomData?: ILatestMessageOfRoom;
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
  const flatListRef = useRef<FlatList>(null);
  const modalizeRef = useRef<Modalize>(null);
  const pageRef = useRef<number>(1);
  // const lastPageRef = useRef<number>(1);
  // const totalPage = useRef<number>(0);

  // States
  const [userData, setUserData] = useState<IUserData>({});
  const [messages, setMessages] = useState<IMessages[]>([]);
  const [loadingMessages, setLoadingMessages] = useState<boolean>(false);
  const [messageInput, setMessageInput] = useState<string>('');
  const [showChatActions, setShowChatActions] = useState<boolean>(false);
  const [showEmojis, setShowEmojis] = useState<boolean>(false);
  const [toggleModalRoom, setToggleModalRoom] = useState<boolean>(false);
  const [toggleModalAddUserInRoom, setToggleModalAddUserInRoom] = useState<
    boolean
  >(false);

  // Navigation
  const navigation = useNavigation();
  const dataReceivedFromNavigation = useRoute()
    .params as IDataReceivedFromNavigation;

  function handleNavigateToBack() {
    if (dataReceivedFromNavigation?.contactData) {
      return navigation.navigate('Chat');
    } else {
      return navigation.navigate('Rooms');
    }
  }

  function handleToggleChatActions() {
    return setShowChatActions(!showChatActions);
  }

  function handleShowEmojis() {
    return setShowEmojis(!showEmojis);
  }

  function handleShowModalize() {
    return modalizeRef.current?.open();
  }

  function handleOpenModalRoom() {
    setShowChatActions(false);

    return setToggleModalRoom(true);
  }

  function handleOpenModalAddUserInRoom() {
    setShowChatActions(false);

    return setToggleModalAddUserInRoom(true);
  }

  function handleGetNextMessages() {
    if (messages.length < 10) {
      return false;
    }

    pageRef.current = pageRef.current + 1;
  }

  function handleRenderItem({item}) {
    return (dataReceivedFromNavigation?.contactData &&
      item?.id === userData?.id) ||
      (dataReceivedFromNavigation?.roomData && item?.id === userData?.id) ? (
      <ChatContainerMessageSent>
        <MessageSentHour>{item?.created_at}</MessageSentHour>
        <MessageSent>{item?.message}</MessageSent>
      </ChatContainerMessageSent>
    ) : (
      <ChatContainerMessageReceived>
        <MessageReceivedHour>{item?.created_at}</MessageReceivedHour>
        <MessageReceived>{item?.message}</MessageReceived>
      </ChatContainerMessageReceived>
    );
  }

  function handleSerializedMessages(allMessages: IMessages[]) {
    const serialized = allMessages.map((item) => ({
      id: item?.id,
      username: item?.username,
      image: item?.image,
      message: item?.message,
      created_at: handleTwoDigitsFormat(item?.created_at),
    }));

    return serialized;
  }

  async function handleSubmit() {
    try {
      const data = {
        from: userData?.id,
        to_user: dataReceivedFromNavigation?.contactData
          ? dataReceivedFromNavigation?.contactData?.id
          : null,
        to_room: dataReceivedFromNavigation?.roomData
          ? dataReceivedFromNavigation?.roomData?.id
          : null,
        message: messageInput,
      };

      const sendMessage = await api.post('/message', data);

      if (!sendMessage) {
        return Toast.error('Erro ao enviar mensagem.');
      }

      setMessageInput('');

      // Emit message from websocket backend
      return socket.emit('chatMessage', messageInput);
    } catch (err) {
      const {error} = err.response.data;

      return Toast.error(error);
    }
  }

  useEffect(() => {
    async function handleSetLocalUserData() {
      const getMyData = await AsyncStorage.getItem('@rocketMessages/userData');

      const data = JSON.parse(String(getMyData));

      return setUserData(data);
    }

    handleSetLocalUserData();
  }, []);

  useEffect(() => {
    async function handleGetMessages() {
      const requestUrl = dataReceivedFromNavigation?.contactData
        ? `/privatemessages/${userData?.id}/${dataReceivedFromNavigation?.contactData?.id}`
        : '/roommessages';

      const requestOptions = {
        params: {
          nickname: dataReceivedFromNavigation?.roomData
            ? dataReceivedFromNavigation?.roomData?.nickname
            : undefined,
          page: 1,
          limit: 100,
        },
      } as AxiosRequestConfig;

      try {
        setLoadingMessages(true);

        const allMessages = await api.get<IMessages[]>(
          requestUrl,
          requestOptions,
        );

        if (!allMessages) {
          return Toast.error('Erro ao listar mensagens.');
        }

        const response = handleSerializedMessages(allMessages.data);

        // setMessages((prevState) =>
        //   pageRef.current === 1 ? response : [...prevState, ...response],
        // );

        setLoadingMessages(false);

        return setMessages(response);
      } catch (err) {
        const {error} = err.response.data;

        return Toast.error(error);
      }
    }

    handleGetMessages();

    // Websocket mobile - Listen emit from backend
    socket.on('message', (message: string) => {
      if (message.length !== 0) {
        handleGetMessages();
      }
    });

    // Remove emit
    return () => {
      socket.off('message', handleGetMessages);
    };
  }, [userData, dataReceivedFromNavigation]);

  return (
    <Wrapper>
      <Container onPress={() => setShowChatActions(false)}>
        <Header>
          <BackButton onPress={handleNavigateToBack}>
            <Ionicons name="ios-arrow-back" color="#fff" size={20} />
          </BackButton>
          <ChatImage
            source={{
              uri: dataReceivedFromNavigation?.contactData
                ? dataReceivedFromNavigation?.contactData?.photo
                : dataReceivedFromNavigation?.roomData?.avatar,
            }}
          />
          <ChatInfo onPress={handleShowModalize}>
            <ChatName>
              {dataReceivedFromNavigation?.contactData
                ? dataReceivedFromNavigation?.contactData?.username
                : dataReceivedFromNavigation?.roomData?.name}
            </ChatName>
            <ChatStatus>Online</ChatStatus>
          </ChatInfo>
          {dataReceivedFromNavigation?.roomData && (
            <ChatAction onPress={handleToggleChatActions}>
              <SimpleLinIcons name="options-vertical" color="#fff" size={20} />
            </ChatAction>
          )}
        </Header>

        {showChatActions && (
          <MessageOptions style={shadowContainer.shadowBox}>
            {/* <ClearMessages>
              <MaterialIcons name="clear" color="#7159c1" size={20} />
              <ActionLabel>Limpar mensagens</ActionLabel>
            </ClearMessages>
            <DeleteChat>
              <AntDesign name="deleteuser" color="#7159c1" size={20} />
              <ActionLabel>Deletar conversa</ActionLabel>
            </DeleteChat> */}
            {dataReceivedFromNavigation.roomData && (
              <AddUserInRoomModal onPress={handleOpenModalAddUserInRoom}>
                <AntDesign name="adduser" color="#7159c1" size={20} />
                <ActionLabel>Adicionar usuário</ActionLabel>
              </AddUserInRoomModal>
            )}
            {dataReceivedFromNavigation.roomData && (
              <UpdateRoom onPress={handleOpenModalRoom}>
                <Feather name="edit" color="#7159c1" size={20} />
                <ActionLabel>Editar grupo</ActionLabel>
              </UpdateRoom>
            )}
          </MessageOptions>
        )}

        <FlatList
          keyExtractor={(item, index) => String(index)}
          data={messages}
          // extraData={loadingMessages}
          ref={flatListRef}
          // removeClippedSubviews
          // initialNumToRender={10}
          onContentSizeChange={() =>
            flatListRef?.current?.scrollToEnd({
              animated: false,
            })
          }
          onEndReached={handleGetNextMessages}
          onEndReachedThreshold={0.1}
          ListFooterComponent={() =>
            loadingMessages ? (
              <ActivityIndicator size="large" color="#7159c1" animating />
            ) : null
          }
          renderItem={handleRenderItem}
        />

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
          adjustToContentHeight={
            dataReceivedFromNavigation?.contactData ? true : undefined
          }
          snapPoint={dataReceivedFromNavigation?.roomData ? 470 : undefined}
          handleStyle={handleStyle.background}
          overlayStyle={overlayStyle.background}>
          <ChatDetails chatData={dataReceivedFromNavigation} />
        </Modalize>

        {toggleModalRoom && (
          <ShowModalRoom
            toggleModalRoom={toggleModalRoom}
            setToggleModalRoom={setToggleModalRoom}
            whichModal="update"
            roomData={dataReceivedFromNavigation?.roomData}
          />
        )}

        {toggleModalAddUserInRoom && (
          <AddUserInRoom
            toggleModalAddUserInRoom={toggleModalAddUserInRoom}
            setToggleModalAddUserInRoom={setToggleModalAddUserInRoom}
            nickname={String(dataReceivedFromNavigation?.roomData?.nickname)}
            roomId={Number(dataReceivedFromNavigation?.roomData?.id)}
          />
        )}
      </Container>
    </Wrapper>
  );
};

export default Messages;
