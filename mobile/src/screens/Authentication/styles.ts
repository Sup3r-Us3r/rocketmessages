import styled from 'styled-components/native';
import {Platform, Animated} from 'react-native';

export const CloseKeyboard = styled.TouchableWithoutFeedback``;

export const Wrapper = styled.KeyboardAvoidingView.attrs(() => ({
  behavior: Platform.OS === 'android' ? 'height' : 'padding',
}))`
  flex: 1;
  background: #fff;
`;

export const Container = styled.View`
  flex: 1;
  justify-content: space-around;
`;

export const ContainerGetInfo = styled(Animated.View)`
  display: flex;
  align-items: center;
  width: 100%;
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
  margin-right: 45px;
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

export const AuthActionButton = styled.TouchableOpacity.attrs(() => ({
  activeOpacity: 0.6,
}))`
  align-self: center;
`;

export const AuthActionLabel = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: #7159c1;
`;
