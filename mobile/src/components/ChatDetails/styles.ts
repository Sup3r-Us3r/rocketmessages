import {StyleSheet} from 'react-native';
import styled from 'styled-components/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

export const Wrapper = styled.View`
  justify-content: center;
  align-items: center;
`;

export const ContainerImage = styled.View`
  align-items: center;
  justify-content: center;
  margin-top: 30px;
  height: 300px;
  width: 300px;
  border-radius: 5px;
`;

export const Photo = styled.Image.attrs(() => ({
  resizeMode: 'cover',
}))`
  height: 300px;
  width: 300px;
  border-radius: 5px;
`;

export const shadowPhoto = StyleSheet.create({
  shadow: {
    zIndex: 9999,
    shadowColor: '#000',
    shadowOffset: {width: 8, height: -8},
    shadowRadius: 13,
    shadowOpacity: 0.1,
    elevation: 5,
  },
});

export const ChatTitle = styled.Text`
  margin: 10px;
  text-align: center;
  font-size: 35px;
  font-weight: bold;
  color: #333;
`;

export const ChatSubtitle = styled.Text`
  color: #999;
  font-size: 20px;
`;

export const ChatInfo = styled.Text`
  color: #999;
  font-size: 18px;
  margin-bottom: 20px;
`;

export const ParticipantsContainer = styled.View`
  margin-top: 20px;
  padding: 20px;
  justify-content: flex-start;
  width: 100%;
`;

export const ParticipantsTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: #7159c1;
  text-align: right;
  margin-bottom: 20px;
`;

interface IAdminProps {
  admin: boolean;
}

export const ParticipantInfo = styled.View`
  margin-top: ${({admin}: IAdminProps) => (admin ? '25px' : '20px')};
  flex-direction: row;
  align-items: center;
`;

export const ParticipantPhotoContainer = styled.View`
  position: relative;
  align-items: center;
  justify-content: center;
`;

export const ParticipantPhoto = styled.Image.attrs(() => ({
  resizeMode: 'cover',
}))`
  height: 50px;
  width: 50px;
  border-radius: 25px;
`;

export const ParticipantAdminIcon = styled(MaterialCommunityIcons).attrs(
  () => ({
    name: 'crown',
    size: 27,
    color: '#7159c1',
  }),
)`
  position: absolute;
  top: -25px;
`;

export const ParticipantGroupLabel = styled.View`
  flex: 1;
  margin-left: 10px;
`;

export const ParticipantName = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: #333;
  line-height: 23px;
`;

export const ParticipantStatus = styled.Text`
  font-size: 16px;
  color: #999;
  line-height: 23px;
`;

export const ParticipantActionsContainer = styled.View``;

export const ParticipantActionMakeOrUnmakeAdmin = styled.TouchableOpacity.attrs(
  () => ({
    activeOpacity: 0.6,
  }),
)``;

export const ParticipantActionMakeOrUnmakeAdminIcon = styled(Ionicons).attrs(
  () => ({
    name: 'ios-add-circle',
    size: 25,
  }),
)``;

export const ParticipantActionRemove = styled.TouchableOpacity.attrs(() => ({
  activeOpacity: 0.6,
}))``;

export const ParticipantActionRemoveIcon = styled(Ionicons).attrs(() => ({
  name: 'ios-remove-circle',
  color: '#F27E88',
  size: 25,
}))``;
