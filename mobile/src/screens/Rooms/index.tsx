import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useContext,
} from 'react';
import {Dimensions} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';

import CreateOrEditRoom, {
  ICreateOrEditRoomHandles,
} from '../../components/CreateOrEditRoom';

import {messageDateFormatter} from '../../utils/messageDateFormatter';

import AuthContex from '../../contexts/auth';

import socket from '../../services/websocket';
import api from '../../services/api';

import Toast from '../../config/toastStyles';

import noData from '../../assets/noData.png';

import {
  Wrapper,
  NoMessage,
  NoMessageBackground,
  NoMessageLabel,
  Container,
  Title,
  ListRooms,
  RoomContainer,
  RoomImage,
  RoomInfoData,
  RoomInfo,
  RoomNotificationMessage,
  RoomName,
  RoomLastMessage,
  RoomMessageDate,
  RoomTotalMessages,
  ContainerCreateRoom,
} from './styles';

export interface ILatestMessageOfRoom {
  id: number;
  name: string;
  nickname: string;
  avatar: string;
  message: string;
  created_at: string;
}

const Rooms: React.FC = () => {
  // Navigation
  const navigation = useNavigation();

  // Contex
  const {userData} = useContext(AuthContex);

  // Ref
  const createOrEditRoomRef = useRef<ICreateOrEditRoomHandles>(null);

  // State
  const [noMessage, setNoMessage] = useState<boolean>(false);
  const [latestMessageOfRoom, setLatestMessageOfRoom] = useState<
    ILatestMessageOfRoom[]
  >([]);

  const handleCreateRoom = useCallback(() => {
    return createOrEditRoomRef.current?.openModal();
  }, []);

  function handleNavigateToMessages(roomData: ILatestMessageOfRoom) {
    return navigation.navigate('Messages', {
      roomData,
    });
  }

  function handleScreenOrientation() {
    const orientation = Dimensions.get('screen');

    return orientation.height >= orientation.width ? 'portrait' : 'landscape';
  }

  const handleSerializedLatestMessage = useCallback(
    (latestMessageData: ILatestMessageOfRoom[]) => {
      function handlePreviewMessage(message: string) {
        if (handleScreenOrientation() === 'portrait') {
          return message?.length < 25
            ? message
            : message?.substr(0, 25) + '...';
        } else {
          return message?.length < 70
            ? message
            : message?.substr(0, 70) + '...';
        }
      }

      const serialized = latestMessageData.map((item) => ({
        id: item?.id,
        name: item?.name,
        nickname: item?.nickname,
        avatar: item?.avatar,
        message: handlePreviewMessage(item?.message),
        created_at: messageDateFormatter(item?.created_at),
      }));

      return serialized;
    },
    [],
  );

  useEffect(() => {
    async function handleGetLatestMessage() {
      try {
        const message = await api.get<ILatestMessageOfRoom[]>(
          `/latestmessageofroom/${userData?.id}`,
        );

        if (!message) {
          return Toast.error('Erro ao listar preview.');
        }

        if (message?.data?.length === 0) {
          return setNoMessage(true);
        }

        const response = handleSerializedLatestMessage(message?.data);

        return setLatestMessageOfRoom(response);
      } catch (err) {
        const {error} = err.response.data;

        return Toast.error(error);
      }
    }

    handleGetLatestMessage();

    function handleUpdateLatestMessage(response: boolean) {
      if (response) {
        handleGetLatestMessage();
      }
    }

    socket.on('updateLatestRoomMessage', handleUpdateLatestMessage);

    return () => {
      socket.off('updateLatestRoomMessage', handleUpdateLatestMessage);
    };
  }, [userData, handleSerializedLatestMessage]);

  return (
    <Wrapper>
      {noMessage ? (
        <NoMessage>
          <NoMessageBackground source={noData} />
          <NoMessageLabel>Ops nenhuma conversa encontrada!</NoMessageLabel>
        </NoMessage>
      ) : (
        <Container>
          <Title>Grupos</Title>
          <ListRooms>
            {latestMessageOfRoom.map((item: ILatestMessageOfRoom) => (
              <RoomContainer
                key={Number(item?.id)}
                onPress={() => handleNavigateToMessages(item)}>
                <RoomImage source={{uri: String(item?.avatar)}} />
                <RoomInfoData>
                  <RoomInfo>
                    <RoomName>{item?.name}</RoomName>
                    <RoomLastMessage>{item?.message}</RoomLastMessage>
                  </RoomInfo>

                  <RoomNotificationMessage>
                    <RoomMessageDate>{item?.created_at}</RoomMessageDate>
                    <RoomTotalMessages totalMessage={0}>{0}</RoomTotalMessages>
                  </RoomNotificationMessage>
                </RoomInfoData>
              </RoomContainer>
            ))}
          </ListRooms>
        </Container>
      )}

      <ContainerCreateRoom onPress={handleCreateRoom}>
        <AntDesign name="addusergroup" color="#fff" size={27} />
      </ContainerCreateRoom>

      <CreateOrEditRoom ref={createOrEditRoomRef} whichModal="create" />
    </Wrapper>
  );
};

export default Rooms;
