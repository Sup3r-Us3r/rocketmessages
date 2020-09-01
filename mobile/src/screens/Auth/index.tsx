import React, {useState, useContext} from 'react';
import {useNavigation} from '@react-navigation/native';
import {Keyboard} from 'react-native';

import AuthContext from '../../contexts/auth';

import {
  Wrapper,
  ScrollView,
  Container,
  BackgroundImage,
  WelcomeMessage,
  UsernameInput,
  EmailInput,
  PasswordInput,
  ForgotPassword,
  ForgotPasswordLabel,
  AuthStartAction,
  AuthStartActionLabel,
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

  return (
    <Wrapper>
      <>
        <ScrollView>
          <Container>
            <BackgroundImage />

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

            <AuthStartAction onPress={handleSubmit}>
              <AuthStartActionLabel>
                {changeLayout === 'login' ? 'Entrar' : 'Registrar'}
              </AuthStartActionLabel>
            </AuthStartAction>
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
