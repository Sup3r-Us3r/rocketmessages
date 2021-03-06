import React, {useState, useEffect, useRef, useContext} from 'react';
import {FlatList, ActivityIndicator} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
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

import ChatDetails from '../../components/ChatDetails';
import CreateOrEditRoom, {
  ICreateOrEditRoomHandles,
} from '../../components/CreateOrEditRoom';
import AddUserInRoom, {
  IAddUserInRoomHandles,
} from '../../components/AddUserInRoom';
import LeaveRoomModal from '../../components/LeaveRoom';

import {updatePrivateMainPageRequest} from '../../store/modules/refreshPrivate/actions';

import AuthContext from '../../contexts/auth';

import {handleTwoDigitsFormat} from '../../utils/messageDateFormatter';

import socket from '../../services/websocket';
import api from '../../services/api';
import {handlePrivateJoinUsers} from '../../services/refreshData';

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
  // Redux
  const dispatch = useDispatch();
  const updateParticipant = useSelector(
    (state: any) => state.refreshRoom.updateParticipant,
  );
  const newMessage = useSelector(
    (state: any) => state.refreshPrivate.newMessage,
  );

  // Context
  const {userData} = useContext(AuthContext);

  // Ref
  const flatListRef = useRef<FlatList>(null);
  const modalizeChatDetailsRef = useRef<Modalize>(null);
  const modalizeLeaveRoomRef = useRef<Modalize>(null);
  const pageRef = useRef<number>(1);
  const createOrEditRoomRef = useRef<ICreateOrEditRoomHandles>(null);
  const addUserInRoomRef = useRef<IAddUserInRoomHandles>(null);
  // const lastPageRef = useRef<number>(1);
  // const totalPage = useRef<number>(0);

  // State
  const [messages, setMessages] = useState<IMessages[]>([]);
  const [loadingMessages, setLoadingMessages] = useState<boolean>(true);
  const [messageInput, setMessageInput] = useState<string>('');
  const [showChatActions, setShowChatActions] = useState<boolean>(false);
  const [showEmojis, setShowEmojis] = useState<boolean>(false);
  const [hideMessageField, setHideMessageField] = useState<boolean>(false);
  const [status, setStatus] = useState<string>('');

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

  function handleEditRoom() {
    setShowChatActions(false);

    return createOrEditRoomRef.current?.openModal();
  }

  function handleOpenModalAddUserInRoom() {
    setShowChatActions(false);

    return addUserInRoomRef.current?.openModal();
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

  function handleTypingMessage(message: string) {
    setMessageInput(message);

    return socket.emit('typing', true);
  }

  function handleStopTyping() {
    return socket.emit('typing', false);
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
      socket.emit('typing', false);

      if (userData && dataReceivedFromNavigation?.contactData) {
        // First message for user
        if (messages.length === 0) {
          dispatch(
            updatePrivateMainPageRequest(
              dataReceivedFromNavigation?.contactData?.username,
            ),
          );
        }

        const idsJoined = [
          userData?.id,
          dataReceivedFromNavigation?.contactData?.id,
        ];

        return socket.emit('chatMessage', {
          private: idsJoined,
        });
      } else {
        return socket.emit('chatMessage', {
          room: dataReceivedFromNavigation?.roomData?.nickname,
        });
      }
    } catch (err) {
      const {error} = err.response.data;

      return Toast.error(error);
    }
  }

  useEffect(() => {
    async function allowedToSendMessage() {
      try {
        const user = await api.get(
          `/getoutoftheroom/${userData?.id}/${dataReceivedFromNavigation?.roomData?.id}`,
        );

        if (user.status !== 200) {
          setHideMessageField(true);
        }
      } catch (err) {
        const {error} = err.response.data;

        return Toast.error(error);
      }
    }

    if (dataReceivedFromNavigation?.roomData) {
      allowedToSendMessage();
    }
  }, [userData, dataReceivedFromNavigation]);

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
  }, [userData, dataReceivedFromNavigation, updateParticipant, newMessage]);

  // useEffect(() => {
  //   function handleMessageRefresh(response: {
  //     private?: number[];
  //     room?: string;
  //   }) {
  //     if (userData && response?.private?.includes(userData?.id)) {
  //     }

  //     if (
  //       userData &&
  //       response?.room === dataReceivedFromNavigation?.roomData?.nickname
  //     ) {
  //     }
  //   }

  //   socket.on('messageRefresh', handleMessageRefresh);

  //   return () => {
  //     socket.off('messageRefresh', handleMessageRefresh);
  //   };
  // }, [userData, dataReceivedFromNavigation]);

  useEffect(() => {
    if (userData && dataReceivedFromNavigation?.contactData) {
      handlePrivateJoinUsers(
        userData?.id,
        dataReceivedFromNavigation?.contactData?.id,
      ).emit();
    } else {
      socket.emit(
        'joinChatRoom',
        dataReceivedFromNavigation?.roomData?.nickname,
      );
    }
  }, [userData, dataReceivedFromNavigation]);

  useEffect(() => {
    function handleContactIsOnline(response: boolean) {
      if (response) {
        setStatus('Online');
      } else {
        setStatus('Offline');
      }
    }

    if (dataReceivedFromNavigation?.contactData) {
      socket.emit(
        'checkUserOnline',
        dataReceivedFromNavigation?.contactData?.email,
      );
      socket.on('checkUserOnline', handleContactIsOnline);
    }
    return () => {
      socket.off('checkUserOnline', handleContactIsOnline);
    };
  }, [dataReceivedFromNavigation]);

  useEffect(() => {
    function handleSomeoneIsTyping(response: boolean) {
      if (response) {
        setStatus('está digitando...');
      } else {
        setStatus('Online');
      }
    }

    socket.on('typing', handleSomeoneIsTyping);

    return () => {
      socket.off('typing', handleSomeoneIsTyping);
    };
  }, []);

  return (
    <Wrapper>
      <Container onPress={() => setShowChatActions(false)}>
        <Header>
          <BackButton onPress={handleNavigateToBack}>
            <Ionicons name="ios-arrow-back" color="#7159c1" size={20} />
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
            <ChatStatus>
              {dataReceivedFromNavigation?.contactData
                ? status
                : dataReceivedFromNavigation?.roomData?.nickname}
            </ChatStatus>
          </ChatInfo>
          {dataReceivedFromNavigation?.roomData && (
            <ChatAction onPress={handleToggleChatActions}>
              <SimpleLineIcons
                name="options-vertical"
                color="#7159c1"
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

                <UpdateRoom onPress={handleEditRoom}>
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

        {!hideMessageField && (
          <WrapperMessage>
            <MessageField>
              <InputMessage
                scrollEnabled
                placeholder="Digite uma mensagem"
                autoCorrect={false}
                multiline
                onBlur={handleStopTyping}
                onSubmitEditing={() => null}
                onChangeText={(message) => handleTypingMessage(message)}
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
        )}

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

        {/* Modal for edit room */}
        <CreateOrEditRoom
          ref={createOrEditRoomRef}
          whichModal="update"
          roomData={dataReceivedFromNavigation?.roomData}
        />

        {/* Modal for add user in room */}
        <AddUserInRoom
          ref={addUserInRoomRef}
          roomId={Number(dataReceivedFromNavigation?.roomData?.id)}
          nickname={String(dataReceivedFromNavigation?.roomData?.nickname)}
        />
      </Container>
    </Wrapper>
  );
};

export default Messages;
