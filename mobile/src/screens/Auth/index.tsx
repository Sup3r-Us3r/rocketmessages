import React, {useState, useContext} from 'react';
import {Keyboard, Dimensions} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Lottie from 'lottie-react-native';

import AuthContext from '../../contexts/auth';

import chatAnimation from '../../animations/chatAnimation.json';

import {
  Wrapper,
  ScrollView,
  Container,
  WelcomeMessage,
  UsernameInput,
  EmailInput,
  PasswordInput,
  ForgotPassword,
  ForgotPasswordLabel,
  AuthRequest,
  AuthRequestLabel,
  ChangeLayoutAuthContainer,
  AuthActionLabel,
} from './styles';

const Auth = () => {
  // Navigation
  const navigation = useNavigation();

  // Context
  const {signIn, signUp} = useContext(AuthContext);

  // States
  const [changeLayout, setChangeLayout] = useState<string>('login');
  const [usernameInput, setUsernameInput] = useState<string>('');
  const [emailInput, setEmailInput] = useState<string>('');
  const [passwordInput, setPasswordInput] = useState<string>('');

  async function handleSignIn() {
    const userDataInput = {
      email: emailInput,
      password: passwordInput,
    };

    await signIn(userDataInput);
  }

  async function handleSignUp() {
    const userDataInput = {
      username: usernameInput,
      email: emailInput,
      password: passwordInput,
    };

    return await signUp(userDataInput);
  }

  function handleSubmit() {
    if (changeLayout === 'login') {
      handleSignIn();
    } else {
      handleSignUp();
    }
  }

  function handleChangeLayout() {
    if (changeLayout === 'login') {
      setChangeLayout('register');
    } else {
      setChangeLayout('login');
    }
  }

  function handleForgotPassword() {
    return navigation.navigate('ForgotPassword');
  }

  function handleBestHeightForImage() {
    const percentage = 30;

    const height =
      (percentage / 100) * Math.round(Dimensions.get('screen').height);

    return height;
  }

  return (
    <Wrapper>
      <>
        <ScrollView>
          <Container>
            <Lottie
              source={chatAnimation}
              autoPlay
              loop
              resizeMode="contain"
              // eslint-disable-next-line react-native/no-inline-styles
              style={{height: handleBestHeightForImage(), width: 300}}
            />

            <WelcomeMessage>Rocket Messages</WelcomeMessage>

            {changeLayout === 'register' && (
              <UsernameInput
                placeholder="Digite seu nome"
                onChangeText={setUsernameInput}
                autoCorrect={false}
              />
            )}
            <EmailInput
              placeholder="Digite seu email"
              onChangeText={setEmailInput}
              autoCorrect={false}
              autoCapitalize="none"
            />
            <PasswordInput
              placeholder="Digite sua senha"
              onChangeText={setPasswordInput}
              autoCorrect={false}
              secureTextEntry
              onSubmitEditing={Keyboard.dismiss}
            />

            {changeLayout === 'login' && (
              <ForgotPassword onPress={handleForgotPassword}>
                <ForgotPasswordLabel>Esqueci minha senha</ForgotPasswordLabel>
              </ForgotPassword>
            )}

            <AuthRequest onPress={handleSubmit}>
              <AuthRequestLabel>
                {changeLayout === 'login' ? 'Entrar' : 'Registrar'}
              </AuthRequestLabel>
            </AuthRequest>
          </Container>
        </ScrollView>

        <ChangeLayoutAuthContainer onPress={handleChangeLayout}>
          <AuthActionLabel>
            {changeLayout === 'login'
              ? 'Criar uma conta'
              : 'Já tenho uma conta'}
          </AuthActionLabel>
        </ChangeLayoutAuthContainer>
      </>
    </Wrapper>
  );
};

export default Auth;
