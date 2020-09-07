import {Platform, StyleSheet} from 'react-native';
import styled from 'styled-components/native';
import EvilIcons from 'react-native-vector-icons/EvilIcons';

export const Wrapper = styled.KeyboardAvoidingView.attrs(() => ({
  behavior: Platform.OS === 'android' ? undefined : 'padding',
  enabled: true,
}))`
  flex: 1;
  background: #fff;
`;

export const Header = styled.View`
  position: relative;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 10px 0;
  flex-direction: row;
  background: #fff;
`;

export const Title = styled.Text`
  width: 100%;
  font-size: 18px;
  color: #777;
  text-align: center;
`;

export const LogoutContainer = styled.TouchableOpacity.attrs(() => ({
  activeOpacity: 0.5,
}))`
  position: absolute;
  right: 0;
  padding: 5px 10px;
`;

export const ContainerImage = styled.ImageBackground.attrs(() => ({
  resizeMode: 'cover',
}))`
  position: relative;
  flex: 1;
`;

export const ChangeImageButton = styled.TouchableOpacity.attrs(() => ({
  activeOpacity: 0.5,
}))`
  position: absolute;
  justify-content: center;
  right: 10px;
  bottom: -25px;
  height: 60px;
  width: 60px;
  background: #7159c1;
  border-radius: 55px;
`;

export const ChangeImageIcon = styled(EvilIcons).attrs(() => ({
  name: 'camera',
  color: '#fff',
  size: 45,
}))`
  text-align: center;
`;

export const Container = styled.View`
  flex: 1;
  justify-content: space-between;
  align-items: center;
  margin-top: 30px;
`;

export const WrapperText = styled.View`
  width: 90%;
  justify-content: flex-start;
  align-items: flex-start;
`;

export const ContainerUsernameField = styled.TouchableOpacity.attrs(() => ({
  activeOpacity: 0.6,
}))`
  flex-direction: row;
  justify-content: flex-start;
  align-items: baseline;
  width: 100%;
  padding: 10px;
  margin-bottom: 5px;
`;

export const UsernameLabel = styled.Text`
  font-size: 18px;
  line-height: 25px;
  text-align: left;
  color: #333;
`;

export const ContainerStatusMessageField = styled.TouchableOpacity.attrs(
  () => ({
    activeOpacity: 0.6,
  }),
)`
  flex-direction: row;
  justify-content: flex-start;
  width: 100%;
  padding: 10px;
  align-items: baseline;
`;

export const StatusMessageLabel = styled.Text`
  font-size: 18px;
  line-height: 25px;
  text-align: left;
  color: #333;
`;

export const TextInfoGroup = styled.View`
  margin-left: 5px;
  justify-content: flex-start;
`;

export const IndicatorLabel = styled.Text`
  font-size: 15px;
  margin-bottom: 3px;
  color: #aaa;
`;

export const UsernameInput = styled.TextInput.attrs(() => ({
  autoCorrect: false,
}))`
  margin-top: 10px;
  padding: 10px 20px;
  font-size: 16px;
  color: #333;
  border-color: #7159c1;
  border-bottom-width: 2px;
`;

export const StatusMessageInput = styled.TextInput.attrs(() => ({
  multiline: true,
  autoCorrect: false,
}))`
  margin-top: 10px;
  padding: 10px 20px;
  font-size: 16px;
  color: #333;
  border-color: #7159c1;
  border-bottom-width: 2px;
`;

export const ShowModalEditTextInput = styled.View`
  position: absolute;
  bottom: 0;
  height: 120px;
  width: 100%;
  background: #fff;
  border-top-left-radius: 25px;
  border-top-right-radius: 25px;
`;

export const shadowContainer = StyleSheet.create({
  shadowBox: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,
    elevation: 24,
  },
});

export const ModalActions = styled.View`
  flex-direction: row;
  justify-content: flex-end;
  margin-bottom: 20px;
`;

export const ModalButton = styled.TouchableOpacity.attrs(() => ({
  activeOpacity: 0.8,
}))`
  margin: 10px 15px 10px 0;
`;

export const ModalButtonLabel = styled.Text`
  font-size: 15px;
  font-weight: bold;
  text-transform: uppercase;
  color: #999;
  padding: 10px;
`;
