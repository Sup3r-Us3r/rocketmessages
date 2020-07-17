import React, {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import {useNavigation} from '@react-navigation/native';

import Toast from '../../config/toastStyles';

import api from '../../services/api';

import noData from '../../assets/noData.png';
// import photo from '../../assets/photo.jpg';

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

const date = new Date();
const contacts = [
  {
    key: 1,
    image: '',
    name: 'Sup3r Us3r',
    lastMessage: 'Lorem ipsum dolor sit amet',
    totalMessage: 1,
    messageDate: `${date.getHours()}:${date.getMinutes()}`,
  },
  {
    key: 2,
    image: '',
    name: 'Sup3r Us3r',
    lastMessage: 'Lorem ipsum dolor sit amet',
    totalMessage: 210,
    messageDate: `${date.getHours()}:${date.getMinutes()}`,
  },
  {
    key: 3,
    image: '',
    name: 'Sup3r Us3r',
    lastMessage: 'Lorem ipsum dolor sit amet',
    totalMessage: 2100,
    messageDate: `${date.getHours()}:${date.getMinutes()}`,
  },
  {
    key: 4,
    image: '',
    name: 'Sup3r Us3r',
    lastMessage: 'Lorem ipsum dolor sit amet',
    totalMessage: 21000,
    messageDate: `${date.getHours()}:${date.getMinutes()}`,
  },
  {
    key: 5,
    image: '',
    name: 'Sup3r Us3r',
    lastMessage: 'Lorem ipsum dolor sit amet',
    totalMessage: 223121,
    messageDate: `${date.getHours()}:${date.getMinutes()}`,
  },
  {
    key: 6,
    image: '',
    name: 'Sup3r Us3r',
    lastMessage: 'Lorem ipsum dolor sit amet',
    totalMessage: 21,
    messageDate: `${date.getHours()}:${date.getMinutes()}`,
  },
  {
    key: 7,
    image: '',
    name: 'Sup3r Us3r',
    lastMessage: 'Lorem ipsum dolor sit amet',
    totalMessage: 21,
    messageDate: `${date.getHours()}:${date.getMinutes()}`,
  },
  {
    key: 8,
    image: '',
    name: 'Sup3r Us3r',
    lastMessage: 'Lorem ipsum dolor sit amet',
    totalMessage: 21,
    messageDate: `${date.getHours()}:${date.getMinutes()}`,
  },
  {
    key: 9,
    image: '',
    name: 'Sup3r Us3r',
    lastMessage: 'Lorem ipsum dolor sit amet',
    totalMessage: 21,
    messageDate: `${date.getHours()}:${date.getMinutes()}`,
  },
  {
    key: 10,
    image: '',
    name: 'Sup3r Us3r',
    lastMessage: 'Lorem ipsum dolor sit amet',
    totalMessage: 21,
    messageDate: `${date.getHours()}:${date.getMinutes()}`,
  },
  {
    key: 11,
    image: '',
    name: 'Sup3r Us3r',
    lastMessage: 'Lorem ipsum dolor sit amet',
    totalMessage: 21,
    messageDate: `${date.getHours()}:${date.getMinutes()}`,
  },
  {
    key: 12,
    image: '',
    name: 'Sup3r Us3r',
    lastMessage: 'Lorem ipsum dolor sit amet',
    totalMessage: 21,
    messageDate: `${date.getHours()}:${date.getMinutes()}`,
  },
  {
    key: 13,
    image: '',
    name: 'Sup3r Us3r',
    lastMessage: 'Lorem ipsum dolor sit amet',
    totalMessage: 21,
    messageDate: `${date.getHours()}:${date.getMinutes()}`,
  },
];

interface ILatestMessageOfContact {
  id: number;
  username: string;
  email: string;
  photo: string;
  status?: string;
  message: string;
  image?: string;
  created_at: string;
}

const Chat = () => {
  // States
  const [noMessage, setNoMessage] = useState<boolean>(false);
  const [
    latestMessageOfContact, setLatestMessageOfContact
  ] = useState<ILatestMessageOfContact[]>(
    [],
  );

  // Navigation
  const navigation = useNavigation();

  function handleNavigateToMessages(
    latestMessageOfContactData: ILatestMessageOfContact
  ) {
    return navigation.navigate('Messages', latestMessageOfContactData);
  }

  function handleSerializedLatestMessage(
    latestMessageData: ILatestMessageOfContact[]
  ) {
    const distinctData = latestMessageData.filter(
      (item, index, array) =>
        array.map((obj) => obj.id).indexOf(item.id) === index,
    );

    const serialized = distinctData.map((item) => ({
      id: item.id,
      username: item.username,
      email: item.email,
      photo: item.photo,
      status: item.status,
      image: item.image,
      message:
        item.message.length < 33
          ? item.message
          : item.message.substr(0, 33) + '...',
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

        const {data} = JSON.parse(String(getMyData));

        const message = await api.get<ILatestMessageOfContact[]>(
          `/latestmessageofcontact/${data.id}`,
        );

        if (!message) {
          return Toast.error('Erro ao listar preview.');
        }

        if (message.data.length === 0) {
          return setNoMessage(true);
        }

        const response = handleSerializedLatestMessage(message.data);

        return setLatestMessageOfContact(response);
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
          <NoMessageLabel>Opps nenhuma conversa encontrada!</NoMessageLabel>
        </NoMessage>
      ) : (
        <Container>
          <Title>Rocket Messages</Title>
          <ListContacts>
            {latestMessageOfContact.map((item: ILatestMessageOfContact) => (
              <ContactContainer
                key={item.id}
                onPress={() => handleNavigateToMessages(item)}>
                <ContactImage source={{uri: String(item.photo)}} />
                <ContactInfo>
                  <ContactInfoUser>
                    <ContactName>{item.username}</ContactName>
                    <ContactLastMessage>{item.message}</ContactLastMessage>
                  </ContactInfoUser>

                  <ContactNotificationMessage>
                    <ContactTotalMessages totalMessage={0}>
                      {0}
                    </ContactTotalMessages>
                    <ContactMessageDate>{item.created_at}</ContactMessageDate>
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
