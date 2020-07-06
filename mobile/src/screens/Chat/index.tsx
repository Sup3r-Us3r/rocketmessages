import React from 'react';
import {useNavigation} from '@react-navigation/native';

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

const Chat = () => {
  // Navigation
  const navigation = useNavigation();

  function handleNavigateToMessages(contactData: IContacts) {
    return navigation.navigate('Messages', contactData);
  }

  return (
    <Wrapper>
      <Container>
        <Title>Rocket Messages</Title>
        <ListContacts>
          {contacts.map((item) => (
            <ContactContainer
              key={item.key}
              onPress={() => handleNavigateToMessages(item)}>
              <ContactImage source={photo} />
              <ContactInfo>
                <ContactInfoUser>
                  <ContactName>{item.name}</ContactName>
                  <ContactLastMessage>{item.lastMessage}</ContactLastMessage>
                </ContactInfoUser>

                <ContactNotificationMessage>
                  <ContactTotalMessages totalMessage={item.totalMessage}>
                    {item.totalMessage}
                  </ContactTotalMessages>
                  <ContactMessageDate>{item.messageDate}</ContactMessageDate>
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
