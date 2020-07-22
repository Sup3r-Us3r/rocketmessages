import React, {useState, useEffect} from 'react';
import {Animated, Easing, Keyboard} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {useNavigation} from '@react-navigation/native';
import * as Yup from 'yup';

import Loading from '../../components/Loading';

import api from '../../services/api';

import Toast from '../../config/toastStyles';

import getStartedBackground from '../../assets/getStartedBackground.png';

import {
  Wrapper,
  // Container,
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

const Authentication = () => {
  // States
  const [loading, setLoading] = useState<boolean>(true);
  const [changeLayout, setChangeLayout] = useState<string>('login');
  const [usernameInput, setUsernameInput] = useState<string>('');
  const [emailInput, setEmailInput] = useState<string>('');
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [imageAnimation] = useState(new Animated.Value(0));
  const [upAnimation] = useState(new Animated.Value(0));
  const [keyboardUp, setKeyboardUp] = useState<boolean>(false);

  // Navigation
  const navigation = useNavigation();

  function handleFieldsValidation(fields: IFieldsValidation) {
    const validation = Yup.object().shape({
      username:
        changeLayout === 'login' ? Yup.string() : Yup.string().required(),
      email: Yup.string().email().required(),
      password: Yup.string().required(),
    });

    return validation.isValid(fields);
  }

  async function handleSubmitLogin() {
    try {
      const userData = {
        email: emailInput,
        password: passwordInput,
      };

      const validation = await handleFieldsValidation(userData);

      if (!validation) {
        return Toast.error('Preenchimento incorreto.');
      }

      const response = await api.post('/login', userData);

      if (!response) {
        return Toast.error('Erro ao fazer login.');
      }

      await AsyncStorage.setItem(
        '@rocketMessages/userData',
        JSON.stringify(response),
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

      const validation = await handleFieldsValidation(userData);

      if (!validation) {
        return Toast.error('Preenchimento incorreto.');
      }

      const response = await api.post('/createuser', userData);

      if (!response) {
        return Toast.error('Erro ao criar usuário.');
      }

      return setChangeLayout('login');
    } catch (err) {
      const {error} = err.response.data;

      return Toast.error(error);
    }
  }

  function handleSubmit() {
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

  useEffect(() => {
    async function handleUserAlreadyLogged() {
      try {
        const userData = await AsyncStorage.getItem('@rocketMessages/userData');

        const {data} = JSON.parse(String(userData));

        if (data) {
          navigation.navigate('BottomTabs');
        }

        setInterval(() => {
          setLoading(false);
        }, 3000);
      } catch (err) {
        setInterval(() => {
          setLoading(false);
        }, 3000);

        return false;
      }
    }

    handleUserAlreadyLogged();
  }, [navigation]);

  useEffect(() => {
    function handleKeyboardShow() {
      handleImageAnimation();
      handleUpAnimation();
      setKeyboardUp(true);
    }

    function handleKeyboardHide() {
      resetAnimations();
      setKeyboardUp(false);
    }

    Keyboard.addListener('keyboardDidShow', handleKeyboardShow);
    Keyboard.addListener('keyboardDidHide', handleKeyboardHide);

    return () => {
      Keyboard.removeListener('keyboardDidShow', handleKeyboardShow);
      Keyboard.removeListener('keyboardDidHide', handleKeyboardHide);
    };
  }, []);

  return (
    <Wrapper>
      {loading ? (
        <Loading />
      ) : (
        <>
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
          </ContainerGetInfo>

          {changeLayout === 'login' && (
            <ForgotPassword keyboardUp={keyboardUp}>
              <ForgotPasswordLabel>Esqueci minha senha</ForgotPasswordLabel>
            </ForgotPassword>
          )}

          <AuthStartAction onPress={handleSubmit} keyboardUp={keyboardUp}>
            <AuthStartActionLabel>
              {changeLayout === 'login' ? 'Entrar' : 'Registrar'}
            </AuthStartActionLabel>
          </AuthStartAction>

          <AuthActionButton
            onPress={handleChangeLayoutToRegister}
            keyboardUp={keyboardUp}>
            <AuthActionLabel>
              {changeLayout === 'login'
                ? 'Criar uma conta'
                : 'Já possuo uma conta'}
            </AuthActionLabel>
          </AuthActionButton>
        </>
      )}
    </Wrapper>
  );
};

export default Authentication;
