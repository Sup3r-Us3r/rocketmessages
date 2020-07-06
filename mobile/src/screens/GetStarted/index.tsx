import React, {useState, useEffect, ReactChildren} from 'react';
import {Keyboard} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';

import getStartedBackground from '../../assets/getStartedBackground.png';

import {
  CloseKeyboard,
  Wrapper,
  Container,
  BackgroundImage,
  WelcomeMessage,
  NameInput,
  ButtonGetStarted,
  GetStartedLabel,
} from './styles';

const GetStarted = () => {
  // States
  const [nameInput, setNameInput] = useState<string>('');

  // Navigation
  const navigation = useNavigation();

  async function handleNavigateToBottomTabs() {
    try {
      await AsyncStorage.setItem('@rocketmessages_username', nameInput);
    } catch (err) {
      console.log(err);
    }

    return navigation.navigate('BottomTabs');
  }

  const DismissKeyboard: React.FC<{}> = ({children}) => {
    return (
      <CloseKeyboard onPress={() => Keyboard.dismiss()}>
        {children}
      </CloseKeyboard>
    );
  };

  useEffect(() => {
    async function handleGetNameFromStorage() {
      try {
        const name = await AsyncStorage.getItem('@rocketmessages_username');

        if (name) {
          setNameInput(name);
        }
      } catch (err) {
        console.log(err);
      }
    }

    handleGetNameFromStorage();
  }, []);

  return (
    <DismissKeyboard>
      <Wrapper>
        <Container>
          <BackgroundImage source={getStartedBackground} />
          <WelcomeMessage>Bem vindo ao Rocket Messages</WelcomeMessage>
          <NameInput
            placeholder="Digite seu nome"
            onChangeText={setNameInput}
            autoCorrect={false}
            onSubmitEditing={Keyboard.dismiss}
          />
          <ButtonGetStarted onPress={handleNavigateToBottomTabs}>
            <GetStartedLabel>Começar</GetStartedLabel>
          </ButtonGetStarted>
        </Container>
      </Wrapper>
    </DismissKeyboard>
  );
};

export default GetStarted;
