import {Animated} from 'react-native';
import styled from 'styled-components/native';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';

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
`;

export const HeaderContainer = styled.View`
  flex-direction: row;
  margin-top: 5px;
  align-items: center;
`;

export const ScreenBackContainer = styled.TouchableOpacity.attrs(() => ({
  activeOpacity: 0.8,
}))`
  z-index: 9999;
  position: absolute;
  left: 5px;
  padding: 0 5px;
`;

export const ScreenBackIcon = styled(Feather).attrs(() => ({
  name: 'arrow-left',
  color: '#7159c1',
  size: 28,
}))``;

export const Title = styled.Text`
  top: 15px;
  margin-bottom: 30px;
  text-align: center;
  width: 100%;
  font-size: 18px;
  color: #7159c1;
`;

export const ContactContainer = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 10px 15px;
  border-radius: 7px;
`;

export const ContactPhoto = styled.Image.attrs(() => ({
  resizeMode: 'cover',
}))`
  height: 50px;
  width: 50px;
  border-radius: 25px;
  margin-right: 10px;
`;

export const ContactInfo = styled.View`
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const ContactInfoUser = styled.View``;

export const ContactAction = styled.TouchableOpacity.attrs(() => ({
  activeOpacity: 0.5,
}))``;

export const ContactActionIcon = styled(AntDesign).attrs(() => ({
  name: 'adduser',
  color: '#7159c1',
  size: 25,
}))`
  padding: 0 5px;
`;

export const ContactName = styled.Text`
  font-size: 16px;
  color: #a9b3a9;
  font-weight: bold;
`;

export const ContactStatus = styled.Text`
  font-size: 15px;
  color: #0a0a11;
`;

export const NoFrequentContactContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export const NoFrequentContact = styled.Image.attrs(() => ({
  resizeMode: 'cover',
}))`
  height: 200px;
  width: 200px;
`;

export const NoFrequentContactLabel = styled.Text`
  margin-top: 15px;
  font-size: 18px;
  color: #ccc;
`;
