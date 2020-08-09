import {StyleSheet} from 'react-native';
import styled from 'styled-components/native';

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
`;

export const ParticipantInfo = styled.View`
  margin-top: 20px;
  flex-direction: row;
  align-items: center;
`;

export const ParticipantPhoto = styled.Image.attrs(() => ({
  resizeMode: 'cover',
}))`
  height: 50px;
  width: 50px;
  border-radius: 25px;
  margin-right: 10px;
`;

export const ParticipantGroupLabel = styled.View`
  flex: 1;
`;

export const ParticipantName = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: #333;
  line-height: 23px;
`;

export const ParticipantStatus = styled.Text`
  font-size: 15px;
  color: #999;
  line-height: 23px;
`;
