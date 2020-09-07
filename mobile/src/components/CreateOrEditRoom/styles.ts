import {Animated} from 'react-native';
import styled from 'styled-components/native';
import Feather from 'react-native-vector-icons/Feather';
import EvilIcons from 'react-native-vector-icons/EvilIcons';

export const Wrapper = styled(Animated.View)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #fff;
`;

export const ScrollView = styled.ScrollView.attrs(() => ({
  showsVerticalScrollIndicator: false,
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

export const ScreenBackContainer = styled.TouchableOpacity.attrs(() => ({
  activeOpacity: 0.8,
}))`
  position: absolute;
  top: 10px;
  left: 5px;
  padding: 0 5px;
`;

export const ScreenBackIcon = styled(Feather).attrs(() => ({
  name: 'arrow-left',
  color: '#7159c1',
  size: 28,
}))`
  background: transparent;
`;

export const AvatarContainer = styled.View`
  position: relative;
`;

export const DefaultAvatar = styled.View`
  align-items: center;
  justify-content: center;
  height: 300px;
  width: 300px;
  background: #eee;
  border-radius: 150px;
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
  bottom: 10px;
  right: 30px;
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
  margin-top: 40px;
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
