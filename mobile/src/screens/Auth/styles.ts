import styled from 'styled-components/native';
import {Platform} from 'react-native';

import getStartedBackground from '../../assets/getStartedBackground.png';

export const Wrapper = styled.KeyboardAvoidingView.attrs(() => ({
  behavior: Platform.OS === 'android' ? undefined : 'padding',
  enabled: true,
}))`
  flex: 1;
  background: #fff;
`;

export const ScrollView = styled.ScrollView.attrs(() => ({
  contentContainerStyle: {
    flex: 1,
  },
  keyboardShouldPersistTaps: 'handled',
}))``;

export const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 0 0 150px 0;
`;

export const BackgroundImage = styled.Image.attrs(() => ({
  resizeMode: 'cover',
  source: getStartedBackground,
}))`
  height: 250px;
  width: 250px;
`;

export const WelcomeMessage = styled.Text`
  font-size: 30px;
  font-weight: bold;
  text-align: center;
  color: #7159c1;
`;

export const UsernameInput = styled.TextInput`
  font-size: 18px;
  color: #333;
  padding: 20px 10px 10px 10px;
  border-bottom-width: 2px;
  border-bottom-color: #7159c1;
  width: 80%;
  border-radius: 8px;
`;

export const EmailInput = styled.TextInput`
  font-size: 18px;
  color: #333;
  padding: 20px 10px 10px 10px;
  border-bottom-width: 2px;
  border-bottom-color: #7159c1;
  width: 80%;
  border-radius: 8px;
`;

export const PasswordInput = styled.TextInput`
  font-size: 18px;
  color: #333;
  padding: 20px 10px 10px 10px;
  border-bottom-width: 2px;
  border-bottom-color: #7159c1;
  width: 80%;
  border-radius: 8px;
`;

export const ForgotPassword = styled.TouchableOpacity.attrs(() => ({
  activeOpacity: 0.4,
}))`
  align-self: flex-end;
  margin: 30px 45px 0 0;
`;

export const ForgotPasswordLabel = styled.Text`
  font-size: 16px;
  color: #afafaf;
  margin-top: -13px;
`;

export const AuthStartAction = styled.TouchableOpacity.attrs(() => ({
  activeOpacity: 0.8,
}))`
  background: #7159c1;
  margin: 20px 0;
  padding: 20px;
  width: 80%;
  border-radius: 50px;
  align-self: center;
`;

export const AuthStartActionLabel = styled.Text`
  text-align: center;
  font-size: 16px;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #fff;
`;

export const ChangeLayoutAuthContainer = styled.TouchableOpacity.attrs(() => ({
  activeOpacity: 0.6,
}))`
  padding: 10px;
  margin-top: 10px;
  border-top-width: 1px;
  border-color: #eee;
  align-self: center;
  width: 100%;
`;

export const AuthActionLabel = styled.Text`
  text-align: center;
  font-size: 16px;
  font-weight: bold;
  color: #7159c1;
`;
