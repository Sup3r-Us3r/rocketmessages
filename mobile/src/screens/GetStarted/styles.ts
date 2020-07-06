import styled from 'styled-components/native';
import {Platform} from 'react-native';
import {RectButton} from 'react-native-gesture-handler';

export const CloseKeyboard = styled.TouchableWithoutFeedback``;

export const Wrapper = styled.KeyboardAvoidingView.attrs(() => ({
  behavior: Platform.OS === 'android' ? 'height' : 'padding',
}))`
  flex: 1;
  background: #fff;
`;

export const Container = styled.View`
  flex: 1;
  justify-content: space-between;
  align-items: center;
`;

export const BackgroundImage = styled.Image.attrs(() => ({
  resizeMode: 'cover',
}))`
  height: 350px;
  width: 350px;
`;

export const WelcomeMessage = styled.Text`
  font-size: 30px;
  font-weight: bold;
  text-align: center;
  color: #7159c1;
`;

export const NameInput = styled.TextInput`
  font-size: 18px;
  color: #333;
  padding: 15px;
  border-bottom-width: 2px;
  border-bottom-color: #7159c1;
  width: 80%;
  border-radius: 8px;
`;

export const ButtonGetStarted = styled(RectButton)`
  background: #7159c1;
  padding: 20px;
  width: 80%;
  border-radius: 50px;
  margin-bottom: 20px;
`;

export const GetStartedLabel = styled.Text`
  text-align: center;
  font-size: 16px;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #fff;
`;
