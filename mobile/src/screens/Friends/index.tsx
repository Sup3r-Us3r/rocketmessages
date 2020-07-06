import React, {useState} from 'react';
import Feather from 'react-native-vector-icons/Feather';

import image from '../../assets/photo.jpg';

import {
  Wrapper,
  Container,
  Header,
  SearchInput,
  SearchIcon,
  ContactsFound,
  ContactInfo,
  ContactContainer,
  ContactImage,
  ContactLabels,
  ContactName,
  ContactLogin,
  ContactAction,
  ContactActionLabel,
} from './styles';

const contacts = [
  {
    key: 1,
    name: 'Sup3r Us3r',
    login: 'sup3r.us3r',
    image,
  },
  {
    key: 2,
    name: 'Sup3r Us3r',
    login: 'sup3r.us3r',
    image,
  },
  {
    key: 3,
    name: 'Sup3r Us3r',
    login: 'sup3r.us3r',
    image,
  },
  {
    key: 4,
    name: 'Sup3r Us3r',
    login: 'sup3r.us3r',
    image,
  },
  {
    key: 5,
    name: 'Sup3r Us3r',
    login: 'sup3r.us3r',
    image,
  },
  {
    key: 6,
    name: 'Sup3r Us3r',
    login: 'sup3r.us3r',
    image,
  },
  {
    key: 7,
    name: 'Sup3r Us3r',
    login: 'sup3r.us3r',
    image,
  },
  {
    key: 8,
    name: 'Sup3r Us3r',
    login: 'sup3r.us3r',
    image,
  },
  {
    key: 9,
    name: 'Sup3r Us3r',
    login: 'sup3r.us3r',
    image,
  },
  {
    key: 10,
    name: 'Sup3r Us3r',
    login: 'sup3r.us3r',
    image,
  },
  {
    key: 11,
    name: 'Sup3r Us3r',
    login: 'sup3r.us3r',
    image,
  },
  {
    key: 12,
    name: 'Sup3r Us3r',
    login: 'sup3r.us3r',
    image,
  },
  {
    key: 13,
    name: 'Sup3r Us3r',
    login: 'sup3r.us3r',
    image,
  },
];

const Friends = () => {
  // States
  const [searchText, setSearchText] = useState<string>('');

  return (
    <Wrapper>
      <Container>
        <Header>
          <SearchInput
            placeholder="Pesquisar..."
            autoCorrect={false}
            onChangeText={setSearchText}
          />
          <SearchIcon>
            <Feather name="search" color="#7159c1" size={20} />
          </SearchIcon>
        </Header>

        <ContactsFound>
          {contacts.map((contact) => (
            <ContactInfo key={contact.key}>
              <ContactContainer>
                <ContactImage source={image} />
                <ContactLabels>
                  <ContactName>{contact.name}</ContactName>
                  <ContactLogin>{contact.login}</ContactLogin>
                </ContactLabels>
              </ContactContainer>
              <ContactAction>
                <ContactActionLabel>Adicionar</ContactActionLabel>
              </ContactAction>
            </ContactInfo>
          ))}
        </ContactsFound>
      </Container>
    </Wrapper>
  );
};

export default Friends;
