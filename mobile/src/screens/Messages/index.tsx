import React, {useState, useEffect, useRef, useContext} from 'react';
import {Keyboard, FlatList, StatusBar, ActivityIndicator} from 'react-native';
import {useRoute, useNavigation} from '@react-navigation/native';
import {AxiosRequestConfig} from 'axios';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import EmojiSelector, {Categories} from 'react-native-emoji-selector';
import {Modalize} from 'react-native-modalize';

import socket from '../../services/websocket';

import ChatDetails from '../../components/ChatDetails';
import ShowModalRoom from '../../components/ShowModalRoom';
import AddUserInRoom from '../../components/AddUserInRoom';
import LeaveRoomModal from '../../components/LeaveRoom';

import {handleTwoDigitsFormat} from '../../utils/messageDateFormatter';

import AuthContext from '../../contexts/auth';

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
  AddUserInRoomModal,
  UpdateRoom,
  LeaveRoom,
  ActionLabel,
  shadowContainer,
  ChatContainerMessageBot,
  ChatMessageBot,
  ChatContainerMessageSent,
  ChatMessageHeader,
  MessageSentHour,
  MessageSent,
  MessageSenderName,
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
  bot: boolean;
  username?: string;
  message: string;
  image?: string;
  created_at: string;
}

interface IDataReceivedFromNavigation {
  contactData?: ILatestMessageOfContact;
  roomData?: ILatestMessageOfRoom;
}

const Messages: React.FC = () => {
  // Context
  const {userData} = useContext(AuthContext);

  // Ref
  const flatListRef = useRef<FlatList>(null);
  const modalizeChatDetailsRef = useRef<Modalize>(null);
  const modalizeLeaveRoomRef = useRef<Modalize>(null);
  const pageRef = useRef<number>(1);
  // const lastPageRef = useRef<number>(1);
  // const totalPage = useRef<number>(0);

  // States
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

  function handleShowModalizeChatDetails() {
    return modalizeChatDetailsRef.current?.open();
  }

  function handleOpenModalRoom() {
    setShowChatActions(false);

    return setToggleModalRoom(true);
  }

  function handleOpenModalAddUserInRoom() {
    setShowChatActions(false);

    return setToggleModalAddUserInRoom(true);
  }

  function handleShowModalizeLeaveRoom() {
    setShowChatActions(false);

    return modalizeLeaveRoomRef.current?.open();
  }

  function handleGetNextMessages() {
    if (messages.length < 10) {
      return false;
    }

    pageRef.current = pageRef.current + 1;
  }

  function handleRenderItem({item}: {item: IMessages}) {
    if (item?.bot) {
      return (
        <ChatContainerMessageBot>
          <ChatMessageBot>{item?.message}</ChatMessageBot>
        </ChatContainerMessageBot>
      );
    }

    return item?.id === userData?.id ? (
      <ChatContainerMessageSent>
        <MessageSentHour>{item?.created_at}</MessageSentHour>
        <MessageSent>{item?.message}</MessageSent>
      </ChatContainerMessageSent>
    ) : (
      <ChatContainerMessageReceived>
        {dataReceivedFromNavigation?.roomData ? (
          <ChatMessageHeader>
            <MessageSenderName>~ {item?.username}</MessageSenderName>
            <MessageReceivedHour>{item?.created_at}</MessageReceivedHour>
          </ChatMessageHeader>
        ) : (
          <MessageReceivedHour>{item?.created_at}</MessageReceivedHour>
        )}
        <MessageReceived>{item?.message}</MessageReceived>
      </ChatContainerMessageReceived>
    );
  }

  function handleSerializedMessages(allMessages: IMessages[]) {
    const serialized = allMessages.map((item) => ({
      id: item?.id,
      bot: item?.bot,
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
        bot: false,
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

      // Handle with websocket from backend
      // Emit message from websocket backend
      if (dataReceivedFromNavigation?.contactData) {
        socket.emit(
          'joinPrivateChat',
          dataReceivedFromNavigation?.contactData?.email,
        );

        return socket.emit('chatMessage', {
          email: dataReceivedFromNavigation?.contactData?.email,
        });
      } else {
        socket.emit(
          'joinRoomChat',
          dataReceivedFromNavigation?.roomData?.nickname,
        );

        return socket.emit('chatMessage', {
          nickname: dataReceivedFromNavigation?.roomData?.nickname,
        });
      }
    } catch (err) {
      const {error} = err.response.data;

      return Toast.error(error);
    }
  }

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

    function handleUpdateMessages(response: boolean) {
      if (response) {
        handleGetMessages();
      }
    }

    // Websocket mobile - Listen emit from backend
    socket.on('message', handleUpdateMessages);

    // Remove emit
    return () => {
      socket.off('message', handleUpdateMessages);
    };
  }, [userData, dataReceivedFromNavigation]);

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#7159c1" />

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
            <ChatInfo onPress={handleShowModalizeChatDetails}>
              <ChatName>
                {dataReceivedFromNavigation?.contactData
                  ? dataReceivedFromNavigation?.contactData?.username
                  : dataReceivedFromNavigation?.roomData?.name}
              </ChatName>
              <ChatStatus>Online</ChatStatus>
            </ChatInfo>
            {dataReceivedFromNavigation?.roomData && (
              <ChatAction onPress={handleToggleChatActions}>
                <SimpleLineIcons
                  name="options-vertical"
                  color="#fff"
                  size={20}
                />
              </ChatAction>
            )}
          </Header>

          {showChatActions && (
            <MessageOptions style={shadowContainer.shadowBox}>
              {dataReceivedFromNavigation.roomData && (
                <>
                  <AddUserInRoomModal onPress={handleOpenModalAddUserInRoom}>
                    <AntDesign name="adduser" color="#7159c1" size={20} />
                    <ActionLabel>Adicionar usuário</ActionLabel>
                  </AddUserInRoomModal>

                  <UpdateRoom onPress={handleOpenModalRoom}>
                    <Feather name="edit" color="#7159c1" size={20} />
                    <ActionLabel>Editar grupo</ActionLabel>
                  </UpdateRoom>

                  <LeaveRoom onPress={handleShowModalizeLeaveRoom}>
                    <AntDesign name="logout" color="#7159c1" size={20} />
                    <ActionLabel>Sair do grupo</ActionLabel>
                  </LeaveRoom>
                </>
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
            // ListFooterComponent={() =>
            //   loadingMessages ? (
            //     <ActivityIndicator size="large" color="#7159c1" animating />
            //   ) : null
            // }
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
                <MaterialIcons
                  name="insert-emoticon"
                  color="#7159c1"
                  size={23}
                />
              </SelectEmoji>
              {messageInput.length === 0 && (
                <AudioRecord>
                  <SimpleLineIcons name="microphone" color="#fff" size={23} />
                </AudioRecord>
              )}
            </MessageField>

            {showEmojis && (
              <EmojiContainer>
                <EmojiSelector
                  theme="#7159c1"
                  columns={10}
                  showSectionTitles={false}
                  showSearchBar={false}
                  placeholder="Pesquisar..."
                  category={Categories.emotion}
                  onEmojiSelected={(emoji) =>
                    setMessageInput((prevState) => prevState + emoji)
                  }
                />
              </EmojiContainer>
            )}
          </WrapperMessage>

          {/* Modal for chat details */}
          <Modalize
            ref={modalizeChatDetailsRef}
            adjustToContentHeight={
              dataReceivedFromNavigation?.contactData ? true : undefined
            }
            // snapPoint={dataReceivedFromNavigation?.roomData ? 470 : undefined}
            handleStyle={handleStyle.background}
            overlayStyle={overlayStyle.background}>
            <ChatDetails chatData={dataReceivedFromNavigation} />
          </Modalize>

          {/* Modal for leave room */}
          <Modalize
            ref={modalizeLeaveRoomRef}
            adjustToContentHeight
            withHandle={false}
            overlayStyle={overlayStyle.background}>
            <LeaveRoomModal
              modalRef={modalizeLeaveRoomRef}
              userId={Number(userData?.id)}
              roomId={Number(dataReceivedFromNavigation?.roomData?.id)}
            />
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
              roomId={Number(dataReceivedFromNavigation?.roomData?.id)}
              nickname={String(dataReceivedFromNavigation?.roomData?.nickname)}
            />
          )}
        </Container>
      </Wrapper>
    </>
  );
};

export default Messages;
