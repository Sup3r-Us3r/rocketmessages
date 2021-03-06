import styled from 'styled-components/native';
import {Platform, Dimensions} from 'react-native';

// Set 10% of the screen height for padding
const padding = (10 / 100) * Math.round(Dimensions.get('screen').height);

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
  width: 80%;
  margin: 0 auto;
  align-items: center;
  justify-content: center;
  padding: 0 0 ${String(padding) + 'px'} 0;
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
  border-radius: 8px;
  width: 100%;
`;

export const EmailInput = styled.TextInput`
  font-size: 18px;
  color: #333;
  padding: 20px 10px 10px 10px;
  border-bottom-width: 2px;
  border-bottom-color: #7159c1;
  border-radius: 8px;
  width: 100%;
`;

export const PasswordInput = styled.TextInput`
  font-size: 18px;
  color: #333;
  padding: 20px 10px 10px 10px;
  border-bottom-width: 2px;
  border-bottom-color: #7159c1;
  border-radius: 8px;
  width: 100%;
`;

export const ForgotPassword = styled.TouchableOpacity.attrs(() => ({
  activeOpacity: 0.4,
}))`
  align-self: flex-end;
  margin-top: 15px;
  padding: 10px 5px 0 5px;
`;

export const ForgotPasswordLabel = styled.Text`
  font-size: 16px;
  color: #afafaf;
  margin-top: -13px;
`;

export const AuthRequest = styled.TouchableOpacity.attrs(() => ({
  activeOpacity: 0.8,
}))`
  background: #7159c1;
  margin: 20px 0;
  padding: 17px 20px;
  width: 100%;
  border-radius: 5px;
  align-self: center;
`;

export const AuthRequestLabel = styled.Text`
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
