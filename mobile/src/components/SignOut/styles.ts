import styled from 'styled-components/native';

export const Wrapper = styled.View`
  flex: 1;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
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
