import React, {useState, useEffect, useContext} from 'react';
import {useNavigation} from '@react-navigation/native';

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
  ListContacts,
  ContactContainer,
  ContactImage,
  ContactInfo,
  ContactInfoUser,
  ContactNotificationMessage,
  ContactName,
  ContactLastMessage,
  ContactMessageDate,
  ContactTotalMessages,
} from './styles';

export interface ILatestMessageOfContact {
  id: number;
  username: string;
  email: string;
  photo: string;
  status: string;
  message: string;
  image?: string;
  created_at: string;
}

const Chat: React.FC = () => {
  // Contex
  const {userData} = useContext(AuthContex);

  // States
  const [noMessage, setNoMessage] = useState<boolean>(false);
  const [latestMessageOfContact, setLatestMessageOfContact] = useState<
    ILatestMessageOfContact[]
  >([]);

  // Navigation
  const navigation = useNavigation();

  function handleNavigateToMessages(contactData: ILatestMessageOfContact) {
    return navigation.navigate('Messages', {
      contactData,
    });
  }

  function handleSerializedLatestMessage(
    latestMessageData: ILatestMessageOfContact[],
  ) {
    const serialized = latestMessageData.map((item) => ({
      id: item?.id,
      username: item?.username,
      email: item?.email,
      photo: item?.photo,
      status: item?.status,
      image: item?.image,
      message:
        item.message.length < 28
          ? item?.message
          : item?.message.substr(0, 28) + '...',
      created_at: messageDateFormatter(item?.created_at),
    }));

    return serialized;
  }

  useEffect(() => {
    async function handleGetLatestMessage() {
      try {
        const message = await api.get<ILatestMessageOfContact[]>(
          `/latestmessageofcontact/${userData?.id}`,
        );

        if (!message) {
          return Toast.error('Erro ao listar preview.');
        }

        if (message?.data?.length === 0) {
          return setNoMessage(true);
        }

        const response = handleSerializedLatestMessage(message?.data);

        return setLatestMessageOfContact(response);
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

    socket.on('updateLatestPrivateMessage', handleUpdateLatestMessage);

    return () => {
      socket.off('updateLatestPrivateMessage', handleUpdateLatestMessage);
    };
  }, [userData]);

  return (
    <Wrapper>
      {noMessage ? (
        <NoMessage>
          <NoMessageBackground source={noData} />
          <NoMessageLabel>Ops nenhuma conversa encontrada!</NoMessageLabel>
        </NoMessage>
      ) : (
        <Container>
          <Title>Mensagens</Title>
          <ListContacts>
            {latestMessageOfContact.map((item: ILatestMessageOfContact) => (
              <ContactContainer
                key={Number(item?.id)}
                onPress={() => handleNavigateToMessages(item)}>
                <ContactImage source={{uri: String(item?.photo)}} />
                <ContactInfo>
                  <ContactInfoUser>
                    <ContactName>{item?.username}</ContactName>
                    <ContactLastMessage>{item?.message}</ContactLastMessage>
                  </ContactInfoUser>

                  <ContactNotificationMessage>
                    <ContactMessageDate>{item?.created_at}</ContactMessageDate>
                    <ContactTotalMessages totalMessage={0}>
                      {0}
                    </ContactTotalMessages>
                  </ContactNotificationMessage>
                </ContactInfo>
              </ContactContainer>
            ))}
          </ListContacts>
        </Container>
      )}
    </Wrapper>
  );
};

export default Chat;
