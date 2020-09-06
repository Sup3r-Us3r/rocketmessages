import styled from 'styled-components/native';
import Feather from 'react-native-vector-icons/Feather';

export const Wrapper = styled.View`
  flex: 1;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.95);
`;

export const ScreenBackContainer = styled.TouchableOpacity.attrs(() => ({
  activeOpacity: 0.8,
}))`
  z-index: 9999;
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

export const RocketMessageLogo = styled.Image.attrs(() => ({
  resizeMode: 'contain',
}))`
  height: 450px;
`;

export const SignOutLabel = styled.Text`
  flex: 1;
  width: 80%;
  font-size: 20px;
  text-align: center;
  font-weight: bold;
  color: #999;
`;

export const ConfirmSignOut = styled.TouchableOpacity.attrs(() => ({
  activeOpacity: 0.3,
}))`
  height: 150px;
  width: 100%;
`;
