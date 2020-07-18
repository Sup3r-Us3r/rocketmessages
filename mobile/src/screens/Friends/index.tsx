import React, {useState, useEffect} from 'react';
import {Keyboard} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import {useNavigation} from '@react-navigation/native';

import api from '../../services/api';

import Toast from '../../config/toastStyles';

import searchContact from '../../assets/searchContact.png';
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
  NoResearch,
  NoResearchBackground,
  NoResearchLabel,
} from './styles';

interface IContactData {
  id: number;
  username: string;
  email: string;
  photo: string;
  status?: string;
  message: string;
  image?: string;
  created_at: string;
}

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
  const [typing, setTyping] = useState<boolean>(false);
  const [searchInput, setSearchInput] = useState<string>('');
  const [searchResult, setSearchResult] = useState<IContactData[]>([]);

  // Navigation
  const navigation = useNavigation();

  async function handleSearchContact() {
    try {
      const response = await api.get<IContactData[]>('/users', {
        params: {
          search: searchInput,
        }
      });

      if (!response) {
        return Toast.error('Erro ao pesquisar usuários.');
      }

      console.log('RESPONSE: ', response.data);

      setSearchResult(response.data);

      return setSearchInput('');
    } catch(err) {
      const {error} = err.response.data;

      return Toast.error(error);
    }
  }

  useEffect(() => {
    function handleKeyboardDidShow() {
      setTyping(true);
    }

    function handleKeyboardDidHide() {
      setTyping(false);
    }

    Keyboard.addListener('keyboardDidShow', handleKeyboardDidShow);
    Keyboard.addListener('keyboardDidHide', handleKeyboardDidHide);

    return () => {
      Keyboard.removeListener('keyboardDidShow', handleKeyboardDidShow);
      Keyboard.removeListener('keyboardDidHide', handleKeyboardDidHide);
    }
  }, []);

  return (
    <Wrapper>
      <Container>
        <Header>
          <SearchInput
            placeholder="Pesquisar..."
            autoCorrect={false}
            onChangeText={setSearchInput}
            onBlur={Keyboard.dismiss}
            value={searchInput}
          />
          <SearchIcon onPress={handleSearchContact}>
            <Feather name="search" color="#7159c1" size={20} />
          </SearchIcon>
        </Header>

        {typing ? (
          <ContactsFound>
            {searchResult?.map((contact) => (
              <ContactInfo key={Number(contact.id)}>
                <ContactContainer>
                  <ContactImage source={{ uri: contact.photo }} />
                  <ContactLabels>
                    <ContactName>{contact.username}</ContactName>
                    <ContactLogin>{contact.email}</ContactLogin>
                  </ContactLabels>
                </ContactContainer>
                <ContactAction>
                  <ContactActionLabel>Conversar</ContactActionLabel>
                </ContactAction>
              </ContactInfo>
            ))}
          </ContactsFound>
        ) : (
          <NoResearch>
            <NoResearchBackground source={searchContact} />
            <NoResearchLabel>
              Encontre seus contatos e comece o bate-papo
            </NoResearchLabel>
          </NoResearch>
        )}
      </Container>
    </Wrapper>
  );
};

export default Friends;
