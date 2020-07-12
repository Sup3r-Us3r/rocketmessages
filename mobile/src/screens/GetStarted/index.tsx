import React, {useState, useEffect} from 'react';
import {Animated, Easing, Keyboard} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {useNavigation} from '@react-navigation/native';
import * as Yup from 'yup';

import Toast from '../../config/toastStyles';

import api from '../../services/api';

import getStartedBackground from '../../assets/getStartedBackground.png';

import {
  // CloseKeyboard,
  Wrapper,
  Container,
  ContainerGetInfo,
  WelcomeMessage,
  UsernameInput,
  EmailInput,
  PasswordInput,
  ForgotPassword,
  ForgotPasswordLabel,
  AuthStartAction,
  AuthStartActionLabel,
  AuthActionButton,
  AuthActionLabel,
} from './styles';

interface IFieldsValidation {
  username?: string;
  email: string;
  password: string;
}

const GetStarted = () => {
  // States
  const [changeLayout, setChangeLayout] = useState<string>('login');
  const [usernameInput, setUsernameInput] = useState<string>('');
  const [emailInput, setEmailInput] = useState<string>('');
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [imageAnimation] = useState(new Animated.Value(0));
  const [upAnimation] = useState(new Animated.Value(0));

  // Navigation
  const navigation = useNavigation();

  async function handleFieldsValidation(fields: IFieldsValidation) {
    const validation = Yup.object().shape({
      username: Yup.string(),
      email: Yup.string().email().required(),
      password: Yup.string().required(),
    });

    return await validation.isValid(fields);
  }

  async function handleSubmitLogin() {
    try {
      const userData = {
        email: emailInput,
        password: passwordInput,
      };

      const validation = handleFieldsValidation(userData);

      if (!validation) {
        return Toast.error('Preenchimento incorreto.');
      }

      const response = await api.post('/login', userData);

      if (!response) {
        return Toast.error('Erro ao fazer login.');
      }

      await AsyncStorage.setItem(
        '@rocketMessages/userData',
        JSON.stringify(userData),
      );

      return navigation.navigate('BottomTabs');
    } catch (err) {
      const {error} = err.response.data;

      return Toast.error(error);
    }
  }

  async function handleSubmitRegister() {
    try {
      const userData = {
        username: usernameInput,
        email: emailInput,
        password: passwordInput,
      };

      const validation = handleFieldsValidation(userData);

      if (!validation) {
        return Toast.error('Preenchimento incorreto.');
      }

      const response = await api.post('/createuser', userData);

      if (!response) {
        return Toast.error('Erro ao criar usuário.');
      }

      return navigation.navigate('BottomTabs');
    } catch (err) {
      const {error} = err.response.data;

      return Toast.error(error);
    }
  }

  async function handleSubmit() {
    if (changeLayout === 'login') {
      handleSubmitLogin();
    } else {
      handleSubmitRegister();
    }
  }

  function handleImageAnimation() {
    return Animated.timing(imageAnimation, {
      toValue: 150,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  }

  function handleUpAnimation() {
    return Animated.timing(upAnimation, {
      toValue: changeLayout === 'login' ? -20 : -60,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  }

  function resetAnimations() {
    imageAnimation.setValue(0);
    upAnimation.setValue(0);
  }

  function handleChangeLayoutToRegister() {
    if (changeLayout === 'login') {
      setChangeLayout('register');
    } else {
      setChangeLayout('login');
    }
  }

  // const DismissKeyboard: React.FC<{}> = ({children}) => {
  //   return (
  //     <CloseKeyboard onPress={() => Keyboard.dismiss()}>
  //       {children}
  //     </CloseKeyboard>
  //   );
  // };

  useEffect(() => {
    function handleKeyboardShow() {
      handleImageAnimation();
      handleUpAnimation();
    }

    function handleKeyboardHide() {
      resetAnimations();
    }

    Keyboard.addListener('keyboardDidShow', handleKeyboardShow);
    Keyboard.addListener('keyboardDidHide', handleKeyboardHide);

    return () => {
      Keyboard.removeListener('keyboardDidShow', handleKeyboardShow);
      Keyboard.removeListener('keyboardDidHide', handleKeyboardHide);
    };
  });

  return (
    // <DismissKeyboard>
    <Wrapper>
      <Container>
        <Animated.Image
          source={getStartedBackground}
          resizeMode="cover"
          // eslint-disable-next-line react-native/no-inline-styles
          style={{
            alignSelf: 'center',
            marginTop: -10,
            height: 350,
            width: 350,
            transform: [
              {
                translateY: imageAnimation.interpolate({
                  inputRange: [0, 150],
                  outputRange: [0, changeLayout === 'login' ? -10 : -30],
                }),
              },
              {
                scaleX: imageAnimation.interpolate({
                  inputRange: [0, 150],
                  outputRange: [1, changeLayout === 'login' ? 0.8 : 0.6],
                }),
              },
              {
                scaleY: imageAnimation.interpolate({
                  inputRange: [0, 150],
                  outputRange: [1, changeLayout === 'login' ? 0.8 : 0.6],
                }),
              },
            ],
          }}
        />

        <ContainerGetInfo
          style={{
            translateY: upAnimation,
          }}>
          <WelcomeMessage>Rocket Messages</WelcomeMessage>
          {changeLayout === 'register' && (
            <UsernameInput
              placeholder="Digite seu nome"
              onChangeText={setUsernameInput}
              autoCorrect={false}
              onSubmitEditing={Keyboard.dismiss}
            />
          )}
          <EmailInput
            placeholder="Digite seu email"
            onChangeText={setEmailInput}
            autoCorrect={false}
            onSubmitEditing={Keyboard.dismiss}
          />
          <PasswordInput
            placeholder="Digite sua senha"
            onChangeText={setPasswordInput}
            autoCorrect={false}
            onSubmitEditing={Keyboard.dismiss}
          />
        </ContainerGetInfo>

        {changeLayout === 'login' && (
          <ForgotPassword>
            <ForgotPasswordLabel>Esqueci minha senha</ForgotPasswordLabel>
          </ForgotPassword>
        )}

        <AuthStartAction onPress={handleSubmit}>
          <AuthStartActionLabel>
            {changeLayout === 'login' ? 'Entrar' : 'Registrar'}
          </AuthStartActionLabel>
        </AuthStartAction>

        <AuthActionButton onPress={handleChangeLayoutToRegister}>
          <AuthActionLabel>
            {changeLayout === 'login'
              ? 'Criar uma conta'
              : 'Já possuo uma conta'}
          </AuthActionLabel>
        </AuthActionButton>
      </Container>
    </Wrapper>
    // </DismissKeyboard>
  );
};

export default GetStarted;
