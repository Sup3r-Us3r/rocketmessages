import React, {useState, useEffect, useCallback, useRef} from 'react';
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

import ChatDetails from '../../components/ChatDetails';
import ShowModalRoom from '../../components/ShowModalRoom';

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
  // ArrowUpIcon,
  ClearMessages,
  DeleteChat,
  UpdateRoom,
  ActionLabel,
  shadowContainer,
  // ChatContainer,
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

  // States
  const [userData, setUserData] = useState<IUserData>({});
  const [messages, setMessages] = useState<IMessages[]>([]);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [lastPage, setLastPage] = useState<number>(0);
  const [loadingMessages, setLoadingMessages] = useState<boolean>(true);
  const [messageInput, setMessageInput] = useState<string>('');
  const [showChatActions, setShowChatActions] = useState<boolean>(false);
  const [showEmojis, setShowEmojis] = useState<boolean>(false);
  const [toggleModal, setToggleModal] = useState<boolean>(false);

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

  function handleShowModal() {
    return modalizeRef.current?.open();
  }

  function handleOpenModal() {
    setShowChatActions(false);

    return setToggleModal(true);
  }

  function handleGetNextMessages() {
    setPage(page + 1);
    setLoadingMessages(true);
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

      return setUserData(data);
    }

    handleSetLocalUserData();
  }, []);

  useEffect(() => {
    async function handleGetMessages() {
      console.log('MONTADO PELA PRIMEIRA VEZ');

      const requestUrl = dataReceivedFromNavigation?.contactData
        ? `/privatemessages/${userData?.id}/${dataReceivedFromNavigation?.contactData?.id}`
        : '/roommessages';

      const requestOptions = {
        params: {
          nickname: dataReceivedFromNavigation?.roomData
            ? dataReceivedFromNavigation?.roomData?.nickname
            : undefined,
          page,
          limit: 10,
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

        // Pagination
        // const {currentpage, lastpage, totalpage} = allMessages.headers;

        const response = handleSerializedMessages(allMessages.data);

        setMessages(response);

        return setLoadingMessages(false);
      } catch (err) {
        const {error} = err.response.data;

        return Toast.error(error);
      }
    }

    handleGetMessages();
  }, [userData, dataReceivedFromNavigation, page]);

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
          <ChatInfo onPress={handleShowModal}>
            <ChatName>
              {dataReceivedFromNavigation?.contactData
                ? dataReceivedFromNavigation?.contactData?.username
                : dataReceivedFromNavigation?.roomData?.name}
            </ChatName>
            <ChatStatus>Online</ChatStatus>
          </ChatInfo>
          <ChatAction onPress={handleToggleChatActions}>
            <SimpleLinIcons name="options-vertical" color="#fff" size={20} />
          </ChatAction>
        </Header>

        {showChatActions && (
          <MessageOptions style={shadowContainer.shadowBox}>
            <ClearMessages>
              <MaterialIcons name="clear" color="#7159c1" size={20} />
              <ActionLabel>Limpar mensagens</ActionLabel>
            </ClearMessages>
            <DeleteChat>
              <AntDesign name="deleteuser" color="#7159c1" size={20} />
              <ActionLabel>Deletar conversa</ActionLabel>
            </DeleteChat>
            {dataReceivedFromNavigation.roomData && (
              <UpdateRoom onPress={handleOpenModal}>
                <Feather name="edit" color="#7159c1" size={20} />
                <ActionLabel>Editar grupo</ActionLabel>
              </UpdateRoom>
            )}
          </MessageOptions>
        )}

        <FlatList
          keyExtractor={(item, index) => String(index)}
          data={messages}
          ref={flatListRef}
          onContentSizeChange={() =>
            flatListRef?.current?.scrollToEnd({
              animated: true,
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

        {toggleModal && (
          <ShowModalRoom
            toggleModal={toggleModal}
            setToggleModal={setToggleModal}
            whichModal="update"
            roomData={dataReceivedFromNavigation?.roomData}
          />
        )}
      </Container>
    </Wrapper>
  );
};

export default Messages;
