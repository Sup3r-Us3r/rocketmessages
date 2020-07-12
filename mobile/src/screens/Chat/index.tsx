import React, {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import {useNavigation} from '@react-navigation/native';

import api from '../../services/api';

import photo from '../../assets/photo.jpg';

import {
  Wrapper,
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

interface IContacts {
  key: number;
  image: string;
  name: string;
  lastMessage: string;
  totalMessage: number;
  messageDate: string;
}

interface IPrivateMessages {
  id: number;
  username: string;
  login: string;
  photo: string;
  status?: string;
  message: string;
  image?: string;
  created_at: Date;
}

const Chat = () => {
  // States
  const [privateMessages, setPrivateMessages] = useState<IPrivateMessages[]>(
    [],
  );

  // Navigation
  const navigation = useNavigation();

  function handleNavigateToMessages(privateMessageData: IPrivateMessages[]) {
    return navigation.navigate('Messages', privateMessageData);
  }

  function handleSerializedPrivateMessage(messageData: IPrivateMessages[]) {
    const distinctData = messageData.filter(
      (item, index, array) =>
        array.map((obj) => obj.id).indexOf(item.id) === index,
    );

    return distinctData.map((item) => ({
      id: item.id,
      username: item.username,
      login: item.login,
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
  }

  useEffect(() => {
    async function handleGetPrivateMessages() {
      // const getMyData = await AsyncStorage.getItem('@rocketMessages/userData');

      // const [myId] = JSON.parse(String(getMyData));

      // const messages = await api.get(`/privatemessages/${myId}`);
      const messages = await api.get('/privatemessages/1');
      const response = handleSerializedPrivateMessage(messages.data);

      setPrivateMessages(response);
    }

    handleGetPrivateMessages();
  }, []);

  return (
    <Wrapper>
      <Container>
        <Title>Rocket Messages</Title>
        <ListContacts>
          {privateMessages.map((item) => (
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
    </Wrapper>
  );
};

export default Chat;
