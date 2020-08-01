import React, {useState, useEffect} from 'react';
import {Keyboard} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useNavigation} from '@react-navigation/native';

import api from '../../services/api';

import Toast from '../../config/toastStyles';

import searchContact from '../../assets/searchContact.png';

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
        },
      });

      if (!response) {
        return Toast.error('Erro ao pesquisar usuários.');
      }

      setSearchResult(response.data);

      return setSearchInput('');
    } catch (err) {
      const {error} = err.response.data;

      return Toast.error(error);
    }
  }

  function handleNavigateToMessages(contactData: IContactData) {
    return navigation.navigate('Messages', contactData);
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
    };
  }, []);

  return (
    <Wrapper>
      <Container>
        <Header>
          <SearchInput
            placeholder="Pesquisar..."
            autoCorrect={false}
            onChangeText={setSearchInput}
            onSubmitEditing={handleSearchContact}
            onBlur={Keyboard.dismiss}
            value={searchInput}
          />
          <SearchIcon onPress={handleSearchContact}>
            <Feather name="search" color="#7159c1" size={20} />
          </SearchIcon>
        </Header>

        {typing && (
          <ContactsFound>
            {searchResult?.map((contact) => (
              <ContactInfo key={Number(contact?.id)}>
                <ContactContainer>
                  <ContactImage source={{uri: contact?.photo}} />
                  <ContactLabels>
                    <ContactName>{contact?.username}</ContactName>
                    <ContactLogin>{contact?.email}</ContactLogin>
                  </ContactLabels>
                </ContactContainer>
                <ContactAction
                  onPress={() => handleNavigateToMessages(contact)}>
                  <AntDesign name="message1" color="#7159c1" size={25} />
                </ContactAction>
              </ContactInfo>
            ))}
          </ContactsFound>
        )}

        {!typing && (
          <NoResearch>
            <NoResearchBackground source={searchContact} />
            <NoResearchLabel>
              {/* Encontre seus contatos e comece o bate-papo */}
              Encontre seus contatos
            </NoResearchLabel>
          </NoResearch>
        )}
      </Container>
    </Wrapper>
  );
};

export default Friends;
