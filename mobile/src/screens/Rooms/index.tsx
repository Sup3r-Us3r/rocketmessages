import React, {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import {useNavigation} from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';

// import CreateRoom from '../../components/CreateRoom';
import ShowModalRoom from '../../components/ShowModalRoom';

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

interface ILatestMessageOfRoom {
  id: number;
  username: string;
  email: string;
  photo: string;
  status?: string;
  message: string;
  image?: string;
  created_at: string;
}

const Rooms = () => {
  // States
  const [noMessage, setNoMessage] = useState<boolean>(false);
  const [latestMessageOfRoom, setLatestMessageOfRoom] = useState<
    ILatestMessageOfRoom[]
  >([]);
  const [toggleModal, setToggleModal] = useState<boolean>(false);

  // Navigation
  const navigation = useNavigation();

  function handleOpenModal() {
    return setToggleModal(true);
  }

  function handleNavigateToMessages(roomData: ILatestMessageOfRoom) {
    return navigation.navigate('Messages', roomData);
  }

  function handleSerializedLatestMessage(
    latestMessageData: ILatestMessageOfRoom[],
  ) {
    const serialized = latestMessageData.map((item) => ({
      id: item.id,
      username: item.username,
      email: item.email,
      photo: item.photo,
      status: item.status,
      image: item.image,
      message:
        item.message.length < 28
          ? item.message
          : item.message.substr(0, 28) + '...',
      created_at: `${new Date(item.created_at).getHours()}:${new Date(
        item.created_at,
      ).getMinutes()}`,
    }));

    return serialized;
  }

  useEffect(() => {
    async function handleGetLatestMessage() {
      try {
        const getMyData = await AsyncStorage.getItem(
          '@rocketMessages/userData',
        );

        const data = JSON.parse(String(getMyData));

        const message = await api.get<ILatestMessageOfRoom[]>(
          `/latestmessageofcontact/${data?.id}`,
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
  }, []);

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
                <RoomImage source={{uri: String(item?.photo)}} />
                <RoomInfoData>
                  <RoomInfo>
                    <RoomName>{item?.username}</RoomName>
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

      <ContainerCreateRoom onPress={handleOpenModal}>
        <AntDesign name="addusergroup" color="#fff" size={27} />
      </ContainerCreateRoom>

      {toggleModal && (
        <ShowModalRoom
          toggleModal={toggleModal}
          setToggleModal={setToggleModal}
        />
      )}
    </Wrapper>
  );
};

export default Rooms;
