import React, {
  useState,
  useEffect,
  useCallback,
  useContext,
  forwardRef,
  useImperativeHandle,
} from 'react';
import {Animated, Easing} from 'react-native';

import AuthContext from '../../contexts/auth';

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

export interface IAddUserInRoomHandles {
  openModal: () => void;
}

interface IAddUserInRoomProps {
  roomId: number;
  nickname: string;
}

interface IFrequentContacts {
  id: number;
  username: string;
  photo: string;
  status: string;
}

const AddUserInRoom: React.RefForwardingComponent<
  IAddUserInRoomHandles,
  IAddUserInRoomProps
> = ({roomId, nickname}, ref) => {
  // Context
  const {userData} = useContext(AuthContext);

  // States
  const [visible, setVisible] = useState<boolean>(false);
  const [contacts, setContacts] = useState<IFrequentContacts[]>([]);
  const [modalAnimation] = useState(new Animated.Value(0));

  const openModal = useCallback(() => {
    return setVisible(true);
  }, []);

  // ImperativeHandle
  useImperativeHandle(ref, () => {
    return {
      openModal,
    };
  });

  async function handleSubmit(userId: number) {
    const userAdded = contacts.find(
      (user: IFrequentContacts) => user.id === userId,
    )?.username;

    const userDataInput = {
      user_id: userId,
      nickname,
      user_admin: false,
    };

    try {
      const insertUser = await api.post('/insertuserinroom', userDataInput);

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

      return socket.emit('joinRoomChat', nickname);
    } catch (err) {
      const {error} = err.response.data;

      return Toast.error(error);
    }
  }

  function handleModalAnimationFadeOut() {
    return Animated.timing(modalAnimation, {
      toValue: 0,
      duration: 100,
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
      return setVisible(false);
    }, 100);
  }

  // Callback
  const animationFadeIn = useCallback(() => {
    function handleModalAnimationFadeIn() {
      return Animated.timing(modalAnimation, {
        toValue: 1,
        duration: 100,
        easing: Easing.ease,
        useNativeDriver: true,
      }).start();
    }

    handleModalAnimationFadeIn();
  }, [modalAnimation]);

  useEffect(() => {
    async function handleGetFrequentContacts() {
      try {
        const frequentContact = await api.get<IFrequentContacts[]>(
          `listfrequentcontactsforaddroom/${userData?.id}`,
        );

        if (!frequentContact) {
          return Toast.error('Erro ao listar contatos.');
        }

        const usersInRoom = await api.get<IFrequentContacts[]>('/usersinroom', {
          params: {
            nickname,
            user_id: userData?.id,
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

    socket.on('listUsersToAddRefresh', handleUpdateUsersInRoom);

    return () => {
      socket.off('listUsersToAddRefresh', handleUpdateUsersInRoom);
    };
  }, [userData, nickname]);

  useEffect(() => {
    if (visible) {
      animationFadeIn();
    }
  }, [visible, animationFadeIn]);

  return visible ? (
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

export default forwardRef(AddUserInRoom);
