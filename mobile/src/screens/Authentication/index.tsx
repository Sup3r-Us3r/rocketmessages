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
  ScrollView,
  Container,
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
        JSON.stringify(response.data),
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
      toValue: 120,
      duration: 300,
      easing: Easing.linear,
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

        const data = JSON.parse(String(userData));

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
  }, []);

  return (
    <Wrapper>
      {loading ? (
        <Loading />
      ) : (
        <>
          <ScrollView>
            <Container>
              <Animated.Image
                source={getStartedBackground}
                resizeMode="cover"
                // eslint-disable-next-line react-native/no-inline-styles
                style={{
                  height: 250,
                  width: 250,
                  // transform: [
                  //   {
                  //     translateY: imageAnimation.interpolate({
                  //       inputRange: [0, 120],
                  //       outputRange: [0, 70],
                  //     }),
                  //   },
                  //   {
                  //     scaleX: imageAnimation.interpolate({
                  //       inputRange: [0, 120],
                  //       outputRange: [1, 0.5],
                  //     }),
                  //   },
                  //   {
                  //     scaleY: imageAnimation.interpolate({
                  //       inputRange: [0, 120],
                  //       outputRange: [1, 0.5],
                  //     }),
                  //   },
                  // ],
                }}
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
              />
              <PasswordInput
                placeholder="Digite sua senha"
                onChangeText={setPasswordInput}
                autoCorrect={false}
                secureTextEntry
                onSubmitEditing={Keyboard.dismiss}
              />

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
            </Container>
          </ScrollView>

          <AuthActionButton onPress={handleChangeLayoutToRegister}>
            <AuthActionLabel>
              {changeLayout === 'login'
                ? 'Criar uma conta'
                : 'Já tenho uma conta'}
            </AuthActionLabel>
          </AuthActionButton>
        </>
      )}
    </Wrapper>
  );
};

export default Authentication;
