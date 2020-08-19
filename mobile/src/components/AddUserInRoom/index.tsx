import React, {
  useState,
  useEffect,
  useCallback,
  Dispatch,
  SetStateAction,
} from 'react';
import {Animated, Easing} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import api from '../../services/api';

import Toast from '../../config/toastStyles';

import {
  Wrapper,
  ScrollView,
  Container,
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
} from './styles';

interface IAddUserInRoomProps {
  toggleModal: boolean;
  setToggleModal: Dispatch<SetStateAction<boolean>>;
  usersInRoom: number[];
}

interface IFrequentContact {
  id: number;
  username: string;
  photo: string;
  status: string;
}

const AddUserInRoom: React.FC<IAddUserInRoomProps> = ({
  toggleModal,
  setToggleModal,
  usersInRoom,
}) => {
  // States
  const [userId, setUserId] = useState<number>();
  const [contacts, setContacts] = useState<IFrequentContact[]>([]);
  const [modalAnimation] = useState(new Animated.Value(0));

  async function handleSubmit() {}

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
      return setToggleModal(false);
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
        const frequentContact = await api.get<IFrequentContact[]>(
          `listfrequentcontactsforaddroom/${userId}`,
        );

        if (!frequentContact) {
          return Toast.error('Erro ao listar contatos.');
        }

        return setContacts(frequentContact.data);
      } catch (err) {
        const {error} = err.response.data;

        return Toast.error(error);
      }
    }

    handleGetFrequentContacts();
  }, [userId]);

  useEffect(() => {
    async function handleGetMyUserId() {
      try {
        const userData = await AsyncStorage.getItem('@rocketMessages/userData');

        const {id} = JSON.parse(String(userData));

        setUserId(Number(id));
      } catch (err) {
        return Toast.error('Erro ao obter dados locais.');
      }
    }

    handleGetMyUserId();
  }, []);

  useEffect(() => {
    if (toggleModal) {
      memoizedCallback();
    }
  }, [toggleModal, memoizedCallback]);

  return toggleModal ? (
    <Wrapper style={{opacity: modalAnimation}}>
      <ScrollView>
        <Container>
          <ScreenBackContainer onPress={handleScreenBack}>
            <ScreenBackIcon />
          </ScreenBackContainer>

          <Title>Adicionar usuário ao grupo</Title>

          {contacts?.map((item: IFrequentContact) => (
            <ContactContainer key={Number(item?.id)}>
              <ContactPhoto source={{uri: String(item?.photo)}} />
              <ContactInfo>
                <ContactInfoUser>
                  <ContactName>{item?.username}</ContactName>
                  <ContactStatus>
                    {handleLimitStatusCharacters(item?.status)}
                  </ContactStatus>
                </ContactInfoUser>

                <ContactAction>
                  <ContactActionIcon />
                </ContactAction>
              </ContactInfo>
            </ContactContainer>
          ))}
        </Container>
      </ScrollView>
    </Wrapper>
  ) : null;
};

export default AddUserInRoom;
