import styled from 'styled-components/native';
import {Platform} from 'react-native';
import EvilIcons from 'react-native-vector-icons/EvilIcons';

// export const Wrapper = styled.View`
//   flex: 1;
//   justify-content: space-between;
//   align-items: center;
//   background: #fff;
// `;

export const Wrapper = styled.KeyboardAvoidingView.attrs(() => ({
  behavior: Platform.OS === 'android' ? 'height' : 'padding',
}))`
  flex: 1;
  justify-content: space-between;
  background: #fff;
`;

export const Container = styled.View`
  align-items: center;
  padding: 20px 10px;
`;

export const Title = styled.Text`
  font-size: 27px;
  font-weight: bold;
  color: #7159c1;
  margin-bottom: 20px;
  align-self: flex-start;
`;

export const ContainerImage = styled.View`
  position: relative;
`;

export const UserImage = styled.Image.attrs(() => ({
  resizeMode: 'cover',
}))`
  height: 250px;
  width: 250px;
  border-radius: 125px;
`;

export const ContainerChangeImage = styled.TouchableOpacity.attrs(() => ({
  activeOpacity: 0.5,
}))`
  justify-content: center;
  position: absolute;
  right: 20px;
  bottom: 10px;
  background: #7159c1;
  height: 45px;
  width: 45px;
  border-radius: 55px;
`;

export const ChangeImage = styled(EvilIcons).attrs(() => ({
  name: 'camera',
  color: '#fff',
  size: 40,
}))`
  text-align: center;
`;

export const ButtonApplySettings = styled.TouchableOpacity.attrs(() => ({
  activeOpacity: 0.8,
}))`
  align-items: center;
  align-self: center;
  width: 70%;
  padding: 20px;
  background: #7159c1;
  border-radius: 50px;
  margin-bottom: 50px;
`;

export const ButtonLabel = styled.Text`
  font-size: 16px;
  text-transform: uppercase;
  color: #fff;
  font-weight: bold;
  letter-spacing: 0.5px;
`;

export const UsernameInput = styled.TextInput.attrs(() => ({
  autoCorrect: false,
}))`
  margin: 10px 0;
  font-size: 25px;
  border-color: #edf2f8;
  border-bottom-width: 2px;
  border-radius: 3px;
`;

export const StatusMessage = styled.TextInput.attrs(() => ({
  multiline: true,
  autoCorrect: false,
}))`
  font-size: 16px;
  text-align: center;
  border-color: #edf2f8;
  border-bottom-width: 2px;
  border-radius: 3px;
  max-width: 330px;
`;
