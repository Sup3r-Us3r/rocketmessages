import React, {
  useState,
  useEffect,
  useCallback,
  Dispatch,
  SetStateAction,
} from 'react';
import {Animated, Easing} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import socket from '../../services/websocket';
import api from '../../services/api';

import Toast from '../../config/toastStyles';

import addPeopleImg from '../../assets/addPeople.png';

import {
  Wrapper,
  ScrollView,
  Container,
  HeaderContainer,
  ScreenBackContainer,
  ScreenBackIcon,
  Title,
  ContactContainer,
  ContactPhoto,
  ContactInfo,
  ContactInfoUser,
  ContactName,
  ContactStatus,
  ContactAction,
  ContactActionIcon,
  NoFrequentContactContainer,
  NoFrequentContact,
  NoFrequentContactLabel,
} from './styles';

interface IAddUserInRoomProps {
  toggleModalAddUserInRoom: boolean;
  setToggleModalAddUserInRoom: Dispatch<SetStateAction<boolean>>;
  roomId: number;
  nickname: string;
}

interface IFrequentContacts {
  id: number;
  username: string;
  photo: string;
  status: string;
}

const AddUserInRoom: React.FC<IAddUserInRoomProps> = ({
  toggleModalAddUserInRoom,
  setToggleModalAddUserInRoom,
  roomId,
  nickname,
}) => {
  // States
  const [contacts, setContacts] = useState<IFrequentContacts[]>([]);
  const [modalAnimation] = useState(new Animated.Value(0));

  async function handleSubmit(userId: number) {
    const userAdded = contacts.find(
      (user: IFrequentContacts) => user.id === userId,
    )?.username;

    const userData = {
      user_id: userId,
      nickname,
      user_admin: false,
    };

    try {
      const insertUser = await api.post('/insertuserinroom', userData);

      if (!insertUser) {
        return Toast.error('Erro ao adicionar usuário.');
      }

      const sendMessageNewUser = await api.post('/message', {
        bot: true,
        from: userId,
        to_room: roomId,
        to_user: null,
        message: `${userAdded} foi adicionado ao grupo.`,
      });

      if (!sendMessageNewUser) {
        return Toast.error('Erro ao enviar mensagem de novo usuário.');
      }

      Toast.success(`${userAdded} adicionado ao grupo.`);

      // Emit for websocket backend - Join user in room
      return socket.emit('joinRoomChat', nickname);
    } catch (err) {
      const {error} = err.response.data;

      return Toast.error(error);
    }
  }

  function handleModalAnimationFadeOut() {
    return Animated.timing(modalAnimation, {
      toValue: 0,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  }

  function handleLimitStatusCharacters(text: string) {
    return text.length >= 35 ? text.substr(0, 35) + '...' : text;
  }

  function handleScreenBack() {
    handleModalAnimationFadeOut();

    setTimeout(() => {
      return setToggleModalAddUserInRoom(false);
    }, 300);
  }

  // Callback
  const memoizedCallback = useCallback(() => {
    function handleModalAnimationFadeIn() {
      return Animated.timing(modalAnimation, {
        toValue: 1,
        duration: 300,
        easing: Easing.ease,
        useNativeDriver: true,
      }).start();
    }

    handleModalAnimationFadeIn();
  }, [modalAnimation]);

  useEffect(() => {
    async function handleGetFrequentContacts() {
      try {
        const userData = await AsyncStorage.getItem('@rocketMessages/userData');

        const {id} = JSON.parse(String(userData));

        const frequentContact = await api.get<IFrequentContacts[]>(
          `listfrequentcontactsforaddroom/${id}`,
        );

        if (!frequentContact) {
          return Toast.error('Erro ao listar contatos.');
        }

        const usersInRoom = await api.get<IFrequentContacts[]>('/usersinroom', {
          params: {
            nickname,
            user_id: id,
          },
        });

        if (!usersInRoom) {
          return Toast.error('Erro ao listar usuários no grupo.');
        }

        // Frequent contact except user already in room
        const frequentContactFiltered = frequentContact.data.filter(
          (user: IFrequentContacts) =>
            !usersInRoom.data.map((item) => item.id).includes(user.id),
        );

        return setContacts(frequentContactFiltered);
      } catch (err) {
        const {error} = err.response.data;

        return Toast.error(error);
      }
    }

    handleGetFrequentContacts();

    // Listen update users in room
    function handleUpdateUsersInRoom(roomNickname: string) {
      if (roomNickname === nickname) {
        handleGetFrequentContacts();
      }
    }

    socket.on('updateUsersInRoom', handleUpdateUsersInRoom);

    return () => {
      socket.off('updateUsersInRoom', handleUpdateUsersInRoom);
    };
  }, [nickname]);

  useEffect(() => {
    if (toggleModalAddUserInRoom) {
      memoizedCallback();
    }
  }, [toggleModalAddUserInRoom, memoizedCallback]);

  return toggleModalAddUserInRoom ? (
    <Wrapper style={{opacity: modalAnimation}}>
      <ScrollView>
        <Container>
          <HeaderContainer>
            <ScreenBackContainer onPress={handleScreenBack}>
              <ScreenBackIcon />
            </ScreenBackContainer>
            <Title>Adicionar no grupo</Title>
          </HeaderContainer>

          {contacts.length !== 0 ? (
            contacts?.map((user: IFrequentContacts) => (
              <ContactContainer key={Number(user?.id)}>
                <ContactPhoto source={{uri: String(user?.photo)}} />
                <ContactInfo>
                  <ContactInfoUser>
                    <ContactName>{user?.username}</ContactName>
                    <ContactStatus>
                      {handleLimitStatusCharacters(user?.status)}
                    </ContactStatus>
                  </ContactInfoUser>

                  <ContactAction onPress={() => handleSubmit(Number(user?.id))}>
                    <ContactActionIcon />
                  </ContactAction>
                </ContactInfo>
              </ContactContainer>
            ))
          ) : (
            <NoFrequentContactContainer>
              <NoFrequentContact source={addPeopleImg} />
              <NoFrequentContactLabel>
                Nenhum contato frequente localizado
              </NoFrequentContactLabel>
            </NoFrequentContactContainer>
          )}
        </Container>
      </ScrollView>
    </Wrapper>
  ) : null;
};

export default AddUserInRoom;
