import styled from 'styled-components/native';
import EvilIcons from 'react-native-vector-icons/EvilIcons';

export const Wrapper = styled.KeyboardAvoidingView.attrs(() => ({
  behavior: 'padding',
  enabled: true,
}))`
  flex: 1;
`;

export const ScrollView = styled.ScrollView.attrs(() => ({
  contentContainerStyle: {
    flex: 1,
  },
  keyboardShouldPersistTaps: 'handled',
}))``;

export const Title = styled.Text`
  margin-top: 20px;
  font-size: 25px;
  text-align: center;
  font-weight: bold;
  color: #7159c1;
`;

export const AvatarContainer = styled.View`
  position: relative;
`;

export const Avatar = styled.Image.attrs(() => ({
  resizeMode: 'cover',
}))`
  margin-top: 20px;
  align-self: center;
  height: 300px;
  width: 300px;
  border-radius: 150px;
`;

export const ChooseAvatar = styled.TouchableOpacity.attrs(() => ({
  activeOpacity: 0.8,
}))`
  position: absolute;
  bottom: 0;
  right: 90px;
  justify-content: center;
  align-items: center;
  height: 50px;
  width: 50px;
  border-radius: 25px;
  background: #7159c1;
`;

export const ChooseAvatarIcon = styled(EvilIcons).attrs(() => ({
  name: 'camera',
  color: '#fff',
  size: 40,
}))`
  text-align: center;
`;

export const Name = styled.TextInput`
  align-self: center;
  margin-top: 20px;
  margin-bottom: 10px;
  padding: 0 15px;
  font-size: 16px;
  color: #999;
  height: 50px;
  width: 80%;
  border-radius: 25px;
  border-width: 2px;
  border-color: #7159c1;
`;

export const Nickname = styled.TextInput`
  align-self: center;
  font-size: 16px;
  padding: 0 15px;
  color: #999;
  height: 50px;
  width: 80%;
  border-radius: 25px;
  border-width: 2px;
  border-color: #7159c1;
`;

export const CreateRoomButton = styled.TouchableOpacity.attrs(() => ({
  activeOpacity: 0.8,
}))`
  margin-top: 50px;
  align-self: center;
  justify-content: center;
  align-items: center;
  height: 50px;
  width: 80%;
  border-radius: 25px;
  background: #7159c1;
`;

export const CreateRoomLabel = styled.Text`
  font-size: 15px;
  font-weight: bold;
  color: #fff;
  text-transform: uppercase;
`;
